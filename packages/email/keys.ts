import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const keys = () =>
  createEnv({
    server: {
      RESEND_API_KEY: z.string().startsWith("re_"),
      FROM_EMAIL_FIELD: z.string(),
      NOTE_PASSWORD_SECURITY_CODE_TEMPLATE_ID: z.string(),
    },
    client: {},
    runtimeEnv: {
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      FROM_EMAIL_FIELD: process.env.FROM_EMAIL_FIELD,
      NOTE_PASSWORD_SECURITY_CODE_TEMPLATE_ID:
        process.env.NOTE_PASSWORD_SECURITY_CODE_TEMPLATE_ID,
    },
  });
