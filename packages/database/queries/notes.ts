/** biome-ignore-all lint/suspicious/noExplicitAny: The body of the note can be any, since we don't know the structure of the note */
import { ensureConnected } from "../client";
import { type NoteModel, Notes } from "../schemas/notes";

export async function getNoteByCode(code: string): Promise<NoteModel | null> {
  await ensureConnected();

  const note = await Notes.findOne({ code }).lean();

  return note;
}

export async function getNotePasswordByCode(
  code: string,
): Promise<string | null> {
  await ensureConnected();

  const note = await Notes.findOne({ code }).select("password").lean();

  return note?.password || null;
}

export async function createNote(
  code: string,
  body: any,
  expireAt?: Date,
): Promise<NoteModel> {
  await ensureConnected();

  return await Notes.create({ code, body, expireAt });
}

export async function updateNote(code: string, body: any) {
  await ensureConnected();

  await Notes.updateOne({ code }, { body });
}

export async function createOrUpdateNoteBody(code: string, body: any) {
  await ensureConnected();

  const note = await Notes.findOne({ code }).lean();
  if (note) {
    await Notes.updateOne({ code }, { body });
  } else {
    await Notes.create({ code, body });
  }
}

export async function setPasswordForNote(code: string, password: string) {
  await ensureConnected();

  await Notes.updateOne({ code }, { password, hasPassword: true });
}

export async function updateOwnerForNote(code: string, owner: string) {
  await ensureConnected();

  await Notes.updateOne({ code }, { owner });
}
