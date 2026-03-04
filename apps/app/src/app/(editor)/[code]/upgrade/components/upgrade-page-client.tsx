"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@repo/design-system/components/ui/empty";
import { ArrowRightIcon, ShoppingCartIcon, XIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { createCheckoutSession } from "@/app/actions/payments";
import CurrencyText from "@/components/currency-text";
import LoadingSpinner from "@/components/loading-spinner";
import type { UpgradeProduct } from "@/types/payments";
import { CheckoutPanel } from "./checkout-panel";
import UpgradeProductsList from "./upgrade-products-list";

type UpgradePageClientProps = {
  products: UpgradeProduct[];
  noteCode: string;
  ownerEmail?: string;
};

export function UpgradePageClient({
  products,
  noteCode,
  ownerEmail,
}: UpgradePageClientProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const hasSelection = selectedIds.size > 0;
  const isCheckoutOpen = clientSecret !== null;
  const totalPrice = products.reduce((total, product) => {
    if (selectedIds.has(product.id)) {
      return total + product.amount;
    }
    return total;
  }, 0);
  const currency = products.length > 0 ? products[0].currency : "usd";

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
      .filter((prices) => selectedIds.has(prices.id) && prices.priceId)
      .map((prices) => prices.priceId as string);

    if (priceIds.length === 0) {
      return;
    }

    startTransition(async () => {
      const secret = await createCheckoutSession(noteCode, priceIds);
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
      <div className="flex flex-1 flex-col gap-6 transition-all duration-300">
        <UpgradeProductsList
          isCheckoutOpen={isCheckoutOpen}
          products={products}
          selectedIds={selectedIds}
          toggleProduct={toggleProduct}
        />

        <p className="flex items-end justify-between">
          <span className="font-semibold text-xl">Total</span>
          <CurrencyText
            amount={totalPrice}
            className="font-bold text-2xl"
            currency={currency}
          />
        </p>

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
                <LoadingSpinner />
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

      <div className="flex-1">
        {clientSecret ? (
          <CheckoutPanel clientSecret={clientSecret} ownerEmail={ownerEmail} />
        ) : (
          <EmptyCheckout />
        )}
      </div>
    </div>
  );
}

function EmptyCheckout() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ShoppingCartIcon />
        </EmptyMedia>
        <EmptyTitle>No products selected</EmptyTitle>
        <EmptyDescription>
          Please select at least one product and confirm your selection to
          proceed to checkout.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
