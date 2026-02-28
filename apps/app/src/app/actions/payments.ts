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

export async function createPaymentIntent(
  noteCode: string,
  priceIds: string[],
) {
  const prices = await Promise.all(
    priceIds.map((id) => stripe.prices.retrieve(id)),
  );

  const totalAmount = prices.reduce(
    (sum, price) => sum + (price.unit_amount ?? 0),
    0,
  );

  const currency = prices[0]?.currency ?? "usd";

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount,
    currency,
    metadata: {
      noteCode,
      priceIds: priceIds.join(","),
    },
  });

  return paymentIntent.client_secret;
}
