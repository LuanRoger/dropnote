import z from "zod";
import { SECURITY_CODE_LENGTH } from "@/constants";
import { passwordSchema } from "@/utils/schemas/password";

export const passwordUpdateFormSchema = z.object({
  securityCode: z
    .string()
    .length(
      SECURITY_CODE_LENGTH,
      `Security code must be ${SECURITY_CODE_LENGTH} digits`
    ),
  newPassword: passwordSchema,
});

export type PasswordUpdateFormData = z.infer<typeof passwordUpdateFormSchema>;
