import { type Config, defineConfig } from "drizzle-kit";
import { keys } from "./keys";

export const drizzleConfig = {
  out: "./drizzle",
  schema: "./schemas",
  dialect: "postgresql",
  dbCredentials: {
    url: keys().DATABASE_URL,
  },
} satisfies Config;

export default defineConfig(drizzleConfig);
