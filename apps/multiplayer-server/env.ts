import { createEnv } from "@t3-oss/env-nextjs";
import z from "zod";

export const keys = () =>
  createEnv({
    server: {
      ADDRESS: z.string().default("::"),
      PORT: z.coerce.number().int().positive().default(3001),
      TIMEOUT: z.coerce.number().int().positive(),
      DEBOUNCE: z.coerce.number().int().positive(),
      MAX_DEBOUNCE: z.coerce.number().int().positive(),
      MAX_USERS_PER_ROOM: z.coerce.number().int().positive(),
    },
    runtimeEnv: {
      ADDRESS: process.env.ADDRESS,
      PORT: process.env.PORT,
      TIMEOUT: process.env.TIMEOUT,
      DEBOUNCE: process.env.DEBOUNCE,
      MAX_DEBOUNCE: process.env.MAX_DEBOUNCE,
      MAX_USERS_PER_ROOM: process.env.MAX_USERS_PER_ROOM,
    },
  });

export const env = createEnv({
  extends: [keys()],
  server: {},
  client: {},
  runtimeEnv: {},
});
