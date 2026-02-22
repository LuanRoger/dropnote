"use server";

import {
  createNote,
  findNoteByCode,
  getNotePasswordByCode,
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
  checkPasswordCookieAccess,
  mountPasswordCookieValue,
} from "@/utils/cookies";
import { redirect } from "next/navigation";

export type NoteAccessStatus = "not_found" | "needs_password" | "granted";

export async function resolveNoteAccess(
  code: string,
): Promise<NoteAccessStatus> {
  const note = await findNoteByCode(code);
  if (!note) {
    return "not_found";
  }

  const { hasPassword } = note;
  if (!hasPassword) {
    return "granted";
  }

  const noteHashedPassword = await getNotePasswordByCode(code);
  if (!noteHashedPassword) {
    throw new Error("This note does not have a password");
  }

  const hasValidCookie = await checkPasswordCookieAccess(
    code,
    noteHashedPassword,
  );
  console.log("hasValidCookie", hasValidCookie);
  return hasValidCookie ? "granted" : "needs_password";
}

export async function tryPasswordAccess(code: string, password: string) {
  const noteHashedPassword = await getNotePasswordByCode(code);
  if (!noteHashedPassword) {
    throw new Error("This note does not have a password");
  }

  const isPasswordValid = await comparePassword(password, noteHashedPassword);
  console.log("isPasswordValid", isPasswordValid);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const cookieStore = await cookies();
  const notePasswordCookieValue = mountPasswordCookieValue(code, password);
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

  redirect(`/${code}`);
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
