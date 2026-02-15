"use server";

import { MAX_LENGHT_ADVANCED_NOTE, MAX_LENGHT_BASIC_NOTE } from "@/constants";
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

  return await createNote(code, []);
}

export async function updateNoteBodyByCode(code: string, body: NoteBody) {
  const note = await findNoteByCode(code);
  if (!note) {
    return;
  }

  const { hasExtendedLimit } = note;
  const currentBodyLenght = countBodyLength(body);
  if (
    (!hasExtendedLimit && currentBodyLenght > MAX_LENGHT_BASIC_NOTE) ||
    (hasExtendedLimit && currentBodyLenght > MAX_LENGHT_ADVANCED_NOTE)
  ) {
    throw new Error("Note body exceeds the character limit");
  }

  await updateNote(code, body);
}
