import { keys as auth } from "@repo/auth/keys";
import { keys as database } from "@repo/database/keys";
import { keys as core } from "@repo/next-config/keys";
import { keys as analytics } from "@repo/product/keys";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
  extends: [auth(), analytics(), core(), database()],
  server: {},
  client: {},
  runtimeEnv: {},
});
