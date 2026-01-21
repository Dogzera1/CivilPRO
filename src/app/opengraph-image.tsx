import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 64,
          background: "linear-gradient(135deg, #0052CC 0%, #003A8C 60%, #0F172A 100%)",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 32 }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              background: "white",
              color: "#0052CC",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 52,
              fontWeight: 800,
              fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial",
            }}
          >
            E
          </div>
          <div style={{ fontSize: 40, fontWeight: 800 }}>EngenhaAI</div>
        </div>

        <div style={{ fontSize: 64, fontWeight: 900, lineHeight: 1.05, maxWidth: 980 }}>
          Gere laudos técnicos profissionais em minutos
        </div>
        <div style={{ marginTop: 18, fontSize: 28, opacity: 0.92, maxWidth: 980 }}>
          Engenharia Inteligente, Decisões Rápidas. REURB, memoriais, vistorias e orçamentos com IA.
        </div>

        <div style={{ marginTop: 36, display: "flex", gap: 18, flexWrap: "wrap" }}>
          <div
            style={{
              padding: "12px 16px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.14)",
              fontSize: 20,
            }}
          >
            Conforme normas e legislação
          </div>
          <div
            style={{
              padding: "12px 16px",
              borderRadius: 999,
              background: "rgba(0,200,83,0.18)",
              fontSize: 20,
            }}
          >
            Teste grátis
          </div>
        </div>
      </div>
    ),
    size
  );
}

