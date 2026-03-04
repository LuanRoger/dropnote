import { cn } from "@repo/design-system/lib/utils";
import type { UpgradeProduct } from "@/types/payments";
import { UpgradeCardInteractive } from "./upgrade-card-interactive";

type UpgradeProductsListProps = {
  products: UpgradeProduct[];
  selectedIds: Set<string>;
  isCheckoutOpen: boolean;
  toggleProduct: (productId: string) => void;
};

export default function UpgradeProductsList({
  products,
  selectedIds,
  isCheckoutOpen,
  toggleProduct,
}: UpgradeProductsListProps) {
  return (
    <div className="flex flex-col gap-4">
      {products.map((product) => (
        <UpgradeCardInteractive
          accent={product.accent}
          amount={product.amount}
          className={cn(isCheckoutOpen && "pointer-events-none opacity-60")}
          currency={product.currency}
          description={product.description}
          icon={product.icon}
          key={product.id}
          name={product.name}
          onToggleAction={() => toggleProduct(product.id)}
          selected={selectedIds.has(product.id)}
        />
      ))}
    </div>
  );
}
