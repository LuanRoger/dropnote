import { createPlatePlugin } from "platejs/react";
import BottomStatus from "../components/bottom-status";
import type { Badge } from "../types/badge";

type BottomStatusPluginConfig = {
  maxLength: number;
  expireAt: Date | null;
  upgradeButtonHref?: string;
  badges: Badge[];
};

export const BottomStatusPlugin = createPlatePlugin<
  "bottom_status",
  BottomStatusPluginConfig
>({
  key: "bottom_status",
  options: {
    maxLength: 10,
    expireAt: null,
    upgradeButtonHref: undefined,
    badges: [],
  },
  render: {
    afterEditable: () => <BottomStatus />,
  },
});
