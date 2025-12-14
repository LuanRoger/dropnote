import { EnvVarNotSetError } from "@/models/error";
import mongoose from "mongoose";

export async function ensureConnected() {
  const connectionString = process.env.MONGO_URL;
  if (!connectionString) {
    throw new EnvVarNotSetError("MONGO_URL");
  }

  await mongoose.connect(connectionString);
}
