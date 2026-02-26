import type { mongo } from "mongoose";

export default async function migrate(db: mongo.Db): Promise<void> {
  const collection = db.collection("notes");

  console.log("🔍 Finding documents missing owner email...");

  const result = await collection.updateMany(
    { ownerEmail: { $exists: false } },
    {
      $set: {
        ownerEmail: null,
      },
    }
  );

  console.log(`✅ ${result.modifiedCount} document(s) updated.`);
}
