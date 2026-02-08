"use server";

import {
  createNote,
  findNoteByCode,
  updateNote,
} from "@repo/database/queries/notes";
import type { NoteBody } from "@repo/editor/types/notes";

export async function ensureCreated(code: string) {
  const note = await findNoteByCode(code);
  if (note) {
    return note;
  }

  await createNote(code, []);
}

export async function updateNoteByCode(code: string, note: NoteBody) {
  await updateNote(code, note);
}
