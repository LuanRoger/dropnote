"use server";

import {
  createNote,
  getNoteByCode as getNoteByCodeQuery,
  updateNote,
} from "@repo/database/queries/notes";
import type { NoteBody } from "@repo/editor/types/notes";
import { countBodyLength } from "@repo/editor/utils/nodes";
import {
  DEFAULT_NOTE_EXPIRE_TIME_MS,
  MAX_LENGHT_ADVANCED_NOTE,
  MAX_LENGHT_BASIC_NOTE,
} from "@/constants";
import { CharacterLimitExceededError } from "@/types/errors/notes";

export async function getNoteByCode(code: string) {
  return await getNoteByCodeQuery(code);
}

export async function ensureCreated(code: string) {
  const note = await getNoteByCodeQuery(code);
  if (note) {
    return note;
  }

  return await createNote({
    code,
    body: [],
    expireAt: DEFAULT_NOTE_EXPIRE_TIME_MS,
  });
}

export async function updateNoteBodyByCode(code: string, body: NoteBody) {
  const note = await getNoteByCodeQuery(code);
  if (!note) {
    return;
  }

  const { hasExtendedLimit } = note;
  const currentBodyLenght = countBodyLength(body);
  if (
    (!hasExtendedLimit && currentBodyLenght > MAX_LENGHT_BASIC_NOTE) ||
    (hasExtendedLimit && currentBodyLenght > MAX_LENGHT_ADVANCED_NOTE)
  ) {
    throw new CharacterLimitExceededError(
      hasExtendedLimit ? MAX_LENGHT_ADVANCED_NOTE : MAX_LENGHT_BASIC_NOTE
    );
  }

  await updateNote(code, body);
}
