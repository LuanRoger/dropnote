export class NoteDoesNotHaveSecurityCodeError extends Error {
  constructor(code: string) {
    super(
      `Note with code ${code} does not have a security code. Please create a security code before trying to consume it.`,
    );
  }
}

export class NoteAlreadyHasSecurityCodeError extends Error {
  constructor(code: string) {
    super(
      `Note with code ${code} already has a security code. Please use the existing security code or remove it before creating a new one.`,
    );
  }
}

export class SecurityCodeIsInvalidError extends Error {
  constructor() {
    super(
      "The security code you entered is invalid. Please check the code and try again.",
    );
  }
}
