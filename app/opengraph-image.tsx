import { ImageResponse } from "next/og";

export const alt = "What do I do today? — 1,239 activity ideas";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        {/* Card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.12)",
            borderRadius: 32,
            border: "2px solid rgba(255,255,255,0.25)",
            padding: "60px 80px",
            gap: 24,
          }}
        >
          <div style={{ fontSize: 96, lineHeight: 1 }}>✨</div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: "white",
              letterSpacing: "-2px",
              textAlign: "center",
              lineHeight: 1.1,
            }}
          >
            What do I do today?
          </div>
          <div
            style={{
              fontSize: 28,
              color: "rgba(255,255,255,0.85)",
              textAlign: "center",
              fontWeight: 500,
            }}
          >
            1,239 activity ideas · 12 categories · swipe to discover
          </div>
        </div>

        {/* Category pills at bottom */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 40,
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: 1000,
          }}
        >
          {["🌿 Outdoors", "🍴 Food", "🎉 Social", "🎨 Creative", "🧘 Wellness", "⚡ Adventure"].map((label) => (
            <div
              key={label}
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "1.5px solid rgba(255,255,255,0.35)",
                borderRadius: 40,
                padding: "10px 22px",
                color: "white",
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
