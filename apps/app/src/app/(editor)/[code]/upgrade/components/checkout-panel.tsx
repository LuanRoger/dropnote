"use client";

import { Elements } from "@stripe/react-stripe-js";
import { LockIcon, ShieldCheckIcon } from "lucide-react";
import IconContainer from "@/components/icon-container";
import { stripe as stripePromise } from "@/lib/payments";
import CheckoutForm from "./checkout-form";

type CheckoutPanelProps = {
  clientSecret: string;
};

export function CheckoutPanel({ clientSecret }: CheckoutPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <IconContainer className="size-9">
          <ShieldCheckIcon className="size-5" />
        </IconContainer>
        <div>
          <h2 className="font-bold text-lg">Checkout</h2>
          <p className="text-muted-foreground text-xs">
            Secure payment via Stripe
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <Elements
          options={{
            clientSecret,
            appearance: {
              theme: "flat",
              variables: {
                colorPrimary: "#000000",
                borderRadius: "8px",
                fontFamily:
                  'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
              },
            },
          }}
          stripe={stripePromise}
        >
          <CheckoutForm />
        </Elements>
      </div>

      <p className="flex items-center justify-center gap-1 text-center text-muted-foreground text-xs">
        <LockIcon className="size-3" />
        Your payment info is encrypted end-to-end
      </p>
    </div>
  );
}
