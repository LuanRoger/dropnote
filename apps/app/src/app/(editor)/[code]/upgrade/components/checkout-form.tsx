import { Button } from "@repo/design-system/components/ui/button";
import { cn } from "@repo/design-system/lib/utils";
import {
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import type { StripeError } from "@stripe/stripe-js";
import { LockIcon } from "lucide-react";
import { type SubmitEvent, useState } from "react";
import LoadingSpinner from "@/components/loading-spinner";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
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
        (error as StripeError).message ?? "Something went wrong.",
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
              layout: "auto",
            }}
          />
        </fieldset>
      </div>

      {errorMessage && (
        <div
          className={cn(
            "rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-destructive text-sm",
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
            <LoadingSpinner />
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
