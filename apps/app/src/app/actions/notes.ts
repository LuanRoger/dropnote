"use server";

import {
  createNote,
  findNoteByCode,
  updateNote,
} from "@repo/database/queries/notes";
import type { NoteBody } from "@repo/editor/types/notes";
import { countBodyLength } from "@repo/editor/utils/nodes";

export async function ensureCreated(code: string) {
  const note = await findNoteByCode(code);
  if (note) {
    return note;
  }

  await createNote(code, []);
}

export async function updateNoteBodyByCode(code: string, body: NoteBody) {
  const note = await findNoteByCode(code);
  if (!note) {
    return;
  }

  const maxCurrentBodyLenght = countBodyLength(body);
  if (maxCurrentBodyLenght > note.charLimit) {
    throw new Error("Note body exceeds the character limit");
  }

  await updateNote(code, body);
}
