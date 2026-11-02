import type { mongo } from "mongoose";

export default async function migrate(db: mongo.Db): Promise<void> {
  const collection = db.collection("notes");

  console.log("🔍 Finding documents missing limit fields...");

  const limitsResult = await collection.updateMany(
    { isPermanent: { $exists: false } },
    {
      $set: {
        isPermanent: false,
        hasExtendedLimit: false,
        aiCredits: 0,
        badges: [],
      },
    }
  );

  console.log(`✅ ${limitsResult.modifiedCount} document(s) updated.`);
}
