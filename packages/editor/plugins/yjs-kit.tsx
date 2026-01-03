import { YjsPlugin } from "@platejs/yjs/react";
import { RemoteCursorOverlay } from "../components/remote-cursor-overlay";

export const YjsKit = [
  YjsPlugin.configure({
    render: {
      afterEditable: RemoteCursorOverlay,
    },
    options: {
      cursors: {
        data: {
          name: "Anonimo",
          color: "#aabbcc",
        },
      },
      providers: [
        {
          type: "hocuspocus",
          options: {
            name: "test",
            url: "ws://localhost:3001",
          },
        },
      ],
    },
  }),
];
