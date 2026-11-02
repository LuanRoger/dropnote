import mongoose from "mongoose";
import { ENV } from "varlock/env";

export async function ensureConnected() {
  await mongoose.connect(ENV.DATABASE_URL);
}
