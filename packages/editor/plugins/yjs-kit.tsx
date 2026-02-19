"use client";

import { YjsPlugin } from "@platejs/yjs/react";
import type { AnyPluginConfig } from "platejs";
import { RemoteCursorOverlay } from "../components/remote-cursor-overlay";

export const YjsKit = ({
  name,
  color,
  roomName,
  wssUrl,
  token,
}: {
  name: string;
  color: string;
  roomName: string;
  wssUrl: string;
  token: string;
}): AnyPluginConfig[] => [
  YjsPlugin.configure({
    render: {
      afterEditable: RemoteCursorOverlay,
    },
    options: {
      cursors: {
        data: {
          name,
          color,
        },
      },
      providers: [
        {
          type: "hocuspocus",
          options: {
            name: roomName,
            url: wssUrl,
            token,
          },
        },
      ],
    },
  }),
];
