import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512
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
          background: "#0f172a",
          borderRadius: "48px",
          position: "relative"
        }}
      >
        <div
          style={{
            width: 112,
            height: 112,
            borderRadius: 28,
            border: "10px solid #f8fafc",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            position: "relative"
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -14,
              width: 90,
              height: 90,
              borderTop: "10px solid #67e8f9",
              borderLeft: "10px solid transparent",
              borderRight: "10px solid transparent",
              transform: "translateY(-18px)"
            }}
          />
          <div
            style={{
              width: 36,
              height: 56,
              background: "#f59e0b",
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            top: 34,
            right: 34,
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#f59e0b",
            color: "#0f172a",
            fontSize: 28,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          +
        </div>
      </div>
    ),
    size
  );
}
