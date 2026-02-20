export class NoteRoomFullError extends Error {
  constructor(code: string) {
    super(
      `Note with code ${code} reached the limit of simultaneous users. Please try again later.`
    );
  }
}
