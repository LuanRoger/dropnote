"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@repo/design-system/components/ui/field";
import { Input } from "@repo/design-system/components/ui/input";
import { PaymentElement, useCheckout } from "@stripe/react-stripe-js/checkout";
import { InfoIcon, LockIcon } from "lucide-react";
import { type ChangeEvent, type SubmitEvent, useState } from "react";
import LoadingSpinner from "@/components/loading-spinner";
import { obfuscateEmail } from "@/utils/email";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@repo/design-system/components/ui/alert";

type CheckoutFormProps = {
  ownerEmail?: string;
};

export default function CheckoutForm({ ownerEmail }: CheckoutFormProps) {
  const checkoutState = useCheckout();
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const emailMismatch = Boolean(
    ownerEmail &&
    email.length > 0 &&
    email.toLowerCase() !== ownerEmail.toLowerCase(),
  );

  async function handleEmailChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setEmail(value);
    setErrorMessage(null);

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

    if (ownerEmail && email.toLowerCase() !== ownerEmail.toLowerCase()) {
      setErrorMessage(
        "This email doesn't match the note owner. Only the owner can purchase upgrades for this note.",
      );
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
        <Field data-invalid={emailMismatch || undefined}>
          <FieldLabel htmlFor="checkout-email">Email</FieldLabel>
          <Input
            aria-invalid={emailMismatch}
            autoComplete="email"
            disabled={isDisabled}
            id="checkout-email"
            onChange={handleEmailChange}
            placeholder="you@example.com"
            required
            type="email"
            value={email}
          />
          {ownerEmail && emailMismatch && (
            <FieldError>
              Must match the note owner:{" "}
              <span className="font-mono">{obfuscateEmail(ownerEmail)}</span>
            </FieldError>
          )}
          {ownerEmail && !emailMismatch && (
            <FieldDescription>
              Only{" "}
              <span className="font-medium font-mono text-foreground">
                {obfuscateEmail(ownerEmail)}
              </span>{" "}
              can purchase upgrades for this note.
            </FieldDescription>
          )}
          {!ownerEmail && (
            <Alert>
              <InfoIcon className="size-4" />
              <AlertTitle>Note owner</AlertTitle>
              <AlertDescription>
                The email you enter here will be associated with the note and
                used for the purchase. For subsequent purchases, make sure to
                use the same email.
              </AlertDescription>
            </Alert>
          )}
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
        disabled={isDisabled || emailMismatch}
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
