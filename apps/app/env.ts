import { keys as database } from "@repo/database/keys";
import { keys as editor } from "@repo/editor/keys";
import { keys as core } from "@repo/next-config/keys";
import { keys as product } from "@repo/product/keys";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
  extends: [product(), core(), database(), editor()],
  server: {},
  client: {},
  runtimeEnv: {},
});
