"use server";

import { createNote, findNoteByCode, updateNote } from "@/db/queries/notes";

export async function ensureCreated(code: string) {
  const note = await findNoteByCode(code);
  if (note) {
    return note;
  }

  await createNote(code, []);
}

export async function updateNoteByCode(code: string, note: any) {
  await updateNote(code, note);
}
