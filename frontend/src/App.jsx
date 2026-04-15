import React from "react";
import ChatWidget from "./components/ChatWidget";

// ── Demo page that looks like a real NurseryPulse dashboard ──────────────────
export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d1117",
        fontFamily: "'Syne', sans-serif",
        color: "#d1fae5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "12px",
        padding: "40px 20px",
      }}
    >
      {/* Demo content to show widget is overlaid */}
      <div
        style={{
          fontSize: "11px",
          fontFamily: "'IBM Plex Mono', monospace",
          color: "#2d5a36",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          marginBottom: "4px",
        }}
      >
        NurseryPulse Smart Observatory
      </div>
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "700",
          color: "#4ade80",
          margin: 0,
          textAlign: "center",
        }}
      >
        Your Website Goes Here
      </h1>
      <p
        style={{
          fontSize: "14px",
          color: "#4a7c59",
          textAlign: "center",
          maxWidth: "440px",
          lineHeight: "1.7",
          margin: 0,
        }}
      >
        The chatbot widget floats in the bottom-right corner. Click the{" "}
        <strong style={{ color: "#4ade80" }}>🌱</strong> button to open it.
        Import <code style={{ color: "#86efac" }}>&lt;ChatWidget /&gt;</code>{" "}
        into any page in your app.
      </p>

      {/* ── THE WIDGET — drop this anywhere in your app ── */}
      <ChatWidget />
    </div>
  );
}
