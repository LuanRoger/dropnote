import { InfinityIcon, ShieldIcon } from "lucide-react";
import type { UpgradeFeature } from "@/types/notes";

export const PRODUCT_ICONS: Record<UpgradeFeature, React.ReactNode> = {
  secure: <ShieldIcon className="size-4" />,
  permanent: <InfinityIcon className="size-4" />,
};
