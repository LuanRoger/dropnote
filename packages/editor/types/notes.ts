// biome-ignore lint/suspicious/noExplicitAny: For now, I don't know the type, and the package do not export it, so I will use any
export type NoteBody = any;

export abstract class NotesSaveSource {
  readonly code: string;

  constructor(code: string) {
    this.code = code;
  }

  abstract save(value: NoteBody): Promise<void>;
}
