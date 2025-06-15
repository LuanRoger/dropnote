import { SLUG_REGEX } from "@/constants";

export function validateSlug(slug: string): boolean {
  return SLUG_REGEX.test(slug);
}
