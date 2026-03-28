"use server";

import { stripe } from "@repo/payments/stripe";

export async function getProducts() {
  const products = await stripe.products.list({
    active: true,
    expand: ["data.default_price"],
  });
  return products.data;
}

export async function getProductById(productId: string) {
  const product = await stripe.products.retrieve(productId, {
    expand: ["default_price"],
  });
  return product;
}

export async function getPriceById(priceId: string) {
  const price = await stripe.prices.retrieve(priceId);
  return price;
}

export async function createCheckoutSession(
  noteCode: string,
  priceIds: string[],
) {
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    ui_mode: "elements",
    line_items: priceIds.map((priceId) => ({
      price: priceId,
      quantity: 1,
    })),
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/${noteCode}/upgrade/success?session_id={CHECKOUT_SESSION_ID}`,
    adaptive_pricing: {
      enabled: true,
    },
    metadata: {
      noteCode,
    },
  });

  return session.client_secret;
}
