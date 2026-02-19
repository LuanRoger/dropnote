import { createPlatePlugin } from "platejs/react";
import BottomStatus from "../components/bottom-status";
import type { Badge } from "../types/badge";

type BottomStatusPluginConfig = {
  maxLength: number;
  expireAt?: Date;
  badges: Badge[];
};

export const BottomStatusPlugin = createPlatePlugin<
  "bottom_status",
  BottomStatusPluginConfig
>({
  key: "bottom_status",
  options: {
    maxLength: 10,
    expireAt: undefined,
    badges: [],
  },
  render: {
    afterEditable: () => <BottomStatus />,
  },
});
