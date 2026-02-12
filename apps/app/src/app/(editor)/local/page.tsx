import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import LocalEditor from "./components/local-editor";

const code = "local";
export const metadata: Metadata = createMetadata({
  title: code,
  description: `Editing note with code: ${code}`,
});

export default function LocalPage() {
  return <LocalEditor code={code} />;
}
