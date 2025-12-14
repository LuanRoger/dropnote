import { drizzle } from "drizzle-orm/node-postgres";
import { keys } from "./keys";
import { schemas } from "./schemas";

export const database = drizzle(keys().DATABASE_URL, { schema: schemas });
