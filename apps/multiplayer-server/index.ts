import "@varlock/cloudflare-integration/init";
import { Logger } from "@hocuspocus/extension-logger";
import { Throttle } from "@hocuspocus/extension-throttle";
import { Hocuspocus } from "@hocuspocus/server";
import { DurableObject } from "cloudflare:workers";
import { ENV } from "varlock/env";
import { DropnoteMultiplayerServerExtension } from "./extension";
import { isAuthValid } from "./utils/auth";
import { getRoomUserCount } from "./utils/documents";
import { createRoomToken } from "./utils/tokens";
import { ROOM_ROUTE_PATTERN, SERVER_NAME } from "./constants";

export class MultiplayerServer extends DurableObject<Cloudflare.Env> {
  private readonly server: Hocuspocus;

  constructor(ctx: DurableObjectState, env: Cloudflare.Env) {
    super(ctx, env);
    const { API_KEY, TIMEOUT, DEBOUNCE, MAX_DEBOUNCE, MAX_USERS_PER_ROOM } = ENV;

    this.server = new Hocuspocus({
      name: SERVER_NAME,
      timeout: TIMEOUT,
      debounce: DEBOUNCE,
      maxDebounce: MAX_DEBOUNCE,
      extensions: [
        new Throttle({ throttle: 10, banTime: 10 }),
        new Logger(),
        new DropnoteMultiplayerServerExtension(
          API_KEY,
          MAX_USERS_PER_ROOM
        ),
      ],
    });
  }

  override async fetch(request: Request): Promise<Response> {
    if (request.headers.get("Upgrade")?.toLowerCase() === "websocket") {
      return this.handleWebSocket(request);
    }

    const route = new URL(request.url).pathname.match(ROOM_ROUTE_PATTERN);
    const roomPath = route?.[1];
    const isTokenRequest = route?.[2] === "/token";
    if (!roomPath) {
      return new Response("Not found", { status: 404 });
    }

    const allowedMethod = isTokenRequest ? "POST" : "GET";
    if (request.method !== allowedMethod) {
      return new Response("Method not allowed", {
        status: 405,
        headers: { Allow: allowedMethod },
      });
    }
    if (
      !isAuthValid(
        ENV.API_KEY,
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

    if (isTokenRequest) {
      const token = await createRoomToken(ENV.API_KEY, room);
      return Response.json(
        { token },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    const count = getRoomUserCount(this.server, room);
    const { MAX_USERS_PER_ROOM: maxUsers } = ENV;
    return Response.json(
      { room, count, maxUsers, isFull: count >= maxUsers },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  private handleWebSocket(request: Request): Response {
    const pair = new WebSocketPair();
    const [client, socket] = [pair[0], pair[1]];
    const headers = new Headers(request.headers);
    headers.set(
      "x-real-ip",
      request.headers.get("CF-Connecting-IP") ?? "unknown"
    );
    const connectionRequest = new Request(request, { headers });

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
    if (!isWebSocket && !ROOM_ROUTE_PATTERN.test(new URL(request.url).pathname)) {
      return new Response("Not found", { status: 404 });
    }

    return env.MULTIPLAYER.getByName(SERVER_NAME).fetch(request);
  },
} satisfies ExportedHandler<Cloudflare.Env>;
