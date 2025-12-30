import { ImageResponse } from "@takumi-rs/image-response";
import { productionUrl } from "../../constants";

function Component({ code }: { code: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        color: "white",
        padding: "60px",
        justifyContent: "space-between",
        backgroundImage: "linear-gradient(90deg, #000 70%, #fff 100%)",
      }}
    >
      <span style={{ fontSize: 32, fontWeight: "bold" }}>dropnote.</span>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <h1
          style={{
            fontSize: 80,
            fontWeight: "bold",
          }}
        >
          {code}
        </h1>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <span style={{ fontSize: 16 }}>{productionUrl}</span>
      </div>
    </div>
  );
}

export function generateEditorCodeImage(code: string) {
  return new ImageResponse(<Component code={code} />, {
    width: 1200,
    height: 630,
    format: "webp",
  });
}
