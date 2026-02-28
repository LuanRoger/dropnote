"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@repo/design-system/components/ui/field";
import { Input } from "@repo/design-system/components/ui/input";

import { PaymentElement, useCheckout } from "@stripe/react-stripe-js/checkout";
import { LockIcon } from "lucide-react";
import { type ChangeEvent, type SubmitEvent, useState } from "react";
import LoadingSpinner from "@/components/loading-spinner";

export default function CheckoutForm() {
  const checkoutState = useCheckout();
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleEmailChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setEmail(value);

    if (checkoutState.type !== "success") {
      return;
    }

    await checkoutState.checkout.updateEmail(value);
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (checkoutState.type !== "success") {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const result = await checkoutState.checkout.confirm();

    if (result.type === "error") {
      setErrorMessage(result.error.message ?? "Something went wrong.");
      setIsProcessing(false);
    }
  }

  const isLoading = checkoutState.type === "loading";
  const isReady = checkoutState.type === "success";
  const isDisabled = !isReady || isProcessing || isLoading;

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        <Field>
          <FieldLabel htmlFor="checkout-email">Email</FieldLabel>
          <Input
            autoComplete="email"
            disabled={isDisabled}
            id="checkout-email"
            onChange={handleEmailChange}
            placeholder="you@example.com"
            required
            type="email"
            value={email}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="checkout-payment">Payment details</FieldLabel>
          <PaymentElement
            id="checkout-payment"
            options={{
              layout: "auto",
            }}
          />
        </Field>
      </div>

      {errorMessage && <FieldError>{errorMessage}</FieldError>}

      <Button
        className="w-full gap-2"
        disabled={isDisabled}
        size="lg"
        type="submit"
      >
        {isLoading || isProcessing ? (
          <>
            <LoadingSpinner />
            {isLoading ? "Loading…" : "Processing…"}
          </>
        ) : (
          <>
            <LockIcon className="size-4" />
            Pay now{" "}
            {isReady ? `(${checkoutState.checkout.total.total.amount})` : ""}
          </>
        )}
      </Button>
    </form>
  );
}
