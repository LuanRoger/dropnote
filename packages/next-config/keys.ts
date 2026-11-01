import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const keys = () =>
  createEnv({
    client: {
      NEXT_PUBLIC_APP_URL: z.url(),
      NEXT_PUBLIC_PROJECT_PRODUCTION_URL: z.url().optional(),
    },
    runtimeEnv: {
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      NEXT_PUBLIC_PROJECT_PRODUCTION_URL: process.env.PROJECT_PRODUCTION_URL,
    },
  });
