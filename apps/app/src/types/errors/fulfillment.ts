export class NoteCodeNotFoundInMetadataError extends Error {
  constructor() {
    super("Note code not found in session metadata.");
    this.name = "NoteCodeNotFoundInMetadataError";
  }
}

export class SessionHasNoFeaturesError extends Error {
  constructor(sessionId: string) {
    super(`Session ${sessionId} has no features in line items.`);
    this.name = "SessionHasNoFeaturesError";
  }
}
