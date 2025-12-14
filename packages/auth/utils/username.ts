export function generateUsername(firstName: string, lastName: string): string {
  return `${firstName}${lastName}`.toLowerCase().replaceAll(/\s+/g, "");
}

export function getInitials(username: string): string {
  return username
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
