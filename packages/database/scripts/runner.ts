import "dotenv/config";
import mongoose from "mongoose";
import { keys } from "../keys";
import betaNotes from "./1-beta-notes";

type Script = {
  name: string;
  fn: (db: mongoose.mongo.Db) => Promise<void>;
};

const scripts: Script[] = [{ name: "1-beta-notes", fn: betaNotes }];

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

  console.log(`📋 Running ${scripts.length} script(s):\n`);

  for (const script of scripts) {
    console.log(`▶ Running script: ${script.name}`);
    await script.fn(db);
    console.log(`✔ Done: ${script.name}\n`);
  }

  console.log("🎉 All scripts applied successfully.");
  await mongoose.disconnect();
  console.log("🔌 Disconnected.");
}

runner().catch((err) => {
  console.error("❌ Script runner failed:", err);
  process.exit(1);
});
