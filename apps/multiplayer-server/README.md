# Multiplayer server

Hocuspocus v4 running on Cloudflare Workers with a Durable Object. No Bun runtime or standalone HTTP/WebSocket listener is needed.

## Configuration

The scalar settings come from Varlock's `.env.schema` and your local environment/secret provider:

| Setting | Requirement |
| --- | --- |
| `API_KEY` | Nonempty secret, shared with the app's `HOCUSPOCUS_API_KEY` |
| `TIMEOUT` | Positive integer, in milliseconds |
| `DEBOUNCE` | Nonnegative integer, in milliseconds |
| `MAX_DEBOUNCE` | Integer at least as large as `DEBOUNCE`, in milliseconds |
| `MAX_USERS_PER_ROOM` | Positive integer |

Use the Varlock-wrapped commands for development and deployment. They supply the resolved environment required by `@varlock/cloudflare-integration/init`; plain `wrangler dev`/`wrangler deploy` do not supply it automatically. Do not put `API_KEY` in Wrangler's public `vars`.

From the repository root:

```sh
pnpm --filter multiplayer-server typegen
pnpm --filter multiplayer-server dev
```

`start` also starts Wrangler's local development runtime. To deploy:

```sh
pnpm --filter multiplayer-server deploy
```

Wrangler creates the `MULTIPLAYER` Durable Object binding and applies the `v1` migration on first deployment. The compatibility date is `2026-10-30`, supported by the installed Wrangler/workerd version. `nodejs_compat` is required by Hocuspocus and Varlock's runtime dependencies.

## Client compatibility and routing

Point the app at this Worker:

- `HOCUSPOCUS_WSS_URL`: the Worker's WebSocket URL (`wss://` in production, `ws://` locally).
- `HOCUSPOCUS_API_URL`: the same Worker's HTTP URL (`https://` in production, `http://` locally).
- `HOCUSPOCUS_API_KEY`: the same value as this server's `API_KEY`.

WebSocket upgrades still work at the existing base URL. `GET /rooms/:id` requires the `api-key` header and returns `{ room, count, maxUsers, isFull }`; its responses are not cacheable. Counts represent document connections, not unique people.

### Authentication

`API_KEY` / `HOCUSPOCUS_API_KEY` is a **server-to-server secret**. Never pass it to a client component or use it directly as the Hocuspocus provider's token. Keep it sensitive in Varlock.

The app passes a bound server action as the provider's async `token` callback. On authentication/reconnect, that action validates the note code and calls `POST /rooms/:id/token` with the secret in the `api-key` header. The endpoint returns `{ token }` with `Cache-Control: no-store`.

WebSocket tokens are HMAC-SHA256 signed, valid for five minutes, and restricted to one room. Only the scoped token reaches the browser; it cannot authorize HTTP API requests or another room. Expiration is checked when authenticating, not used to disconnect an already authenticated editor. The callback obtains a fresh token on reconnect.

Deploy/restart the app and multiplayer server together for this change: raw API keys are no longer accepted as WebSocket credentials. Both servers still use the same existing secret; no additional environment variables are required. Rotate that secret if it was exposed by the previous client-prop implementation.

All requests route to **one named Durable Object** so every Worker instance sees the same rooms. This deliberately preserves the existing URL and multiplexing behavior: Hocuspocus document names are carried inside protocol frames, not the request path. A per-room Durable Object design would require room-specific client URLs and rejecting frames for other rooms; this migration does not introduce that client/protocol change.

## Lifecycle and limits

- Documents remain **in memory**, matching the original server. The SQLite-backed Durable Object class does not itself persist Yjs documents. State is unloaded after the last connection leaves and can be lost on object restart/deployment; the application's note persistence remains separate.
- WebSockets use the standard acceptance API, **not hibernation**. Hocuspocus's connection state, awareness, and timers stay live. Active objects incur Durable Object duration charges.
- There is no Worker `listen()` or reliable shutdown hook. Hocuspocus receives WebSocket message, close, and error events directly.
- Throttling remains 10 document connection attempts per IP per minute, with a 10-minute ban. The adapter uses Cloudflare's trusted `CF-Connecting-IP` header. Throttle state is local to the object and resets with it.
- The existing awareness-based room-limit guard is preserved. It is not a strict admission/reservation mechanism; the room-info preflight can race with other joins.

## Validation

```sh
pnpm --filter multiplayer-server typecheck
pnpm --filter multiplayer-server build
pnpm --filter multiplayer-server test:auth
```

`typecheck` generates Worker/runtime declarations before running TypeScript. Generated `worker-configuration.d.ts` and `.wrangler` state are ignored. `build` bundles with `wrangler deploy --dry-run` and does not upload or deploy.

The authentication tests use the Node test runner, Wrangler's local Workers runtime, a synthetic resolved Varlock environment, and no Cloudflare account. They cover token issuance, expiration, signature tampering, malformed claims, backend-only token creation, and WebSocket rejection of raw master keys and tokens for other rooms.
