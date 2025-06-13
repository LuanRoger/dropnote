export class EnvVarNotSetError extends Error {
  constructor(variableName: string) {
    super(`Environment variable "${variableName}" is not set`);
    this.name = "EnvVarNotSetError";
    Object.setPrototypeOf(this, EnvVarNotSetError.prototype);
  }
}
