export class SourceNotInitValueError extends Error {
  constructor() {
    super("Source initial value was not initialized");
  }
}
