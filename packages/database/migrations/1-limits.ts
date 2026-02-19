import type { mongo } from "mongoose";

export default async function migrate(db: mongo.Db): Promise<void> {
  const collection = db.collection("notes");

  console.log("🔍 Finding documents missing limit fields...");

  const result = await collection.updateMany(
    { isPermanent: { $exists: false } },
    {
      $set: {
        isPermanent: false,
        hasPassword: false,
        hasExtendedLimit: false,
        password: null,
        aiCredits: 0,
        badges: [],
      },
    },
  );

  console.log(`✅ ${result.modifiedCount} document(s) updated.`);
}
