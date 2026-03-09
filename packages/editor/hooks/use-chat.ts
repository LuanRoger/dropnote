"use client";

import { type UseChatHelpers, useChat } from "@ai-sdk/react";
import { withAIBatch } from "@platejs/ai";
import {
  AIChatPlugin,
  aiCommentToRange,
  applyTableCellSuggestion,
} from "@platejs/ai/react";
import { getCommentKey, getTransientCommentKey } from "@platejs/comment";
import { BlockSelectionPlugin } from "@platejs/selection/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { KEYS, nanoid, TextApi } from "platejs";
import { useEditorRef, usePluginOption } from "platejs/react";
import { useEffect, useRef } from "react";

import { aiChatPlugin } from "../plugins/ai-kit";

export type ToolName = "comment" | "edit" | "generate";

export type TComment = {
  comment: {
    blockId: string;
    comment: string;
    content: string;
  } | null;
  status: "finished" | "streaming";
};

export type TTableCellUpdate = {
  cellUpdate: {
    content: string;
    id: string;
  } | null;
  status: "finished" | "streaming";
};

export type MessageDataPart = {
  toolName: ToolName;
  comment?: TComment;
  table?: TTableCellUpdate;
};

export type Chat = UseChatHelpers<ChatMessage>;

export type ChatMessage = UIMessage<Record<string, never>, MessageDataPart>;

export const useEditorAIChat = () => {
  const editor = useEditorRef();
  const options = usePluginOption(aiChatPlugin, "chatOptions");

  const baseChat = useChat<ChatMessage>({
    id: "editor",
    transport: new DefaultChatTransport({
      api: options?.api || "/api/chat",
      fetch: ((input: RequestInfo | URL, init?: RequestInit) => {
        const bodyOptions = editor.getOptions(aiChatPlugin).chatOptions?.body;
        const initBody = JSON.parse(init?.body as string);

        const body = {
          ...initBody,
          ...bodyOptions,
        };

        return fetch(input, {
          ...init,
          body: JSON.stringify(body),
        });
      }) as typeof fetch,
    }),
    onData(data) {
      if (data.type === "data-toolName") {
        editor.setOption(AIChatPlugin, "toolName", data.data as ToolName);
      }

      if (data.type === "data-table" && data.data) {
        handleTableData(data.data as TTableCellUpdate);
      }

      if (data.type === "data-comment" && data.data) {
        handleCommentData(data.data as TComment);
      }
    },

    ...options,
  });

  const handleTableData = (tableData: TTableCellUpdate) => {
    if (tableData.status === "finished") {
      const chatSelection = editor.getOption(AIChatPlugin, "chatSelection");

      if (!chatSelection) {
        return;
      }

      editor.tf.setSelection(chatSelection);

      return;
    }

    const { cellUpdate } = tableData;

    if (!cellUpdate) {
      return;
    }

    withAIBatch(editor, () => {
      applyTableCellSuggestion(editor, cellUpdate);
    });
  };

  const handleCommentData = (commentData: TComment) => {
    if (commentData.status === "finished") {
      editor.getApi(BlockSelectionPlugin).blockSelection.deselect();

      return;
    }

    if (!commentData.comment) {
      return;
    }

    const aiComment = commentData.comment;
    const range = aiCommentToRange(editor, aiComment);

    if (!range) {
      console.warn("No range found for AI comment");

      return;
    }

    const discussionId = nanoid();

    editor.tf.withMerging(() => {
      editor.tf.setNodes(
        {
          [getCommentKey(discussionId)]: true,
          [getTransientCommentKey()]: true,
          [KEYS.comment]: true,
        },
        {
          at: range,
          match: TextApi.isText,
          split: true,
        },
      );
    });
  };

  const baseChatRef = useRef(baseChat);
  baseChatRef.current = baseChat;

  const { status, messages, error } = baseChat;

  // biome-ignore lint/correctness/useExhaustiveDependencies: Both are stable references that never change identity, so they don't need to be deps.
  useEffect(() => {
    editor.setOption(
      AIChatPlugin,
      "chat",
      baseChatRef.current as UseChatHelpers<ChatMessage>,
    );
  }, [status, messages, error]);

  return baseChat;
};
