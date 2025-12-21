import mongoose from "mongoose";

export async function ensureConnected() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  await mongoose.connect(connectionString);
}
