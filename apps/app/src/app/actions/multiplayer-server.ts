"use server";

import { ENV } from "varlock/env";
import { CheckMultiplayerAccessError } from "@/types/errors/multiplayer-server";
import type { NoteRoomInformation } from "@/types/multiplayer-server";
import { validateSlug } from "@/utils/slug";

export async function checkNoteMultiplayerAccess(code: string) {
  const apiUrl = ENV.HOCUSPOCUS_API_URL;
  const apiKey = ENV.HOCUSPOCUS_API_KEY;

  const response = await fetch(`${apiUrl}/rooms/${code}`, {
    headers: {
      "api-key": apiKey,
    },
  });
  if (!response.ok) {
    throw new CheckMultiplayerAccessError(code, response.statusText);
  }

  const data = await response.json();
  return data as NoteRoomInformation;
}

export async function getNoteMultiplayerToken(code: string): Promise<string> {
  if (typeof code !== "string" || !validateSlug(code)) {
    throw new Error("Invalid note code.");
  }

  const response = await fetch(
    `${ENV.HOCUSPOCUS_API_URL}/rooms/${encodeURIComponent(code)}/token`,
    {
      method: "POST",
      headers: { "api-key": ENV.HOCUSPOCUS_API_KEY },
      cache: "no-store",
    }
  );
  if (!response.ok) {
    throw new Error("Could not authorize note collaboration.");
  }

  const data: unknown = await response.json();
  if (
    typeof data !== "object" ||
    data === null ||
    !("token" in data) ||
    typeof data.token !== "string" ||
    data.token.length === 0
  ) {
    throw new Error("Invalid collaboration token response.");
  }
  return data.token;
}
