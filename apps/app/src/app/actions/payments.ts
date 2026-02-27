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
