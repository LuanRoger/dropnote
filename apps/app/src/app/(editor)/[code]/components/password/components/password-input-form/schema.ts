import z from "zod";
import { passwordSchema } from "@/utils/schemas/password";

export const notePasswordInputFormSchema = z.object({
  password: passwordSchema,
});

export type NotePasswordInput = z.infer<typeof notePasswordInputFormSchema>;
