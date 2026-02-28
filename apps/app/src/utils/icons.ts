import { PRODUCT_ICONS } from "@/assets/icons";

export function getIconForProduct(name: string): React.ReactNode {
  const lower = name.toLowerCase();

  return PRODUCT_ICONS[lower];
}
