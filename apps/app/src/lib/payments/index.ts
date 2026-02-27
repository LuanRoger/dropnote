import { loadStripe } from "@stripe/stripe-js";
import { env } from "~/env";

export const stripe = loadStripe(env.STRIPE_PUBLISHABLE_KEY);
