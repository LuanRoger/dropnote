import { EnvVarNotSetError } from "@/models/error";
import mongoose from "mongoose";

export async function ensureConnected() {
  const connectionString = process.env.MONGO_URI;
  if (!connectionString) {
    throw new EnvVarNotSetError("MONGO_URI");
  }

  await mongoose.connect(connectionString);
}
