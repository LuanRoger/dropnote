import { keys as database } from "@repo/database/keys";
import { createEnv } from "@t3-oss/env-nextjs";

export const keys = () =>
  createEnv({
    extends: [database()],
    runtimeEnv: {},
  });
