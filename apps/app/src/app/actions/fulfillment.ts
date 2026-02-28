"use server";

import {
  createFulfilledOrder,
  isFulfilledOrder,
} from "@repo/database/queries/fulfilled-orders";
import { applyFeaturesToNote } from "@repo/database/queries/notes";
import { stripe } from "@repo/payments/stripe";
import {
  NoteCodeNotFoundInMetadataError,
  SessionHasNoFeaturesError,
} from "@/types/errors/fulfillment";
import type { FulfillmentResult } from "@/types/fulfillment";

export async function fulfillCheckout(
  sessionId: string,
): Promise<FulfillmentResult> {
  const alreadyFulfilled = await isFulfilledOrder(sessionId);
  if (alreadyFulfilled) {
    return "already_fulfilled";
  }

  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items", "line_items.data.price.product"],
  });

  if (checkoutSession.payment_status === "unpaid") {
    return "unpaid";
  }

  const noteCode = checkoutSession.metadata?.noteCode;
  if (!noteCode) {
    throw new NoteCodeNotFoundInMetadataError();
  }

  const features: string[] = [];
  const lineItems = checkoutSession.line_items?.data ?? [];

  for (const item of lineItems) {
    const price = item.price;
    if (!price) {
      continue;
    }

    const product = price.product;
    if (!product || typeof product === "string") {
      continue;
    }

    if ("metadata" in product && product.metadata?.name) {
      features.push(product.metadata.name);
    }
  }

  if (features.length === 0) {
    throw new SessionHasNoFeaturesError(sessionId);
  }

  Promise.all([
    await applyFeaturesToNote(noteCode, features),
    await createFulfilledOrder({
      sessionId,
      noteCode,
      features,
    }),
  ]);

  return "fulfilled";
}
