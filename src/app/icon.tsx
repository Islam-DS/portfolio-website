import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
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
          background: "#0E2A27",
          borderRadius: 7,
          color: "#C99A46",
          fontSize: 17,
          fontWeight: 700,
          fontFamily: "Arial, sans-serif",
          letterSpacing: "-0.5px",
        }}
      >
        MI
      </div>
    ),
    { ...size }
  );
}
