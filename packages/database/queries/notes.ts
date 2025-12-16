import mongoose from "mongoose";
import { notesSchema } from "../schemas/notes";
import { ensureConnected } from "../client";

export async function findNoteByCode(code: string) {
  await ensureConnected();

  const Notes = mongoose.model("Notes", notesSchema);
  const note = await Notes.findOne({ code });

  return note;
}

export async function createNote(code: string, body: any) {
  await ensureConnected();

  const Notes = mongoose.model("Notes", notesSchema);
  await Notes.create({ code, body });
}

export async function updateNote(code: string, body: any) {
  await ensureConnected();

  const Notes = mongoose.model("Notes", notesSchema);
  await Notes.updateOne({ code }, { body });
}

export async function createOrUpdateNote(code: string, body: any) {
  await ensureConnected();

  const Notes = mongoose.model("Notes", notesSchema);
  const note = await Notes.findOne({ code });
  if (note) {
    await Notes.updateOne({ code }, { body });
  } else {
    await Notes.create({ code, body });
  }
}
