"use server";

import { setPasswordForNote } from "@repo/database/queries/notes";
import {
  createSecurityCode,
  findSecurityCode,
} from "@repo/database/queries/security-code";
import { hashPassword } from "@repo/security/hash";
import { SECURITY_CODE_LENGTH } from "@/constants";
import { generateRandomNumber } from "@/utils/random";

export async function createSecurityCodeForNote(
  noteCode: string,
  sendToEmail: string,
) {
  const doesNoteHaveSecurityCode = await findSecurityCode(noteCode);
  if (!doesNoteHaveSecurityCode) {
    throw new Error("Note already has a security code");
  }

  const securityCode = generateRandomNumber(SECURITY_CODE_LENGTH);
  await createSecurityCode(noteCode, securityCode, sendToEmail);
  //TODO: Send email to user with security code
}

export async function consumeSecurityCodeAndSetPasswordForNote(
  noteCode: string,
  securityCode: string,
  newPassword: string,
): Promise<boolean> {
  const securityCodeRecord = await findSecurityCode(noteCode);
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
