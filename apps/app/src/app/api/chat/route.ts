import { createGateway } from "@ai-sdk/gateway";
import { createSlateEditor, nanoid, type SlateEditor } from "@repo/editor";
import {
  getCommentPrompt,
  getEditPrompt,
  getGeneratePrompt,
} from "@repo/editor/ai/prompts";
import type { ChatMessage } from "@repo/editor/hooks/use-chat";
import { StaticEditorKit } from "@repo/editor/kits/static-editor-kit";
import { getDocumentContext } from "@repo/editor/utils/ai";
import { markdownJoinerTransform } from "@repo/editor/utils/markdown-joiner-transform";
import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  type LanguageModel,
  Output,
  streamText,
  tool,
  type UIMessageStreamWriter,
} from "ai";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { DEFAULT_MAX_DOCUMENT_CONTEXT_AI_LENGTH } from "@/constants";

export async function POST(req: NextRequest) {
  const { apiKey: key, ctx, messages: messagesRaw = [] } = await req.json();

  const { children, selection, toolName } = ctx;
  const apiKey = key || process.env.AI_GATEWAY_API_KEY;
  const model = process.env.AI_MODEL;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing AI Gateway API key." },
      { status: 401 },
    );
  }
  if (!model) {
    return NextResponse.json(
      { error: "Missing AI model configuration." },
      { status: 500 },
    );
  }

  const editor = createSlateEditor({
    plugins: StaticEditorKit,
    selection,
    value: children,
  });

  const documentContext =
    getDocumentContext(editor, DEFAULT_MAX_DOCUMENT_CONTEXT_AI_LENGTH) ||
    undefined;

  const isSelecting = editor.api.isExpanded();

  const gatewayProvider = createGateway({
    apiKey,
  });

  try {
    const stream = createUIMessageStream<ChatMessage>({
      execute: ({ writer }) => {
        const textStream = streamText({
          experimental_transform: markdownJoinerTransform(),
          model: gatewayProvider(model),
          prompt: "",
          tools: {
            comment: getCommentTool(editor, {
              documentContext,
              messagesRaw,
              model: gatewayProvider(model),
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
                    ? gatewayProvider(model)
                    : gatewayProvider(model),
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
                model: gatewayProvider(model),
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
