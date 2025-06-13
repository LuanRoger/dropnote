import { EnvVarNotSetError } from "@/models/error";
import { MongoClient, ServerApiVersion } from "mongodb";

export function createDbClient() {
  const connectionString = process.env.MONGO_URI;
  if (!connectionString) {
    throw new EnvVarNotSetError("MONGO_URI");
  }

  return new MongoClient(connectionString, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
}
