import type { Server } from "@hocuspocus/server";

export function getRoomUserCount(server: Server, roomName: string): number {
  const doc = server.hocuspocus.documents.get(roomName);
  if (!doc) {
    return 0;
  }

  return doc.getConnectionsCount();
}
