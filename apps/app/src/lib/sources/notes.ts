import type { NoteBody } from "@repo/editor/types/notes";
import { NotesSource } from "@repo/editor/types/notes";
import { updateNoteByCode } from "@/app/actions/notes";

export type NoteSource = "database" | "local";

export class NotesDatabaseSource extends NotesSource {
  save(value: NoteBody): Promise<void> {
    return updateNoteByCode(this.code, value);
  }
}

export class NotesLocalSource extends NotesSource {
  save(value: NoteBody): Promise<void> {
    localStorage.setItem(this.code, JSON.stringify(value));
    return Promise.resolve();
  }
}

export function createNoteSource(code: string, type: NoteSource): NotesSource {
  switch (type) {
    case "database":
      return new NotesDatabaseSource(code);
    case "local":
      return new NotesLocalSource(code);
    default:
      throw new Error(`Invalid note source type: ${type}`);
  }
}
