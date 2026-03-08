import { type UseChatHelpers, useChat } from "@ai-sdk/react";
import { AIChatPlugin } from "@platejs/ai/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEditorPlugin } from "platejs/react";
import { useEffect, useRef } from "react";

export type ToolName = "comment" | "edit" | "generate";

export type ChatMessage = UIMessage<
  {},
  { toolName: ToolName; comment?: unknown }
>;

export const useEditorAIChat = () => {
  const { editor, setOption } = useEditorPlugin(AIChatPlugin);

  const chat = useChat<ChatMessage>({
    id: "editor",
    api: "/api/ai",
    transport: new DefaultChatTransport(),
    onData(data) {
      if (data.type === "data-toolName") {
        editor.setOption(AIChatPlugin, "toolName", data.data);
      }
    },
  });

  // Keep a ref to the latest chat so we can sync it without making the
  // chat object itself a useEffect dependency. useChat returns a new object
  // reference on every render, which would cause an infinite loop if used
  // directly as a dependency alongside the setOption call.
  const chatRef = useRef(chat);
  chatRef.current = chat;

  useEffect(() => {
    setOption("chat", chatRef.current as UseChatHelpers<ChatMessage>);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setOption]);

  return chat;
};
