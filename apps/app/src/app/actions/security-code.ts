"use server";

import { setPasswordForNote } from "@repo/database/queries/notes";
import {
  consumeSecurityCode,
  createSecurityCode,
  findSecurityByNoteCode,
} from "@repo/database/queries/security-code";
import { sendSecurityCodeToEmail } from "@repo/email/security-code";
import { hashPassword } from "@repo/security/hash";
import { redirect } from "next/navigation";
import { SECURITY_CODE_LENGTH } from "@/constants";
import {
  NoteAlreadyHasSecurityCodeError,
  NoteDoesNotHaveSecurityCodeError,
  SecurityCodeIsInvalidError,
} from "@/types/errors/security-code";
import { generateRandomNumber } from "@/utils/random";

export async function findSecurityCodeByNoteCode(noteCode: string) {
  const securityCode = await findSecurityByNoteCode(noteCode);
  return securityCode;
}

export async function createSecurityCodeForNote(
  noteCode: string,
  sendToEmail: string,
) {
  const doesNoteHaveSecurityCode = await findSecurityByNoteCode(noteCode);
  if (doesNoteHaveSecurityCode) {
    throw new NoteAlreadyHasSecurityCodeError(noteCode);
  }

  const securityCode = generateRandomNumber(SECURITY_CODE_LENGTH);
  await Promise.all([
    createSecurityCode(noteCode, securityCode, sendToEmail),
    sendSecurityCodeToEmail(sendToEmail, {
      passwordVerb: "create",
      securityCode,
      noteCode,
      passwordUpdateUrl: `${process.env.NEXT_PUBLIC_APP_URL}/${noteCode}`,
    }),
  ]);
}

export async function consumeSecurityCodeAndSetPasswordForNote(
  noteCode: string,
  securityCode: string,
  newPassword: string,
) {
  const securityCodeRecord = await findSecurityByNoteCode(noteCode);
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
