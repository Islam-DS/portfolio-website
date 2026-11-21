import { ImageResponse } from "next/og";

/** Social preview card (email, LinkedIn, Slack link unfurls): the facts a
 * prospective supervisor scans first, instead of only the portrait. */
export const alt = "Md. Mahbubul Islam — Medical AI and Data Science research";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const FACTS = ["BSc Data Science · Al-Farabi KazNU", "GPA 3.82 / 4.00", "3 publications", "IELTS 7.0"];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F7F3E9",
          padding: "72px 80px",
          fontFamily: "Arial, sans-serif",
          borderLeft: "24px solid #0E2A27",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 26, letterSpacing: 4, color: "#A8792C", textTransform: "uppercase" }}>
            Seeking MSc research positions · 2027
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 84, fontWeight: 700, color: "#1A1814", letterSpacing: -2 }}>
            Md. Mahbubul Islam
          </div>
          <div style={{ display: "flex", marginTop: 16, fontSize: 40, color: "#3D3A33" }}>
            Medical AI · Computational Oncology
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          {FACTS.map((f) => (
            <div
              key={f}
              style={{
                display: "flex",
                fontSize: 28,
                color: "#1A1814",
                border: "2px solid rgba(26,24,20,0.2)",
                borderRadius: 999,
                padding: "10px 26px",
              }}
            >
              {f}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
