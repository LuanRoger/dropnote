"use server";

import { setPasswordForNote } from "@repo/database/queries/notes";
import {
  createSecurityCode,
  findSecurityByNoteCode,
} from "@repo/database/queries/security-code";
import { sendSecurityCodeToEmail } from "@repo/email/security-code";
import { hashPassword } from "@repo/security/hash";
import { SECURITY_CODE_LENGTH } from "@/constants";
import { NoteAlreadyHasSecurityCodeError } from "@/types/errors/security-code";
import { generateRandomNumber } from "@/utils/random";
import { mountNotePasswordRoute } from "@/utils/route";

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
  await createSecurityCode(noteCode, securityCode, sendToEmail);
  sendSecurityCodeToEmail(sendToEmail, {
    passwordVerb: "create",
    securityCode,
    noteCode,
    passwordUpdateUrl: mountNotePasswordRoute(noteCode),
  });
}

export async function consumeSecurityCodeAndSetPasswordForNote(
  noteCode: string,
  securityCode: string,
  newPassword: string,
): Promise<boolean> {
  const securityCodeRecord = await findSecurityByNoteCode(noteCode);
  if (!securityCodeRecord) {
    return false;
  }
  if (securityCodeRecord.securityCode !== securityCode) {
    return false;
  }

  const hashedPassword = await hashPassword(newPassword);
  await setPasswordForNote(noteCode, hashedPassword);

  return true;
}
