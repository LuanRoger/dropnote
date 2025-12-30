import ImageResponse from "@takumi-rs/image-response";

function Component() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        color: "white",
        backgroundColor: "black",
      }}
    >
      <span
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}
      >
        <h1
          style={{
            fontSize: 80,
            fontWeight: "bold",
          }}
        >
          dropnote.
        </h1>
        <p
          style={{
            fontSize: 20,
            color: "#737373",
            marginTop: -60,
          }}
        >
          Create, edit and share text instantly.
        </p>
      </span>
    </div>
  );
}

export function generateHomeImage() {
  return new ImageResponse(<Component />, {
    width: 1200,
    height: 630,
    format: "webp",
  });
}
