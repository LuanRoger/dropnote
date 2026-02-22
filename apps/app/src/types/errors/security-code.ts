export class NoteAlreadyHasSecurityCodeError extends Error {
  constructor(code: string) {
    super(
      `Note with code ${code} already has a security code. Please use the existing security code or remove it before creating a new one.`,
    );
  }
}
