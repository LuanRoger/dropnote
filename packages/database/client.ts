import mongoose from "mongoose";
import { ENV } from "varlock/env";

export async function withDatabaseConnection<T>(
  operation: (connection: mongoose.Connection) => Promise<T>
): Promise<T> {
  const connection = mongoose.createConnection(ENV.DATABASE_URL, {
    connectTimeoutMS: 5000,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 10000,
    waitQueueTimeoutMS: 5000,
    maxPoolSize: 1,
    minPoolSize: 0,
    bufferCommands: false,
  });

  try {
    await connection.asPromise();
    return await operation(connection);
  } finally {
    await connection.destroy();
  }
}
