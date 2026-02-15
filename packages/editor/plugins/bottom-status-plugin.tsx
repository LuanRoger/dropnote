import { createPlatePlugin } from "platejs/react";
import BottomStatus from "../components/bottom-status";
import type { Badge } from "../types/badge";

type BottomStatusPluginConfig = {
  maxLength: number;
  badges: Badge[];
};

export const BottomStatusPlugin = createPlatePlugin<
  "bottom-status",
  BottomStatusPluginConfig
>({
  key: "bottom-status",
  options: {
    maxLength: 10,
    badges: [],
  },
  render: {
    afterEditable: () => <BottomStatus />,
  },
});
