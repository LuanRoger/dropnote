import { createEnv } from "@t3-oss/env-nextjs";
import z from "zod";

export const keys = () =>
  createEnv({
    server: {
      SALT_ROUNDS: z.coerce.number().default(5),
    },
    client: {},
    runtimeEnv: {
      SALT_ROUNDS: process.env.SALT_ROUNDS,
    },
  });
