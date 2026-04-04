import type { Stripe } from "@repo/payments/stripe";
import { NoMetadataProductError } from "@/types/errors/payments";
import type { UpgradeProduct } from "@/types/payments";
import { getIconForProduct } from "./icons";

export function serializeProduct(
  product: Stripe.Product,
  ownedFeatures: Set<string>,
): UpgradeProduct {
  const internalName = product.metadata?.name as string | undefined;
  const price = product.default_price as Stripe.Price | null;
  const amount = price?.unit_amount ?? 0;
  const currency = price?.currency ?? "usd";
  const accent = (product.metadata?.color as string | undefined) ?? "#7c3aed";
  const recurring = price?.recurring?.interval;
  const priceId =
    typeof product.default_price === "string"
      ? product.default_price
      : (product.default_price?.id ?? null);

  if (!internalName) {
    throw new NoMetadataProductError(product.id);
  }

  return {
    id: product.id,
    name: product.name,
    description: product.description ?? null,
    internalName,
    amount,
    currency,
    accent,
    priceId,
    recurring,
    icon: getIconForProduct(internalName),
    owned: ownedFeatures.has(internalName),
  };
}
