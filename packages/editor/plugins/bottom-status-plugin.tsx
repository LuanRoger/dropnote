import { createPlatePlugin } from "platejs/react";
import BottomStatus from "../components/bottom-status";

export const BottomStatusPlugin = createPlatePlugin({
  key: "bottom-status",
  options: {
    maxLenght: 10,
  },
  render: {
    afterEditable: () => <BottomStatus />,
  },
});
