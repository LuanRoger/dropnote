import { Logger } from "@hocuspocus/extension-logger";
import { Server } from "@hocuspocus/server";

const serverName = "dropnote-multiplayer-server";
const address = process.env.ADDRESS;
const port = Number(process.env.PORT);
const timeout = Number(process.env.TIMEOUT);
const debounce = Number(process.env.DEBOUNCE);
const maxDebounce = Number(process.env.MAX_DEBOUNCE);

if (!address) {
  throw new Error("ADDRESS environment variable is not set.");
}
if (!port || Number.isNaN(port)) {
  throw new Error("PORT environment variable is not set or is not a number.");
}
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
});

server.listen();
