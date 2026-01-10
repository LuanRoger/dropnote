import { Logger } from "@hocuspocus/extension-logger";
import { Server } from "@hocuspocus/server";

const serverName = "dropnote-multiplayer-server";
const address = process.env.ADDRESS || "::";
const port = Number(process.env.PORT) || 3001;
const timeout = Number(process.env.TIMEOUT);
const debounce = Number(process.env.DEBOUNCE);
const maxDebounce = Number(process.env.MAX_DEBOUNCE);

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
  port,
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
  async onDisconnect(data) {
    console.log(`📤 Client disconnected from room: ${data.documentName}`);
  },
  async onDestroy() {
    console.log(`🛑 ${serverName} is shutting down`);
  },
});

server.listen();
