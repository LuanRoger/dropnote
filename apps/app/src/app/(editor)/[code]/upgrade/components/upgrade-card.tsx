import type { Stripe } from "@repo/payments/stripe";
import { getProductById } from "@/app/actions/payments";
import { UpgradeCardInteractive } from "./upgrade-card-interactive";

type UpgradeCardProps = {
  productId: string;
  icon?: React.ReactNode;
  className?: string;
};

export default async function UpgradeCard({
  productId,
  icon,
  className,
}: UpgradeCardProps) {
  const product = await getProductById(productId);
  const price = product.default_price as Stripe.Price | null;

  const amount = price?.unit_amount ?? 0;
  const currency = price?.currency ?? "usd";
  const accent = (product.metadata?.color as string | undefined) ?? "#7c3aed";
  const recurring = price?.recurring?.interval;

  return (
    <UpgradeCardInteractive
      accent={accent}
      amount={amount}
      className={className}
      currency={currency}
      description={product.description ?? null}
      icon={icon}
      name={product.name}
      recurring={recurring}
    />
  );
}
