import type { Stripe } from "@repo/payments/stripe";
import { InfinityIcon, SparklesIcon, ZapIcon } from "lucide-react";
import { getProducts } from "@/app/actions/payments";
import type { SerializedProduct } from "./components/upgrade-page-client";
import { UpgradePageClient } from "./components/upgrade-page-client";

const PRODUCT_ICONS: Record<string, React.ReactNode> = {
  default: <SparklesIcon className="size-4" />,
  forever: <InfinityIcon className="size-4" />,
  zap: <ZapIcon className="size-4" />,
};

function getIconForProduct(name: string): React.ReactNode {
  const lower = name.toLowerCase();
  if (lower.includes("forever") || lower.includes("permanent")) {
    return PRODUCT_ICONS.forever;
  }
  if (lower.includes("zap") || lower.includes("boost")) {
    return PRODUCT_ICONS.zap;
  }
  return PRODUCT_ICONS.default;
}

function serializeProduct(product: Stripe.Product): SerializedProduct {
  const price = product.default_price as Stripe.Price | null;
  const amount = price?.unit_amount ?? 0;
  const currency = price?.currency ?? "usd";
  const accent = (product.metadata?.color as string | undefined) ?? "#7c3aed";
  const recurring = price?.recurring?.interval;
  const priceId =
    typeof product.default_price === "string"
      ? product.default_price
      : (product.default_price?.id ?? null);

  return {
    id: product.id,
    name: product.name,
    description: product.description ?? null,
    amount,
    currency,
    accent,
    priceId,
    recurring,
    icon: getIconForProduct(product.name),
  };
}

export default async function Page({ params }: PageProps<"/[code]/upgrade">) {
  const { code } = await params;
  const products = await getProducts();

  const serializedProducts = products.map(serializeProduct);

  return (
    <div className="flex flex-col gap-8 py-2">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-bold text-2xl">Upgrade your note</h1>
          <p className="max-w-sm text-muted-foreground text-sm leading-relaxed">
            Enhance your note with powerful add-ons. Pick what you need and pay
            once — no subscriptions, no surprises.
          </p>
        </div>
      </div>

      <UpgradePageClient noteCode={code} products={serializedProducts} />

      <p className="text-center text-muted-foreground/70 text-xs">
        Payments are processed securely by Stripe. All purchases are one-time
        and tied to note{" "}
        <span className="font-medium font-mono text-muted-foreground">
          {code}
        </span>
        .
      </p>
    </div>
  );
}
