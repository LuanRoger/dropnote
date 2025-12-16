import { EnvVarNotSetError } from "@/models/error";
import mongoose from "mongoose";

export async function ensureConnected() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new EnvVarNotSetError("DATABASE_URL");
  }

  await mongoose.connect(connectionString);
}
