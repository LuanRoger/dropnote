import { SLUG_REGEX } from "@/constants";
import { z } from "zod";

export const navigateToPageSchema = z.object({
  code: z
    .string()
    .min(1, "Code is required")
    .regex(SLUG_REGEX, "Code must be a valid slug"),
});

export type NavigateToPageSchema = z.infer<typeof navigateToPageSchema>;
