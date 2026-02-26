"use server";

import {
  createNote,
  getNoteByCode as getNoteByCodeQuery,
  getNotePasswordByCode,
  updateNote,
  updateOwnerForNote,
} from "@repo/database/queries/notes";
import type { NoteBody } from "@repo/editor/types/notes";
import { countBodyLength } from "@repo/editor/utils/nodes";
import { comparePassword } from "@repo/security/hash";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  COOKIE_KEYS,
  MAX_LENGHT_ADVANCED_NOTE,
  MAX_LENGHT_BASIC_NOTE,
  NOTE_LAST_NOTE_PASSWORD_EXPIRE_TIME_MS,
} from "@/constants";
import {
  CharacterLimitExceededError,
  InvalidNotePasswordError,
  NoteDoesNotHavePasswordError,
  NoteHasDiferentOwnerEmailError,
  NoteNotFoundError,
  OwnerEmailValidationError,
} from "@/types/errors/notes";
import {
  checkPasswordCookieAccess,
  mountPasswordCookieValue,
} from "@/utils/cookies";
import { emailSchema } from "@/utils/schemas/email";

export async function getNoteByCode(code: string) {
  return await getNoteByCodeQuery(code);
}

export type NoteAccessStatus = "not_found" | "needs_password" | "granted";

export async function resolveNoteAccess(
  code: string
): Promise<NoteAccessStatus> {
  const note = await getNoteByCodeQuery(code);
  if (!note) {
    return "not_found";
  }

  const { hasPassword } = note;
  if (!hasPassword) {
    return "granted";
  }

  const noteHashedPassword = await getNotePasswordByCode(code);
  if (!noteHashedPassword) {
    throw new NoteDoesNotHavePasswordError(code);
  }

  const hasValidCookie = await checkPasswordCookieAccess(
    code,
    noteHashedPassword
  );
  return hasValidCookie ? "granted" : "needs_password";
}

export async function tryPasswordAccess(code: string, password: string) {
  const noteHashedPassword = await getNotePasswordByCode(code);
  if (!noteHashedPassword) {
    throw new NoteDoesNotHavePasswordError(code);
  }

  const isPasswordValid = await comparePassword(password, noteHashedPassword);
  if (!isPasswordValid) {
    throw new InvalidNotePasswordError();
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
    }
  );

  redirect(`/${code}`);
}

export async function ensureCreated(code: string) {
  const note = await getNoteByCodeQuery(code);
  if (note) {
    return note;
  }

  return await createNote(code, []);
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

export async function setOwnerForNote(code: string, ownerEmail: string) {
  const validEmail = emailSchema.safeParse(ownerEmail);
  if (!validEmail.success) {
    throw new OwnerEmailValidationError();
  }

  const note = await getNoteByCodeQuery(code);
  if (!note) {
    throw new NoteNotFoundError(code);
  }

  if (note.ownerEmail && note.ownerEmail !== ownerEmail) {
    throw new NoteHasDiferentOwnerEmailError();
  }

  await updateOwnerForNote(code, ownerEmail);
}
