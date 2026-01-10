import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const keys = () =>
  createEnv({
    server: {
      NEXT_PUBLIC_HOCUSPOCUS_WSS_URL: z.url(),
    },
    runtimeEnv: {
      NEXT_PUBLIC_HOCUSPOCUS_WSS_URL:
        process.env.NEXT_PUBLIC_HOCUSPOCUS_WSS_URL,
    },
  });
