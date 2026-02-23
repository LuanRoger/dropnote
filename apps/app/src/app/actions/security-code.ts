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
  SECURITY_CODE_EXPIRE_TIME_MS,
  SECURITY_CODE_EXPIRE_TIME_MINUTES,
  SECURITY_CODE_LENGTH,
} from "@/constants";
import {
  NoteAlreadyHasSecurityCodeError,
  NoteDoesNotHaveSecurityCodeError,
  SecurityCodeIsInvalidError,
} from "@/types/errors/security-code";
import { generateRandomNumber } from "@/utils/random";

export async function getSecurityCodeByNoteCode(noteCode: string) {
  const securityCode = await getSecurityByNoteCode(noteCode);
  return securityCode;
}

export async function createSecurityCodeForNote(
  noteCode: string,
  sendToEmail: string,
  passwordVerb: "create" | "update",
) {
  const doesNoteHaveSecurityCode = await getSecurityByNoteCode(noteCode);
  if (doesNoteHaveSecurityCode) {
    throw new NoteAlreadyHasSecurityCodeError(noteCode);
  }

  const securityCode = generateRandomNumber(SECURITY_CODE_LENGTH);
  await Promise.all([
    createSecurityCode(
      noteCode,
      securityCode,
      sendToEmail,
      SECURITY_CODE_EXPIRE_TIME_MS,
    ),
    sendSecurityCodeToEmail(sendToEmail, {
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
