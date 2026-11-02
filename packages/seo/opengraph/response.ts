
import { ImageResponse } from "@takumi-rs/image-response/wasm";
import type { ReactNode } from "react";

export function createOpenGraphImage(component: ReactNode, font: ArrayBuffer) {
  return new ImageResponse(component, {
    module: import("@takumi-rs/wasm/next"),
    fonts: [{ name: "Geist", data: new Uint8Array(font), weight: 700 }],
    format: "png",
    width: 1200,
    height: 630,
  });
}
