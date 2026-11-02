import "server-only";
import { PostHog } from "posthog-node";
import { ENV } from "varlock/env";

export const product = new PostHog(ENV.NEXT_PUBLIC_POSTHOG_KEY, {
  host: ENV.NEXT_PUBLIC_POSTHOG_HOST,
  flushAt: 1,
  flushInterval: 0,
});
