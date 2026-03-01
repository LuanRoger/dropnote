import { keys } from "@repo/payments/keys";
import type { Stripe } from "@repo/payments/stripe";
import { stripe } from "@repo/payments/stripe";
import { NextResponse } from "next/server";
import { fulfillCheckout } from "@/app/actions/fulfillment";
import {
  CustomerEmailNotFoundError,
  NoteCodeNotFoundInMetadataError,
  SessionHasNoFeaturesError,
} from "@/types/errors/fulfillment";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header." },
      { status: 400 },
    );
  }

  const webhookSecret = keys().STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("[stripe-webhook] STRIPE_WEBHOOK_SECRET is not configured.");
    return NextResponse.json(
      { error: "Webhook secret not configured." },
      { status: 500 },
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown webhook error";
    console.error(`[stripe-webhook] Signature verification failed: ${message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 },
    );
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const session = event.data.object;

    try {
      const result = await fulfillCheckout(session.id);

      console.log(
        `[stripe-webhook] ${event.type} for session ${session.id}: ${result}`,
      );
    } catch (error) {
      if (error instanceof NoteCodeNotFoundInMetadataError) {
        console.error(
          `[stripe-webhook] Session ${session.id} is missing noteCode in metadata. Skipping fulfilment.`,
        );
      } else if (error instanceof CustomerEmailNotFoundError) {
        console.error(
          `[stripe-webhook] Session ${session.id} has no customer email. The customer must provide an email at checkout.`,
        );
      } else if (error instanceof SessionHasNoFeaturesError) {
        console.error(
          `[stripe-webhook] Session ${session.id} has no recognisable features. Check product metadata in Stripe.`,
        );
      } else {
        const message =
          error instanceof Error ? error.message : "Unknown fulfilment error";
        console.error(
          `[stripe-webhook] Unexpected error fulfilling session ${session.id}: ${message}`,
        );
      }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
