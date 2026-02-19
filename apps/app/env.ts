import { keys as database } from "@repo/database/keys";
import { keys as editor } from "@repo/editor/keys";
import { keys as core } from "@repo/next-config/keys";
import { keys as product } from "@repo/product/keys";
import { createEnv } from "@t3-oss/env-nextjs";
import z from "zod";

export const env = createEnv({
  extends: [product(), core(), database(), editor()],
  server: {
    HOCUSPOCUS_API_URL: z.url(),
    HOCUSPOCUS_API_KEY: z.string(),
  },
  client: {},
  runtimeEnv: {
    HOCUSPOCUS_API_URL: process.env.HOCUSPOCUS_API_URL,
    HOCUSPOCUS_API_KEY: process.env.HOCUSPOCUS_API_KEY,
  },
});
