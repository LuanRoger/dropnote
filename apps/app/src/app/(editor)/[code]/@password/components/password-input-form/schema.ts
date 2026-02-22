import z from "zod";

export const notePasswordInputFormSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export type NotePasswordInput = z.infer<
  typeof notePasswordInputFormSchema
>;
