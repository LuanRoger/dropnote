import { ENV } from "varlock/env";
import { z } from "zod";

const configSchema = z
  .object({
    API_KEY: z.string().min(1),
    TIMEOUT: z.number().int().positive(),
    DEBOUNCE: z.number().int().nonnegative(),
    MAX_DEBOUNCE: z.number().int().nonnegative(),
    MAX_USERS_PER_ROOM: z.number().int().positive(),
  })
  .refine((config) => config.MAX_DEBOUNCE >= config.DEBOUNCE, {
    path: ["MAX_DEBOUNCE"],
    message: "MAX_DEBOUNCE must be greater than or equal to DEBOUNCE",
  });

export function getServerConfig() {
  return configSchema.parse({
    API_KEY: ENV.API_KEY,
    TIMEOUT: ENV.TIMEOUT,
    DEBOUNCE: ENV.DEBOUNCE,
    MAX_DEBOUNCE: ENV.MAX_DEBOUNCE,
    MAX_USERS_PER_ROOM: ENV.MAX_USERS_PER_ROOM,
  });
}
