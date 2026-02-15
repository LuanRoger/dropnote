/** biome-ignore-all lint/suspicious/noExplicitAny: The body of the note can be any, since we don't know the structure of the note */
import { ensureConnected } from "../client";
import { type NoteModel, Notes } from "../schemas/notes";

export async function findNoteByCode(code: string): Promise<NoteModel | null> {
  await ensureConnected();

  const note = await Notes.findOne({ code });

  return note;
}

export async function createNote(code: string, body: any): Promise<NoteModel> {
  await ensureConnected();

  return await Notes.create({ code, body });
}

export async function updateNote(code: string, body: any) {
  await ensureConnected();

  await Notes.updateOne({ code }, { body });
}

export async function createOrUpdateNote(code: string, body: any) {
  await ensureConnected();

  const note = await Notes.findOne({ code });
  if (note) {
    await Notes.updateOne({ code }, { body });
  } else {
    await Notes.create({ code, body });
  }
}
