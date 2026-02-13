import { createPlatePlugin } from "platejs/react";
import BottomStatus from "../components/bottom-status";

export const BottomStatusKit = [
  createPlatePlugin({
    key: "bottom-status",
    render: {
      afterEditable: () => <BottomStatus />,
    },
  }),
];
