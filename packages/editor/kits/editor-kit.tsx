import type { AnyPluginConfig } from "@platejs/core";
import { createPlateEditor } from "platejs/react";
import { BottomStatusPlugin } from "../plugins/bottom-status-plugin";
import { YjsKit } from "../plugins/yjs-kit";
import type { Badge } from "../types/badge";
import type { EditorOptions } from "../types/editor";
import type { NoteBody } from "../types/notes";
import { BasicEditorKit } from "./basic-editor-kit";

type EditorKitOptions = {
  yjs?: {
    name: string;
    color: string;
    roomName: string;
    wssUrl: string;
    token: string;
  };
  bottomStatus?: {
    maxLength: number;
    expireAt?: Date;
    badges: Badge[];
  };
};

export const EditorKit: (options: EditorKitOptions) => AnyPluginConfig[] = (
  options: EditorKitOptions,
) => {
  const { yjs, bottomStatus } = options;

  const kits = [
    ...BasicEditorKit,
    BottomStatusPlugin.configure({
      options: bottomStatus,
    }),
  ];

  if (yjs) {
    kits.push(...YjsKit(yjs));
  }

  return kits;
};

export function createEditor(options: EditorOptions, initialValue: NoteBody) {
  const { maxLength, badges = [], colabration, expireAt } = options;

  return createPlateEditor({
    plugins: EditorKit({
      yjs: colabration,
      bottomStatus: {
        maxLength,
        expireAt,
        badges,
      },
    }),
    value: initialValue,
    maxLength,
  });
}
