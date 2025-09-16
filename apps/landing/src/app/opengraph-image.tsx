import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 48,
        background: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "40px",
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: "bold",
            marginBottom: 20,
            textShadow: "0 4px 8px rgba(0,0,0,0.3)",
          }}
        >
          RenovaBit
        </div>
        <div
          style={{
            fontSize: 32,
            marginBottom: 15,
            opacity: 0.95,
          }}
        >
          Servicio Técnico de Laptops y PCs
        </div>
        <div
          style={{
            fontSize: 28,
            opacity: 0.9,
            marginBottom: 20,
          }}
        >
          📍 Arequipa, Perú
        </div>
        <div
          style={{
            fontSize: 24,
            opacity: 0.85,
            display: "flex",
            gap: "30px",
          }}
        >
          <span>🔧 Reparación</span>
          <span>🏠 A domicilio</span>
          <span>⚡ Soporte remoto</span>
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
