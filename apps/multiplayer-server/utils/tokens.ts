import {
  BASE64_DASH_REGEX,
  BASE64_PADDING_REGEX,
  BASE64_PLUS_REGEX,
  BASE64_SLASH_REGEX,
  BASE64_UNDERSCORE_REGEX,
  BASE64_URL_CHARACTER_REGEX,
  MAX_TOKEN_BYTES,
  TOKEN_LIFETIME_SECONDS,
  TOKEN_VERSION,
} from "../constants";

const encoder = new TextEncoder();
const decoder = new TextDecoder("utf-8", { fatal: true, ignoreBOM: false });

function encodeBase64Url(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replace(BASE64_PLUS_REGEX, "-")
    .replace(BASE64_SLASH_REGEX, "_")
    .replace(BASE64_PADDING_REGEX, "");
}

function decodeBase64Url(value: string): Uint8Array {
  if (!BASE64_URL_CHARACTER_REGEX.test(value)) {
    throw new Error("Invalid base64url encoding.");
  }

  const padded = value
      .replace(BASE64_DASH_REGEX, "+")
      .replace(BASE64_UNDERSCORE_REGEX, "/");
  const bytes = Uint8Array.from(
    atob(padded.padEnd(Math.ceil(padded.length / 4) * 4, "=")),
    (character) => character.charCodeAt(0)
  );

  if (encodeBase64Url(bytes) !== value) {
    throw new Error("Invalid base64url encoding.");
  }

  return bytes;
}

function importSigningKey(apiKey: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(apiKey),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function createRoomToken(
  apiKey: string,
  room: string
): Promise<string> {
  if (
    typeof apiKey !== "string" ||
    apiKey.length === 0 ||
    typeof room !== "string" ||
    room.length > MAX_TOKEN_BYTES
  ) {
    throw new Error("Invalid room token parameters.");
  }

  const payload = encodeBase64Url(
    encoder.encode(
      JSON.stringify({
        room,
        expiresAt: Math.floor(Date.now() / 1000) + TOKEN_LIFETIME_SECONDS,
      })
    )
  );
  const signedContent = `${TOKEN_VERSION}.${payload}`;

  if (signedContent.length + 1 + 43 > MAX_TOKEN_BYTES) {
    throw new Error("Room token exceeds the maximum size.");
  }

  const signature = await crypto.subtle.sign(
    "HMAC",
    await importSigningKey(apiKey),
    encoder.encode(signedContent)
  );

  return `${signedContent}.${encodeBase64Url(new Uint8Array(signature))}`;
}

export async function isRoomTokenValid(
  apiKey: string,
  room: string,
  token: string
): Promise<boolean> {
  if (
    typeof apiKey !== "string" ||
    apiKey.length === 0 ||
    typeof room !== "string" ||
    typeof token !== "string" ||
    token.length > MAX_TOKEN_BYTES ||
    token === apiKey
  ) {
    return false;
  }

  try {
    const parts = token.split(".");
    const [version, payload, signature] = parts;
    if (
      parts.length !== 3 ||
      version !== TOKEN_VERSION ||
      !payload ||
      !signature ||
      signature.length !== 43
    ) {
      return false;
    }

    const payloadBytes = decodeBase64Url(payload);
    const signatureBytes = decodeBase64Url(signature);
    const isSignatureValid = await crypto.subtle.verify(
      "HMAC",
      await importSigningKey(apiKey),
      signatureBytes,
      encoder.encode(`${version}.${payload}`)
    );
    if (!isSignatureValid) {
      return false;
    }

    const claims: unknown = JSON.parse(decoder.decode(payloadBytes));
    return (
      typeof claims === "object" &&
      claims !== null &&
      !Array.isArray(claims) &&
      "room" in claims &&
      typeof claims.room === "string" &&
      claims.room === room &&
      "expiresAt" in claims &&
      typeof claims.expiresAt === "number" &&
      Number.isSafeInteger(claims.expiresAt) &&
      claims.expiresAt > Math.floor(Date.now() / 1000)
    );
  } catch {
    return false;
  }
}
