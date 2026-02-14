import type { NoteBody } from "../types/notes";

export function countBodyLength(nodes: NoteBody) {
  let totalLength = 0;
  const stack: NoteBody[] = [...nodes];

  while (stack.length > 0) {
    const node = stack.pop();

    totalLength += node?.text?.length ?? 0;

    if (node.children && Array.isArray(node.children)) {
      stack.push(...node.children);
    }
  }

  return totalLength;
}
