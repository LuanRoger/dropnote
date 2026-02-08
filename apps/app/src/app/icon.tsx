import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const contentType = "image/png";

export default async function Icon() {
  const geistFont = await readFile(
    join(process.cwd(), "public", "Geist-Bold.ttf")
  );

  return new ImageResponse(
    <div
      style={{
        fontSize: 24,
        background: "black",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Geist",
        color: "white",
      }}
    >
      d.
    </div>,
    {
      width: 32,
      height: 32,
      fonts: [
        {
          name: "Geist",
          data: geistFont,
        },
      ],
    }
  );
}
