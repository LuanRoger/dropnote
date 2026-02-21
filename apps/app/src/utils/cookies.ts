export function mountPasswordCookieValue(noteCode: string, password: string) {
  return `${noteCode}:${password}`;
}

export function parsePasswordCookieValue(cookieValue: string) {
  const [noteCode, password] = cookieValue.split(":");
  return { noteCode, password };
}
