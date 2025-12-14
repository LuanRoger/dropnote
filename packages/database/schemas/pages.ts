import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const pages = pgTable("page", {
  id: serial("id"),
  name: varchar("name", { length: 256 }),
});
