export function generateRandomHexColor() {
  return `#${Math.floor(Math.random() * 16_777_215).toString(16)}`;
}
