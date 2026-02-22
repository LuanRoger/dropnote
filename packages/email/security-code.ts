import "server-only";
import { client } from "./client";
import { keys as env } from "./keys";
import type { SendSecurityCodeToEmailParams } from "./types/security-code";

export async function sendSecurityCodeToEmail(
  toEmail: string,
  params: SendSecurityCodeToEmailParams,
) {
  const fromEmail = env().FROM_EMAIL_FIELD;
  const templateId = env().NOTE_PASSWORD_SECURITY_CODE_TEMPLATE_ID;

  await client.emails.send({
    from: fromEmail,
    to: toEmail,
    template: {
      id: templateId,
      variables: params,
    },
  });
}
