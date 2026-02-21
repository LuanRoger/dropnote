"use server";

import {
  createNote,
  findNoteByCode,
  updateNote,
} from "@repo/database/queries/notes";
import type { NoteBody } from "@repo/editor/types/notes";
import { countBodyLength } from "@repo/editor/utils/nodes";
import { comparePassword } from "@repo/security/hash";
import { cookies } from "next/headers";
import {
  COOKIE_KEYS,
  MAX_LENGHT_ADVANCED_NOTE,
  MAX_LENGHT_BASIC_NOTE,
  NOTE_LAST_NOTE_PASSWORD_EXPIRE_TIME_MS,
} from "@/constants";
import {
  mountPasswordCookieValue,
  parsePasswordCookieValue,
} from "@/utils/cookies";

export async function isNoteProtected(code: string): Promise<boolean> {
  const note = await findNoteByCode(code);
  if (!note) {
    return false;
  }

  return note.hasPassword;
}

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

export async function tryPasswordAccess(code: string, password: string) {
  const note = await findNoteByCode(code);
  if (!note) {
    return false;
  }
  const { hasPassword, password: noteHashedPassword } = note;
  if (!(hasPassword && noteHashedPassword)) {
    return true;
  }

  const isPasswordValid = comparePassword(password, noteHashedPassword);
  if (!isPasswordValid) {
    return false;
  }

  const cookieStore = await cookies();
  const notePasswordCookieValue = mountPasswordCookieValue(
    code,
    noteHashedPassword,
  );
  cookieStore.set(
    COOKIE_KEYS.NOTE_LAST_NOTE_PASSWORD,
    notePasswordCookieValue,
    {
      secure: true,
      priority: "high",
      sameSite: "strict",
      maxAge: NOTE_LAST_NOTE_PASSWORD_EXPIRE_TIME_MS,
    },
  );
}

export async function checkUserNoteAccess(code: string) {
  const note = await findNoteByCode(code);
  if (!note) {
    return false;
  }

  const { hasPassword, password: noteHashedPassword } = note;
  if (!(hasPassword && noteHashedPassword)) {
    return true;
  }

  const cookieStore = await cookies();
  const lastUserNotePassword = cookieStore.get(
    COOKIE_KEYS.NOTE_LAST_NOTE_PASSWORD,
  );
  if (!lastUserNotePassword) {
    return false;
  }

  const { noteCode: cookieNoteCode, password } = parsePasswordCookieValue(
    lastUserNotePassword.value,
  );
  if (cookieNoteCode !== code) {
    return false;
  }

  const isPasswordValid = comparePassword(password, noteHashedPassword);
  if (!isPasswordValid) {
    return false;
  }

  return true;
}
