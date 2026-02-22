"use server";

import { error, ok, type Result } from "@/types/actions";
import { CheckMultiplayerAccessError } from "@/types/errors/multiplayer-server";
import type { NoteRoomInformation } from "@/types/multiplayer-server";
import { env } from "~/env";

export async function checkNoteMultiplayerAccess(
  code: string,
): Promise<Result<NoteRoomInformation>> {
  const apiUrl = env.HOCUSPOCUS_API_URL;
  const apiKey = env.HOCUSPOCUS_API_KEY;

  const response = await fetch(`${apiUrl}/rooms/${code}`, {
    headers: {
      "api-key": apiKey,
    },
  });
  if (!response.ok) {
    return error(new CheckMultiplayerAccessError(code, response.statusText));
  }

  const data = await response.json();
  return ok(data);
}
