"use client";

import { CheckoutProvider } from "@stripe/react-stripe-js/checkout";
import { LockIcon, ShieldCheckIcon } from "lucide-react";
import IconContainer from "@/components/icon-container";
import { stripe as stripePromise } from "@/lib/payments";
import CheckoutForm from "./checkout-form";

type CheckoutPanelProps = {
  clientSecret: string;
  ownerEmail?: string;
};

const dark = {
  background: "#0a0a0a",
  foreground: "#fafafa",
  primary: "#fafafa",
  muted: "#262626",
  mutedForeground: "#a1a1a1",
  border: "#262626",
  ring: "#525252",
  destructive: "#fb2c36",
  card: "#0a0a0a",
};

function makeAppearance() {
  return {
    theme: "flat" as const,
    variables: {
      colorPrimary: dark.primary,
      colorBackground: dark.background,
      colorText: dark.foreground,
      colorDanger: dark.destructive,
      colorTextPlaceholder: dark.mutedForeground,
      colorTextSecondary: dark.mutedForeground,
      borderRadius: "0.375rem",
      fontSizeBase: "0.875rem",
      spacingUnit: "4px",
    },
    rules: {
      ".Input": {
        backgroundColor: dark.background,
        border: `1px solid ${dark.border}`,
        boxShadow: "none",
        color: dark.foreground,
        height: "2.25rem",
        paddingLeft: "0.625rem",
        paddingRight: "0.625rem",
        fontSize: "0.875rem",
        transition: "color 0.15s, box-shadow 0.15s",
      },
      ".Input:focus": {
        border: `1px solid ${dark.ring}`,
        boxShadow: `0 0 0 3px ${dark.ring}40`,
        outline: "none",
      },
      ".Input--invalid": {
        border: `1px solid ${dark.destructive}`,
        boxShadow: `0 0 0 3px ${dark.destructive}33`,
      },
      ".Input::placeholder": {
        color: dark.mutedForeground,
      },
      ".Label": {
        color: dark.foreground,
        fontSize: "0.875rem",
        fontWeight: "500",
        marginBottom: "0.375rem",
      },
      ".Error": {
        color: dark.destructive,
        fontSize: "0.875rem",
      },
      ".Tab": {
        backgroundColor: dark.muted,
        border: `1px solid ${dark.border}`,
        boxShadow: "none",
        color: dark.mutedForeground,
      },
      ".Tab:hover": {
        color: dark.foreground,
        backgroundColor: dark.muted,
      },
      ".Tab--selected": {
        backgroundColor: dark.background,
        border: `1px solid ${dark.ring}`,
        boxShadow: `0 0 0 3px ${dark.ring}40`,
        color: dark.foreground,
      },
      ".TabIcon--selected": {
        fill: dark.primary,
      },
      ".TabLabel--selected": {
        color: dark.foreground,
      },
      ".Block": {
        backgroundColor: dark.muted,
        border: `1px solid ${dark.border}`,
        boxShadow: "none",
      },
      ".CheckboxInput": {
        backgroundColor: dark.background,
        border: `1px solid ${dark.border}`,
      },
      ".CheckboxInput--checked": {
        backgroundColor: dark.primary,
        border: `1px solid ${dark.primary}`,
      },
      ".PickerItem": {
        backgroundColor: dark.muted,
        border: `1px solid ${dark.border}`,
        boxShadow: "none",
        color: dark.foreground,
      },
      ".PickerItem--selected": {
        backgroundColor: dark.background,
        border: `1px solid ${dark.ring}`,
        boxShadow: `0 0 0 3px ${dark.ring}40`,
        color: dark.foreground,
      },
      ".DropdownItem": {
        color: dark.foreground,
      },
      ".DropdownItem--highlight": {
        backgroundColor: dark.muted,
        color: dark.foreground,
      },
    },
  };
}

export function CheckoutPanel({
  clientSecret,
  ownerEmail,
}: CheckoutPanelProps) {
  const appearance = makeAppearance();

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
        <CheckoutProvider
          options={{
            clientSecret,
            elementsOptions: {
              appearance,
            },
          }}
          stripe={stripePromise}
        >
          <CheckoutForm ownerEmail={ownerEmail} />
        </CheckoutProvider>
      </div>

      <p className="flex items-center justify-center gap-1 text-center text-muted-foreground text-xs">
        <LockIcon className="size-3" />
        Your payment info is encrypted end-to-end
      </p>
    </div>
  );
}
