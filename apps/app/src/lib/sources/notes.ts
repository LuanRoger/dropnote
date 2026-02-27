import type { NoteModel } from "@repo/database/schemas/notes";
import { handleError } from "@repo/design-system/lib/utils";
import type { NoteBody } from "@repo/editor/types/notes";
import { NotesSaveSource } from "@repo/editor/types/notes";
import { ensureCreated, updateNoteBodyByCode } from "@/app/actions/notes";
import { LOCAL_NOTE_PREFIX } from "@/constants";
import { type NoteSource, NotesLoadSource } from "./types";

export class NotesDatabaseSaveSource extends NotesSaveSource {
  save(value: NoteBody): Promise<void> {
    return updateNoteBodyByCode(this.code, value);
  }
}

export class NotesDatabaseLoadSource extends NotesLoadSource {
  private note: NoteModel | undefined;

  async loadNote(): Promise<NoteModel> {
    if (this.note) {
      return this.note;
    }

    const note = await ensureCreated(this.code);
    this.note = note;

    return note;
  }

  async load(): Promise<NoteBody | undefined> {
    const note = await this.loadNote();

    return note.body;
  }
}

export class NotesLocalSaveSource extends NotesSaveSource {
  save(value: NoteBody): Promise<void> {
    const key = `${LOCAL_NOTE_PREFIX}${this.code}`;
    localStorage.setItem(key, JSON.stringify(value));

    return Promise.resolve();
  }
}

export class NotesLocalLoadSource extends NotesLoadSource {
  load(): Promise<NoteBody | undefined> {
    const key = `${LOCAL_NOTE_PREFIX}${this.code}`;
    const item = localStorage.getItem(key);
    if (!item) {
      return Promise.resolve(undefined);
    }

    try {
      return Promise.resolve(JSON.parse(item) as NoteBody);
    } catch (error) {
      handleError(error);
      return Promise.resolve(undefined);
    }
  }
}

export function createNoteSource(
  code: string,
  type: NoteSource
): NotesSaveSource {
  switch (type) {
    case "database":
      return new NotesDatabaseSaveSource(code);
    case "local":
      return new NotesLocalSaveSource(code);
    default:
      throw new Error(`Invalid note source type: ${type}`);
  }
}
