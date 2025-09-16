import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 600,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 44,
        background:
          "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #a855f7 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontFamily: "sans-serif",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "15%",
          width: "200px",
          height: "200px",
          backgroundColor: "rgba(255,255,255,0.1)",
          borderRadius: "50%",
          filter: "blur(40px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          right: "20%",
          width: "150px",
          height: "150px",
          backgroundColor: "rgba(255,255,255,0.08)",
          borderRadius: "50%",
          filter: "blur(30px)",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "30px",
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontSize: 58,
            fontWeight: "bold",
            marginBottom: 15,
            textShadow: "0 4px 8px rgba(0,0,0,0.4)",
          }}
        >
          RenovaBit
        </div>
        <div
          style={{
            fontSize: 28,
            marginBottom: 12,
            opacity: 0.95,
          }}
        >
          Servicio Técnico Especializado
        </div>
        <div
          style={{
            fontSize: 24,
            opacity: 0.9,
            marginBottom: 15,
          }}
        >
          📍 Arequipa • 📞 Contacto inmediato
        </div>
        <div
          style={{
            fontSize: 20,
            opacity: 0.85,
            display: "flex",
            gap: "25px",
          }}
        >
          <span>🔧 Reparación</span>
          <span>🏠 A domicilio</span>
          <span>⚡ Remoto</span>
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
