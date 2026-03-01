"use server";

import {
  createFulfilledOrder,
  getFulfilledOrderBySessionId,
  isFulfilledOrder,
} from "@repo/database/queries/fulfilled-orders";
import { stripe } from "@repo/payments/stripe";
import { KNOWN_FEATURES } from "@/constants";
import {
  CustomerEmailNotFoundError,
  NoteCodeNotFoundInMetadataError,
  SessionHasNoFeaturesError,
} from "@/types/errors/fulfillment";
import type { FulfillmentResult } from "@/types/fulfillment";
import type { UpgradeFeature } from "@/types/notes";
import { applyFeaturesToNote } from "./notes";

function isUpgradeFeature(value: string): value is UpgradeFeature {
  return (KNOWN_FEATURES as string[]).includes(value);
}

export async function fulfillCheckout(
  sessionId: string,
): Promise<FulfillmentResult> {
  const order = await getFulfilledOrderBySessionId(sessionId);
  if (!order) {
    return "not_found";
  }

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

  const ownerEmail = checkoutSession.customer_details?.email;
  if (!ownerEmail) {
    throw new CustomerEmailNotFoundError(sessionId);
  }

  const lineItems = checkoutSession.line_items?.data ?? [];
  const features: UpgradeFeature[] = [];

  for (const item of lineItems) {
    const price = item.price;
    if (!price) {
      continue;
    }

    const product = price.product;
    if (!product || typeof product === "string") {
      continue;
    }

    if ("metadata" in product) {
      const name = product.metadata?.name;
      if (name && isUpgradeFeature(name)) {
        features.push(name);
      }
    }
  }

  if (features.length === 0) {
    throw new SessionHasNoFeaturesError(sessionId);
  }

  await Promise.all([
    applyFeaturesToNote(noteCode, ownerEmail, features),
    createFulfilledOrder({ sessionId, noteCode, features }),
  ]);

  return "fulfilled";
}
