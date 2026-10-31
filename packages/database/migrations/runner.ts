import "dotenv/config";
import mongoose from "mongoose";
import { keys } from "../keys";
import limits from "./1-limits";

type Migration = {
  name: string;
  fn: (db: mongoose.mongo.Db) => Promise<void>;
};

const migrations: Migration[] = [{ name: "1-limits", fn: limits }];

async function runner() {
  const env = keys();
  const { DATABASE_URL } = env;

  console.log("🔌 Connecting to database...");
  await mongoose.connect(DATABASE_URL);
  console.log("✅ Connected.\n");

  const db = mongoose.connection.db;

  if (!db) {
    throw new Error("Database connection is not established.");
  }

  console.log(`📋 Running ${migrations.length} migration(s):\n`);

  for (const migration of migrations) {
    console.log(`▶ Running migration: ${migration.name}`);
    await migration.fn(db);
    console.log(`✔ Done: ${migration.name}\n`);
  }

  console.log("🎉 All migrations applied successfully.");
  await mongoose.disconnect();
  console.log("🔌 Disconnected.");
}

runner().catch((err) => {
  console.error("❌ Migration runner failed:", err);
  process.exit(1);
});
