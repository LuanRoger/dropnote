"use client";

import { YjsPlugin } from "@platejs/yjs/react";
import { RemoteCursorOverlay } from "../components/remote-cursor-overlay";

export const YjsKit = ({
  name,
  color,
  roomName,
  wssUrl,
}: {
  name: string;
  color: string;
  roomName: string;
  wssUrl: string;
}) => [
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
          },
        },
      ],
    },
  }),
];
