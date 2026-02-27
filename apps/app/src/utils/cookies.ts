import { comparePassword } from "@repo/security/hash";
import { cookies } from "next/headers";
import { COOKIE_KEYS } from "@/constants";
import "server-only";

export async function checkPasswordCookieAccess(
  code: string,
  noteHashedPassword: string
): Promise<boolean> {
  const cookieStore = await cookies();
  const lastUserNotePassword = cookieStore.get(
    COOKIE_KEYS.NOTE_LAST_NOTE_PASSWORD
  );
  if (!lastUserNotePassword) {
    return false;
  }

  const { noteCode: cookieNoteCode, password: cookiesPassword } =
    parsePasswordCookieValue(lastUserNotePassword.value);
  if (cookieNoteCode !== code) {
    return false;
  }

  return await comparePassword(cookiesPassword, noteHashedPassword);
}

export function mountPasswordCookieValue(noteCode: string, password: string) {
  return `${noteCode}:${password}`;
}

export function parsePasswordCookieValue(cookieValue: string) {
  const [noteCode, password] = cookieValue.split(":");
  return { noteCode, password };
}
