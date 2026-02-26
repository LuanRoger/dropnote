import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const keys = () =>
  createEnv({
    server: {
      HOCUSPOCUS_WSS_URL: z.url(),
      HOCUSPOCUS_API_URL: z.url(),
      HOCUSPOCUS_API_KEY: z.string(),
    },
    client: {
      NEXT_PUBLIC_APP_URL: z.url(),
    },
    runtimeEnv: {
      HOCUSPOCUS_WSS_URL: process.env.HOCUSPOCUS_WSS_URL,
      HOCUSPOCUS_API_URL: process.env.HOCUSPOCUS_API_URL,
      HOCUSPOCUS_API_KEY: process.env.HOCUSPOCUS_API_KEY,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    },
  });
