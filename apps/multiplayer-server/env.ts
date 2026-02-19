import { createEnv } from "@t3-oss/env-nextjs";
import z from "zod";

export const env = createEnv({
  server: {
    ADDRESS: z.string().default("::"),
    WSS_PORT: z.coerce.number().int().positive().default(3001),
    HTTP_PORT: z.coerce.number().int().positive().default(3011),
    API_KEY: z.string(),
    TIMEOUT: z.coerce.number().int().positive(),
    DEBOUNCE: z.coerce.number().int().positive(),
    MAX_DEBOUNCE: z.coerce.number().int().positive(),
    MAX_USERS_PER_ROOM: z.coerce.number().int().positive(),
  },
  runtimeEnv: {
    ADDRESS: process.env.ADDRESS,
    WSS_PORT: process.env.PORT,
    HTTP_PORT: process.env.HTTP_PORT,
    API_KEY: process.env.API_KEY,
    TIMEOUT: process.env.TIMEOUT,
    DEBOUNCE: process.env.DEBOUNCE,
    MAX_DEBOUNCE: process.env.MAX_DEBOUNCE,
    MAX_USERS_PER_ROOM: process.env.MAX_USERS_PER_ROOM,
  },
});
