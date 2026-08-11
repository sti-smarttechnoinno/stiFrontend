import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function favicon(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
          background: "#D71920",
        }}
      >
        <span
          style={{
            color: "white",
            fontSize: 16,
            fontWeight: 900,
            fontFamily: "Arial",
            letterSpacing: -0.5,
          }}
        >
          STI
        </span>
      </div>
    ),
    { ...size }
  );
}
