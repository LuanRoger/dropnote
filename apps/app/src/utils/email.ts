export function obfuscateEmail(email: string) {
  const [localPart, domain] = email.split("@");

  if (localPart.length <= 2) {
    return `${localPart[0]}***@${domain}`;
  }

  const obfuscatedLocalPart =
    localPart[0] + "*".repeat(localPart.length - 2) + localPart.slice(-1);

  return `${obfuscatedLocalPart}@${domain}`;
}
