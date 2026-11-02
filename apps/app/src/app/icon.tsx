
import { ImageResponse } from "next/og";
import { loadImageFont } from "@/lib/image-font";

export const contentType = "image/png";

export default async function Icon() {
  const geistFont = await loadImageFont();

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
