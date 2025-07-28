import { ImageResponse } from "next/og";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: "#0a0a0a",
          color: "white",
          width: "100%",
          height: "100%",
          padding: "60px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "flex-start",
          fontFamily: "Inter",
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 900,
            marginBottom: 16,
          }}
        >
          Playground – David Umoru
        </div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 400,
            color: "#999",
            maxWidth: 700,
            lineHeight: 1.4,
          }}
        >
          Interactive experiments exploring WebGL, Canvas, generative visuals,
          and creative coding.
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
