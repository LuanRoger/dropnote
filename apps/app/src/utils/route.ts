import { env } from "~/env";

export function mountNotePasswordRoute(code: string) {
  const siteUrl = env.NEXT_PUBLIC_APP_URL;

  return `${siteUrl}/${code}/password`;
}
