import posthog from "posthog-js";
import { ENV } from "varlock/env";

export const initializeAnalytics = () => {
  posthog.init(ENV.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: ENV.NEXT_PUBLIC_POSTHOG_HOST,
    defaults: "latest",
  });
};
