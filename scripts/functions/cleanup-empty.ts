/** biome-ignore-all lint/suspicious/noExplicitAny: Types here are very complex */
import { MongoClient, ServerApiVersion } from "mongodb";

const url = process.env.DATABASE_URL;

const client = new MongoClient(url, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

function isBodyEmpty(body: any[]): boolean {
  if (!body || body.length === 0) {
    return true;
  }

  for (const element of body) {
    if (!element.children || element.children.length === 0) {
      continue;
    }

    const hasContent = element.children.some((child: any) => {
      return child.text && child.text.trim() !== "";
    });

    if (hasContent) {
      return false;
    }
  }

  return true;
}

async function cleanupEmptyNotes() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const testDb = client.db("test");
    const notes = testDb.collection("notes");

    const allNotes = await notes.find({}).toArray();
    console.log(`Found ${allNotes.length} total notes`);

    const emptyNoteIds: string[] = [];
    for (const note of allNotes) {
      if (isBodyEmpty(note.body)) {
        emptyNoteIds.push(note._id as string);
      }
    }

    console.log(`Found ${emptyNoteIds.length} notes with empty bodies`);

    if (emptyNoteIds.length > 0) {
      const result = await notes.deleteMany({
        _id: { $in: emptyNoteIds },
      });

      console.log(`Successfully deleted ${result.deletedCount} empty notes`);
    } else {
      console.log("No empty notes to delete");
    }
  } catch (error) {
    console.error("Error cleaning up empty notes:", error);
    throw error;
  } finally {
    await client.close();
    console.log("Disconnected from MongoDB");
  }
}

cleanupEmptyNotes();
