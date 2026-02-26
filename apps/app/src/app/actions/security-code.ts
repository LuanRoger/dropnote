"use server";

import { setPasswordForNote } from "@repo/database/queries/notes";
import {
  consumeSecurityCode,
  createSecurityCode,
  getSecurityByNoteCode,
} from "@repo/database/queries/security-code";
import { sendSecurityCodeToEmail } from "@repo/email/security-code";
import { hashPassword } from "@repo/security/hash";
import { redirect } from "next/navigation";
import {
  SECURITY_CODE_EXPIRE_TIME_MINUTES,
  SECURITY_CODE_EXPIRE_TIME_MS,
  SECURITY_CODE_LENGTH,
} from "@/constants";
import {
  NoteAlreadyHasSecurityCodeError,
  NoteDoesNotHaveSecurityCodeError,
  OwnerEmailNotProvidedError,
  SecurityCodeIsInvalidError,
} from "@/types/errors/security-code";
import { generateRandomNumber } from "@/utils/random";
import { setOwnerForNote, getNoteByCode } from "./notes";
import { NoteNotFoundError } from "@/types/errors/notes";

export async function getSecurityCodeByNoteCode(noteCode: string) {
  const securityCode = await getSecurityByNoteCode(noteCode);
  return securityCode;
}

export async function createSecurityCodeForNote(
  noteCode: string,
  passwordVerb: "create" | "update",
  sendToEmail?: string,
  haveExpirationTime?: boolean,
) {
  const doesNoteHaveSecurityCode = await getSecurityByNoteCode(noteCode);
  if (doesNoteHaveSecurityCode) {
    throw new NoteAlreadyHasSecurityCodeError(noteCode);
  }
  const note = await getNoteByCode(noteCode);
  if (!note) {
    throw new NoteNotFoundError(noteCode);
  }

  const emailToSend = sendToEmail || note.ownerEmail;

  if (emailToSend) {
    await setOwnerForNote(noteCode, emailToSend);
  } else {
    throw new OwnerEmailNotProvidedError();
  }

  const securityCode = generateRandomNumber(SECURITY_CODE_LENGTH);
  await Promise.all([
    createSecurityCode(
      noteCode,
      securityCode,
      emailToSend,
      haveExpirationTime ? SECURITY_CODE_EXPIRE_TIME_MS : undefined,
    ),
    sendSecurityCodeToEmail(emailToSend, {
      passwordVerb,
      securityCode,
      noteCode,
      securityCodeExpirationTimeMinutes: SECURITY_CODE_EXPIRE_TIME_MINUTES,
      passwordUpdateUrl: `${process.env.NEXT_PUBLIC_APP_URL}/${noteCode}/password`,
    }),
  ]);
}

export async function consumeSecurityCodeAndSetPasswordForNote(
  noteCode: string,
  securityCode: string,
  newPassword: string,
) {
  const securityCodeRecord = await getSecurityByNoteCode(noteCode);
  if (!securityCodeRecord) {
    throw new NoteDoesNotHaveSecurityCodeError(noteCode);
  }
  if (securityCodeRecord.securityCode !== securityCode) {
    throw new SecurityCodeIsInvalidError();
  }

  const hashedPassword = await hashPassword(newPassword);
  await Promise.all([
    setPasswordForNote(noteCode, hashedPassword),
    consumeSecurityCode(noteCode),
  ]);

  redirect(`/${noteCode}`);
}
