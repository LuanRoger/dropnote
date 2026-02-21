import { ensureConnected } from "../client";
import {
  type SecurityCodeModel,
  SecurityCodes,
} from "../schemas/security-code";

export async function findSecurityCode(
  noteCode: string,
): Promise<SecurityCodeModel | undefined> {
  await ensureConnected();

  return await SecurityCodes.findOne({ noteCode }).lean();
}

export async function createSecurityCode(
  noteCode: string,
  securityCode: string,
  sendToEmail: string,
  expireAt?: Date,
) {
  await ensureConnected();

  return await SecurityCodes.create({
    noteCode,
    securityCode,
    sendToEmail,
    expireAt,
  });
}

export async function consumeSecurityCode(noteCode: string) {
  await ensureConnected();

  await SecurityCodes.deleteOne({ noteCode });
}
