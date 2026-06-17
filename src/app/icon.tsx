import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 280,
          background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          borderRadius: 96,
          fontWeight: 700,
        }}
      >
        W
      </div>
    ),
    { ...size }
  );
}
