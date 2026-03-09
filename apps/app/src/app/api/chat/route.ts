import { createGateway } from "@ai-sdk/gateway";
import { createSlateEditor, nanoid, type SlateEditor } from "@repo/editor";
import {
  getChooseToolPrompt,
  getCommentPrompt,
  getEditPrompt,
  getGeneratePrompt,
} from "@repo/editor/ai/prompts";
import {
  DEFAULT_MAX_DOCUMENT_CONTEXT_LENGTH,
  getDocumentContext,
} from "@repo/editor/ai/utils";
import type { ChatMessage, ToolName } from "@repo/editor/hooks/use-chat";
import { StaticEditorKit } from "@repo/editor/kits/static-editor-kit";
import { markdownJoinerTransform } from "@repo/editor/utils/markdown-joiner-transform";
import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateText,
  type LanguageModel,
  Output,
  streamText,
  tool,
  type UIMessageStreamWriter,
} from "ai";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
  const {
    apiKey: key,
    ctx,
    maxDocumentContextLength,
    messages: messagesRaw = [],
    model,
  } = await req.json();

  const { children, selection, toolName: toolNameParam } = ctx;

  const editor = createSlateEditor({
    plugins: StaticEditorKit,
    selection,
    value: children,
  });

  const docCtxLimit =
    typeof maxDocumentContextLength === "number"
      ? maxDocumentContextLength
      : DEFAULT_MAX_DOCUMENT_CONTEXT_LENGTH;
  const documentContext = getDocumentContext(editor, docCtxLimit) || undefined;

  const apiKey = key || process.env.AI_GATEWAY_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing AI Gateway API key." },
      { status: 401 },
    );
  }

  const isSelecting = editor.api.isExpanded();

  const gatewayProvider = createGateway({
    apiKey,
  });

  try {
    const stream = createUIMessageStream<ChatMessage>({
      execute: async ({ writer }) => {
        let toolName = toolNameParam;

        if (!toolName) {
          const prompt = getChooseToolPrompt({
            documentContext,
            isSelecting,
            messages: messagesRaw,
          });

          const enumOptions = isSelecting
            ? ["generate", "edit", "comment"]
            : ["generate", "comment"];
          const modelId = model || "google/gemini-2.5-flash";

          const { output: AIToolName } = await generateText({
            model: gatewayProvider(modelId),
            output: Output.choice({ options: enumOptions }),
            prompt,
          });

          writer.write({
            data: AIToolName as ToolName,
            type: "data-toolName",
          });

          toolName = AIToolName;
        }

        const textStream = streamText({
          experimental_transform: markdownJoinerTransform(),
          model: gatewayProvider(model || "openai/gpt-4o-mini"),
          prompt: "",
          tools: {
            comment: getCommentTool(editor, {
              documentContext,
              messagesRaw,
              model: gatewayProvider(model || "google/gemini-2.5-flash"),
              writer,
            }),
          },
          prepareStep: (step) => {
            if (toolName === "comment") {
              return {
                ...step,
                toolChoice: { toolName: "comment", type: "tool" as const },
              };
            }

            if (toolName === "edit") {
              const [editPrompt, editType] = getEditPrompt(editor, {
                documentContext,
                isSelecting,
                messages: messagesRaw,
              });

              return {
                ...step,
                activeTools: [],
                model:
                  editType === "selection"
                    ? gatewayProvider(model || "google/gemini-2.5-flash")
                    : gatewayProvider(model || "openai/gpt-4o-mini"),
                messages: [
                  {
                    content: editPrompt,
                    role: "user" as const,
                  },
                ],
              };
            }

            if (toolName === "generate") {
              const generatePrompt = getGeneratePrompt(editor, {
                documentContext,
                isSelecting,
                messages: messagesRaw,
              });

              return {
                ...step,
                activeTools: [],
                messages: [
                  {
                    content: generatePrompt,
                    role: "user" as const,
                  },
                ],
                model: gatewayProvider(model || "openai/gpt-4o-mini"),
              };
            }
          },
        });

        writer.merge(textStream.toUIMessageStream({ sendFinish: false }));
      },
    });

    return createUIMessageStreamResponse({ stream });
  } catch {
    return NextResponse.json(
      { error: "Failed to process AI request" },
      { status: 500 },
    );
  }
}

const getCommentTool = (
  editor: SlateEditor,
  {
    documentContext,
    messagesRaw,
    model,
    writer,
  }: {
    documentContext?: string;
    messagesRaw: ChatMessage[];
    model: LanguageModel;
    writer: UIMessageStreamWriter<ChatMessage>;
  },
) =>
  tool({
    description: "Comment on the content",
    inputSchema: z.object({}),
    strict: true,
    execute: async () => {
      const commentSchema = z.object({
        blockId: z
          .string()
          .describe(
            "The id of the starting block. If the comment spans multiple blocks, use the id of the first block.",
          ),
        comment: z
          .string()
          .describe("A brief comment or explanation for this fragment."),
        content: z
          .string()
          .describe(
            String.raw`The original document fragment to be commented on. It can be the entire block, a small part within a block, or span multiple blocks. If spanning multiple blocks, separate them with two \n\n.`,
          ),
      });

      const { partialOutputStream } = streamText({
        model,
        output: Output.array({ element: commentSchema }),
        prompt: getCommentPrompt(editor, {
          documentContext,
          messages: messagesRaw,
        }),
      });

      let lastLength = 0;

      for await (const partialArray of partialOutputStream) {
        for (let i = lastLength; i < partialArray.length; i++) {
          const comment = partialArray[i];
          const commentDataId = nanoid();

          writer.write({
            id: commentDataId,
            data: {
              comment,
              status: "streaming",
            },
            type: "data-comment",
          });
        }

        lastLength = partialArray.length;
      }

      writer.write({
        id: nanoid(),
        data: {
          comment: null,
          status: "finished",
        },
        type: "data-comment",
      });
    },
  });
