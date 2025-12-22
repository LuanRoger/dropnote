import z from "zod/v3";

export const mediaToolbarSchema = z.object({
  url: z.string().url(),
});

export type MediaToolbarSchema = z.infer<typeof mediaToolbarSchema>;
