"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { cn } from "@repo/design-system/lib/utils";
import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import type { StripeError } from "@stripe/stripe-js";
import { Loader2Icon, LockIcon, ShieldCheckIcon } from "lucide-react";
import { type FormEvent, useState } from "react";
import { stripe as stripePromise } from "@/lib/payments";

type CheckoutPanelProps = {
  clientSecret: string;
};

export function CheckoutPanel({ clientSecret }: CheckoutPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <ShieldCheckIcon className="size-4" />
        </div>
        <div>
          <h2 className="font-semibold text-lg">Checkout</h2>
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
              theme: "stripe",
              variables: {
                colorPrimary: "#7c3aed",
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

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!(stripe && elements)) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}${window.location.pathname}/success`,
      },
    });

    if (error) {
      setErrorMessage(
        (error as StripeError).message ?? "Something went wrong."
      );
      setIsProcessing(false);
    }
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        <fieldset className="flex flex-col gap-2">
          <label
            className="font-medium text-sm"
            htmlFor="stripe-link-authentication"
          >
            Email
          </label>
          <LinkAuthenticationElement id="stripe-link-authentication" />
        </fieldset>

        <fieldset className="flex flex-col gap-2">
          <label className="font-medium text-sm" htmlFor="stripe-payment">
            Payment details
          </label>
          <PaymentElement
            id="stripe-payment"
            options={{
              layout: "tabs",
            }}
          />
        </fieldset>
      </div>

      {errorMessage && (
        <div
          className={cn(
            "rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-destructive text-sm"
          )}
          role="alert"
        >
          {errorMessage}
        </div>
      )}

      <Button
        className="w-full gap-2"
        disabled={!(stripe && elements) || isProcessing}
        size="lg"
        type="submit"
      >
        {isProcessing ? (
          <>
            <Loader2Icon className="size-4 animate-spin" />
            Processing…
          </>
        ) : (
          <>
            <LockIcon className="size-4" />
            Pay now
          </>
        )}
      </Button>
    </form>
  );
}
