"use server";

import { error, ok, type Result } from "@/types/actions";
import type { NoteRoomInformation } from "@/types/multiplayer-server";
import { env } from "~/env";

export async function checkNoteMultiplayerAccess(
  code: string,
): Promise<Result<NoteRoomInformation>> {
  const apiUrl = env.HOCUSPOCUS_API_URL;

  const response = await fetch(`${apiUrl}/rooms/${code}`);
  if (!response.ok) {
    return error(
      new Error(`Failed to check room access: ${response.statusText}`),
    );
  }

  const data = await response.json();
  return ok(data);
}
