/** biome-ignore-all lint/suspicious/useAwait: The signature of the function do not allow not async functions */
import { Logger } from "@hocuspocus/extension-logger";
import { Server } from "@hocuspocus/server";
import { env } from "./env";

const serverName = "dropnote-multiplayer-server";
const address = env.ADDRESS;
const wssPort = env.WSS_PORT;
const httpPort = env.HTTP_PORT;
const timeout = env.TIMEOUT;
const debounce = env.DEBOUNCE;
const maxDebounce = env.MAX_DEBOUNCE;
const maxUsersPerRoom = env.MAX_USERS_PER_ROOM;

if (!timeout || Number.isNaN(timeout)) {
  throw new Error(
    "TIMEOUT environment variable is not set or is not a number.",
  );
}
if (!debounce || Number.isNaN(debounce)) {
  throw new Error(
    "DEBOUNCE environment variable is not set or is not a number.",
  );
}
if (!maxDebounce || Number.isNaN(maxDebounce)) {
  throw new Error(
    "MAX_DEBOUNCE environment variable is not set or is not a number.",
  );
}

const server = new Server({
  name: serverName,
  address,
  port: wssPort,
  timeout,
  debounce,
  maxDebounce,
  extensions: [new Logger()],
  async onListen(data) {
    console.log(`🚀 ${serverName} is listening on ${address}:${data.port}`);
    console.log(`   IPv6 enabled: ${address === "::" || address === "::0"}`);
  },
  async onConnect(data) {
    console.log(`📥 Client connected to room: ${data.documentName}`);
  },
  async beforeHandleMessage(data) {
    const awarenessStates = data.document.awareness.getStates();
    const activeUsers = awarenessStates.size;

    if (activeUsers > maxUsersPerRoom) {
      console.log(
        `❌ Room ${data.documentName} is full: ${activeUsers}/${maxUsersPerRoom} users`,
      );
      throw new Error(
        `Room is full. Maximum ${maxUsersPerRoom} users allowed.`,
      );
    }
  },
  async onAwarenessUpdate(data) {
    const activeUsers = data.states.length;
    console.log(
      `👥 Active users in room ${data.documentName}: ${activeUsers}/${maxUsersPerRoom}`,
    );
  },
  async onDisconnect(data) {
    console.log(`📤 Client disconnected from room: ${data.documentName}`);
  },
  async onDestroy() {
    console.log(`🛑 ${serverName} is shutting down`);
  },
});

function getRoomUserCount(roomName: string): number {
  const doc = server.hocuspocus.documents.get(roomName);
  if (!doc) {
    return 0;
  }

  return doc.getConnectionsCount();
}

server.listen();

Bun.serve({
  port: httpPort,
  routes: {
    "/rooms/:id": (req) => {
      const name = req.params.id;
      const count = getRoomUserCount(name);
      const isFull = count >= maxUsersPerRoom;

      return Response.json({
        room: name,
        count,
        maxUsers: maxUsersPerRoom,
        isFull,
      });
    },
  },
  fetch(_) {
    return new Response("Not found", { status: 404 });
  },
});

console.log(`🌐 ${serverName} HTTP API is listening on ${address}:${httpPort}`);
