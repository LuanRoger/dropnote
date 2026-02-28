import { keys } from "@repo/payments/keys";
import type { Stripe } from "@repo/payments/stripe";
import { stripe } from "@repo/payments/stripe";
import { NextResponse } from "next/server";
import { fulfillCheckout } from "@/app/actions/fulfillment";

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
    const result = await fulfillCheckout(session.id);

    console.log(
      `[stripe-webhook] ${event.type} for session ${session.id}: ${result.status}`,
    );
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
