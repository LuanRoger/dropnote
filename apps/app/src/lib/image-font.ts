import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function loadImageFont(): Promise<ArrayBuffer> {
  if ("WebSocketPair" in globalThis) {
    // Worker file I/O cannot read the app's public directory. Use the asset binding.
    const assets = getCloudflareContext().env.ASSETS;
    if (!assets) {
      throw new Error("The ASSETS binding is required to load the image font.");
    }

    const response = await assets.fetch(
      new Request("https://assets.internal/Geist-Bold.ttf")
    );
    if (!response.ok) {
      throw new Error(`Could not load the image font asset (${response.status}).`);
    }
    return response.arrayBuffer();
  }

  const font = await readFile(join(process.cwd(), "public", "Geist-Bold.ttf"));
  return new Uint8Array(font).buffer;
}
