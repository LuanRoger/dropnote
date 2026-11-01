import type { Hocuspocus } from "@hocuspocus/server";

export function getRoomUserCount(server: Hocuspocus, roomName: string): number {
  const doc = server.documents.get(roomName);
  if (!doc) {
    return 0;
  }

  return doc.getConnectionsCount();
}
