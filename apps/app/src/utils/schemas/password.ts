import z from "zod";

export const passwordSchema = z
  .string()
  .min(4, "Password must be at least 4 characters")
  .max(16, "Password must be less than 16 characters");
