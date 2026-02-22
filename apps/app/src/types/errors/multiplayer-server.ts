export class CheckMultiplayerAccessError extends Error {
  constructor(code: string, message?: string) {
    super(
      message ||
        `Failed to check multiplayer access for note with code ${code}. Please try again later.`,
    );
  }
}
