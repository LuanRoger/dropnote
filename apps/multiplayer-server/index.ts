/** biome-ignore-all lint/suspicious/useAwait: The signature of the function do not allow not async functions */
import { Logger } from "@hocuspocus/extension-logger";
import { Throttle } from "@hocuspocus/extension-throttle";
import { Server } from "@hocuspocus/server";
import { env } from "./env";
import { DropnoteMultiplayerServerExtension } from "./extension";
import { isAuthValid } from "./utils/auth";
import { getRoomUserCount } from "./utils/documents";

const serverName = "dropnote-multiplayer-server";
const address = env.ADDRESS;
const wssPort = env.WSS_PORT;
const httpPort = env.HTTP_PORT;
const apiKey = env.API_KEY;
const timeout = env.TIMEOUT;
const debounce = env.DEBOUNCE;
const maxDebounce = env.MAX_DEBOUNCE;
const maxUsersPerRoom = env.MAX_USERS_PER_ROOM;

if (!timeout || Number.isNaN(timeout)) {
  throw new Error(
    "TIMEOUT environment variable is not set or is not a number."
  );
}
if (!debounce || Number.isNaN(debounce)) {
  throw new Error(
    "DEBOUNCE environment variable is not set or is not a number."
  );
}
if (!maxDebounce || Number.isNaN(maxDebounce)) {
  throw new Error(
    "MAX_DEBOUNCE environment variable is not set or is not a number."
  );
}

const server = new Server({
  name: serverName,
  address,
  port: wssPort,
  timeout,
  debounce,
  maxDebounce,
  extensions: [
    new Throttle({
      throttle: 10,
      banTime: 10,
    }),
    new Logger(),
    new DropnoteMultiplayerServerExtension(
      serverName,
      address,
      apiKey,
      maxUsersPerRoom
    ),
  ],
});

server.listen();

Bun.serve({
  port: httpPort,
  routes: {
    "/rooms/:id": (req) => {
      const apiKeyHeader = req.headers.get("api-key") ?? undefined;
      const isAuthenticated = isAuthValid(apiKey, apiKeyHeader);
      if (!isAuthenticated) {
        return new Response("Unauthorized", { status: 401 });
      }

      const name = req.params.id;
      const count = getRoomUserCount(server, name);
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
