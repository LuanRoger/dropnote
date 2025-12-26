"use client";

import { createPlatePlugin } from "platejs/react";

import { FixedToolbar } from "../components/fixed-toolbar";
import { FixedToolbarButtons } from "../components/fixed-toolbar-buttons";

export const FixedToolbarKit = [
  createPlatePlugin({
    key: "fixed-toolbar",
    render: {
      beforeEditable: () => (
        <FixedToolbar className="flex-none">
          <FixedToolbarButtons />
        </FixedToolbar>
      ),
    },
  }),
];
