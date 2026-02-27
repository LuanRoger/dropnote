import type { mongo } from "mongoose";

const BETA_BADGE = {
  label: "Beta",
  color: "#9E9E9E",
  description: "This note was created during the beta testing phase.",
  isSpecial: true,
};

export default async function betaNotes(db: mongo.Db): Promise<void> {
  const collection = db.collection("notes");

  console.log("🔍 Finding all notes to apply beta data...");

  const result = await collection.updateMany(
    {},
    {
      $set: {
        isPermanent: true,
      },
      $addToSet: {
        badges: BETA_BADGE,
      },
    },
  );

  console.log(
    `✅ ${result.modifiedCount} document(s) updated with beta badge and isPermanent=true.`,
  );
}
