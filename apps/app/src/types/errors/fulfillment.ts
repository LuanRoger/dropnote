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

export class CustomerEmailNotFoundError extends Error {
  constructor(sessionId: string) {
    super(
      `No customer email found on session ${sessionId}. The customer must provide an email at checkout.`,
    );
    this.name = "CustomerEmailNotFoundError";
  }
}
