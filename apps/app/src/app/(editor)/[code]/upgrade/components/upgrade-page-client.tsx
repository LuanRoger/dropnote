"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { cn } from "@repo/design-system/lib/utils";
import { ArrowRightIcon, Loader2Icon, XIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { createPaymentIntent } from "@/app/actions/payments";
import { CheckoutPanel } from "./checkout-panel";
import { UpgradeCardInteractive } from "./upgrade-card-interactive";

export type SerializedProduct = {
  id: string;
  name: string;
  description: string | null;
  amount: number;
  currency: string;
  accent: string;
  priceId: string | null;
  recurring?: string;
  icon?: React.ReactNode;
};

type UpgradePageClientProps = {
  products: SerializedProduct[];
  noteCode: string;
};

export function UpgradePageClient({
  products,
  noteCode,
}: UpgradePageClientProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const hasSelection = selectedIds.size > 0;
  const isCheckoutOpen = clientSecret !== null;

  function toggleProduct(productId: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  }

  function handleConfirm() {
    const priceIds = products
      .filter((p) => selectedIds.has(p.id) && p.priceId)
      .map((p) => p.priceId as string);

    if (priceIds.length === 0) {
      return;
    }

    startTransition(async () => {
      const secret = await createPaymentIntent(noteCode, priceIds);
      if (secret) {
        setClientSecret(secret);
      }
    });
  }

  function handleCancelCheckout() {
    setClientSecret(null);
  }

  return (
    <div className="flex flex-1 flex-col gap-10 lg:flex-row">
      {/* Left — Product selection */}
      <div
        className={cn(
          "flex flex-col gap-6 transition-all duration-300",
          isCheckoutOpen ? "lg:w-1/2" : "w-full",
        )}
      >
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
              recurring={product.recurring}
              selected={selectedIds.has(product.id)}
            />
          ))}
        </div>

        {/* Confirm / Cancel button */}
        {isCheckoutOpen ? (
          <Button
            className="w-full gap-2"
            onClick={handleCancelCheckout}
            size="lg"
            variant="outline"
          >
            <XIcon className="size-4" />
            Change selection
          </Button>
        ) : (
          <Button
            className="w-full gap-2"
            disabled={!hasSelection || isPending}
            onClick={handleConfirm}
            size="lg"
          >
            {isPending ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                Creating checkout…
              </>
            ) : (
              <>
                Confirm selection
                <ArrowRightIcon className="size-4" />
              </>
            )}
          </Button>
        )}
      </div>

      <div
        className={cn(
          "overflow-hidden transition-all duration-500 ease-out",
          isCheckoutOpen
            ? "max-h-500 opacity-100 lg:w-1/2"
            : "max-h-0 opacity-0 lg:w-0",
        )}
      >
        {clientSecret && <CheckoutPanel clientSecret={clientSecret} />}
      </div>
    </div>
  );
}
