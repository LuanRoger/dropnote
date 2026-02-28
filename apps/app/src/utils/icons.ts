import { PRODUCT_ICONS } from "@/assets/icons";
import type { UpgradeFeature } from "@/types/notes";

export function getIconForProduct(name: string): React.ReactNode {
  const lower = name.toLowerCase() as UpgradeFeature;

  return PRODUCT_ICONS[lower];
}
