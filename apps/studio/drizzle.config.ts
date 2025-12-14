import { drizzleConfig } from "@repo/database/drizzle.config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  ...drizzleConfig,
  out: undefined,
  schema: "../../packages/database/schemas",
});
