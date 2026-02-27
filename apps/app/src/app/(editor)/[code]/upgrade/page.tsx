import { InfinityIcon, SparklesIcon, ZapIcon } from "lucide-react";
import { getProducts } from "@/app/actions/payments";
import UpgradeCard from "./components/upgrade-card";

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

export default async function Page({ params }: PageProps<"/[code]/upgrade">) {
  const { code } = await params;
  const products = await getProducts();

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1.5">
          <h1 className="bg-linear-to-br from-foreground via-foreground/90 to-foreground/60 bg-clip-text font-bold text-2xl text-transparent tracking-tight">
            Upgrade your note
          </h1>
          <p className="max-w-sm text-muted-foreground text-sm leading-relaxed">
            Enhance your note with powerful add-ons. Pick what you need and pay
            once — no subscriptions, no surprises.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {products.map((product) => (
          <UpgradeCard
            icon={getIconForProduct(product.name)}
            key={product.id}
            productId={product.id}
          />
        ))}
      </div>

      <p className="text-center text-muted-foreground text-xs">
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
