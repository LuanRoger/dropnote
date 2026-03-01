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

export class FulfillOrderAlreadyFulfilledError extends Error {
  constructor() {
    super("Session has already been fulfilled.");
    this.name = "FulfillOrderAlreadyFulfilledError";
  }
}

export class FulfillOrderUnpaidError extends Error {
  constructor() {
    super("Session payment is unpaid.");
    this.name = "FulfillOrderUnpaidError";
  }
}

export class FulfillOrderNotFoundError extends Error {
  constructor() {
    super("No fulfilled order found for the given session ID.");
    this.name = "FulfillOrderNotFoundError";
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

export class FulfillSessionIdNotValidError extends Error {
  constructor() {
    super("Session ID is not valid.");
    this.name = "FulfillSessionIdNotValidError";
  }
}
