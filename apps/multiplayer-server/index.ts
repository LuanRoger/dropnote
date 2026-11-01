import "@varlock/cloudflare-integration/init";
import { Logger } from "@hocuspocus/extension-logger";
import { Throttle } from "@hocuspocus/extension-throttle";
import { Hocuspocus } from "@hocuspocus/server";
import { DurableObject } from "cloudflare:workers";
import { getServerConfig } from "./config";
import { DropnoteMultiplayerServerExtension } from "./extension";
import { isAuthValid } from "./utils/auth";
import { getRoomUserCount } from "./utils/documents";

const serverName = "dropnote-multiplayer-server";

export class MultiplayerServer extends DurableObject<Cloudflare.Env> {
  private readonly server: Hocuspocus;
  private readonly config = getServerConfig();

  constructor(ctx: DurableObjectState, env: Cloudflare.Env) {
    super(ctx, env);

    this.server = new Hocuspocus({
      name: serverName,
      timeout: this.config.TIMEOUT,
      debounce: this.config.DEBOUNCE,
      maxDebounce: this.config.MAX_DEBOUNCE,
      extensions: [
        new Throttle({ throttle: 10, banTime: 10 }),
        new Logger(),
        new DropnoteMultiplayerServerExtension(
          this.config.API_KEY,
          this.config.MAX_USERS_PER_ROOM
        ),
      ],
    });
  }

  override async fetch(request: Request): Promise<Response> {
    if (request.headers.get("Upgrade")?.toLowerCase() === "websocket") {
      return this.handleWebSocket(request);
    }

    const roomPath = new URL(request.url).pathname.match(
      /^\/rooms\/([^/]+)$/
    )?.[1];
    if (!roomPath) {
      return new Response("Not found", { status: 404 });
    }
    if (request.method !== "GET") {
      return new Response("Method not allowed", {
        status: 405,
        headers: { Allow: "GET" },
      });
    }
    if (
      !isAuthValid(
        this.config.API_KEY,
        request.headers.get("api-key") ?? undefined
      )
    ) {
      return new Response("Unauthorized", { status: 401 });
    }

    let room: string;
    try {
      room = decodeURIComponent(roomPath);
    } catch {
      return new Response("Invalid room name", { status: 400 });
    }

    const count = getRoomUserCount(this.server, room);
    const maxUsers = this.config.MAX_USERS_PER_ROOM;
    return Response.json(
      { room, count, maxUsers, isFull: count >= maxUsers },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  private handleWebSocket(request: Request): Response {
    const pair = new WebSocketPair();
    const [client, socket] = [pair[0], pair[1]];

    // Throttle uses x-real-ip, not Cloudflare's trusted client IP header.
    const headers = new Headers(request.headers);
    headers.set(
      "x-real-ip",
      request.headers.get("CF-Connecting-IP") ?? "unknown"
    );
    const connectionRequest = new Request(request, { headers });

    // Hocuspocus keeps live document/connection state, so use standard sockets,
    // not the Durable Object hibernation API.
    socket.binaryType = "arraybuffer";
    socket.accept();
    const connection = this.server.handleConnection(socket, connectionRequest);
    let closed = false;
    const cleanup = (code: number, reason: string) => {
      if (closed) {
        return;
      }
      closed = true;
      connection.handleClose({ code, reason });
    };

    socket.addEventListener("message", (event) => {
      if (closed) {
        return;
      }
      if (typeof event.data === "string") {
        cleanup(1003, "Binary messages required");
        socket.close(1003, "Binary messages required");
        return;
      }
      connection.handleMessage(new Uint8Array(event.data));
    });
    socket.addEventListener("close", (event) => {
      cleanup(event.code, event.reason);
      if (socket.readyState === WebSocket.OPEN) {
        socket.close(1000, "Connection closed");
      }
    });
    socket.addEventListener("error", () => {
      cleanup(1011, "WebSocket error");
      socket.close(1011, "WebSocket error");
    });

    return new Response(null, { status: 101, webSocket: client });
  }
}

export default {
  fetch(request, env) {
    const isWebSocket =
      request.headers.get("Upgrade")?.toLowerCase() === "websocket";
    if (
      !isWebSocket &&
      !/^\/rooms\/[^/]+$/.test(new URL(request.url).pathname)
    ) {
      return new Response("Not found", { status: 404 });
    }

    // A single shared instance preserves the existing URL and Hocuspocus
    // multiplexing: document names are carried in frames, not in the URL.
    return env.MULTIPLAYER.getByName(serverName).fetch(request);
  },
} satisfies ExportedHandler<Cloudflare.Env>;
