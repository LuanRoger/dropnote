import type { NoteBody } from "@repo/editor/types/notes";

export type NoteSource = "database" | "local";

export abstract class NotesLoadSource {
  protected readonly code: string;

  constructor(code: string) {
    this.code = code;
  }

  abstract load(): Promise<NoteBody | undefined>;
}
