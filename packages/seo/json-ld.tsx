import { jsonLd } from "./constants";

const escapeJsonForHtml = (json: string): string =>
  json
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");

export const JsonLd = () => (
  <script
    // biome-ignore lint/security/noDangerouslySetInnerHtml: "This is a JSON-LD script with properly escaped content."
    dangerouslySetInnerHTML={{
      __html: escapeJsonForHtml(JSON.stringify(jsonLd)),
    }}
    type="application/ld+json"
  />
);
