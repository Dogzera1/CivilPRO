import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0052CC",
        }}
      >
        <div
          style={{
            width: 360,
            height: 360,
            borderRadius: 72,
            background: "rgba(255,255,255,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 220,
              height: 220,
              borderRadius: 48,
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0052CC",
              fontSize: 140,
              fontWeight: 800,
              fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial",
            }}
          >
            E
          </div>
        </div>
      </div>
    ),
    size
  );
}

