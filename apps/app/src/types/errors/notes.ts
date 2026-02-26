export class NoteRoomFullError extends Error {
  constructor(code: string) {
    super(
      `Note with code ${code} reached the limit of simultaneous users. Please try again later.`
    );
  }
}

export class CharacterLimitExceededError extends Error {
  constructor(limit: number) {
    super(`The note body exceeds the character limit of ${limit} characters.`);
  }
}

export class OwnerEmailValidationError extends Error {
  constructor() {
    super("The email provided for the note owner is invalid.");
  }
}

export class NoteHasDiferentOwnerEmailError extends Error {
  constructor() {
    super(
      "The note already has an owner email that is different from the one provided."
    );
  }
}

export class NoteNotFoundError extends Error {
  constructor(code: string) {
    super(`Note with code ${code} was not found.`);
  }
}

export class InvalidNotePasswordError extends Error {
  constructor() {
    super("The password provided for the note is invalid.");
  }
}

export class NoteDoesNotHavePasswordError extends Error {
  constructor(code: string) {
    super(
      `The note with code ${code} does not have a password, so it cannot be accessed with a password.`
    );
  }
}
