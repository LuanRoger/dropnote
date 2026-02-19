export function isAuthValid(apiKey: string, token?: string): boolean {
  return Boolean(token && token === apiKey);
}
