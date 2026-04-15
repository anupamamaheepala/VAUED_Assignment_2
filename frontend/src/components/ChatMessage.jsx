import React from "react";

const styles = {
  wrapper: (role) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: role === "user" ? "flex-end" : "flex-start",
    maxWidth: "85%",
    alignSelf: role === "user" ? "flex-end" : "flex-start",
    animation: "fadeUp 0.25s ease",
  }),
  label: (role) => ({
    fontSize: "10px",
    fontFamily: "'IBM Plex Mono', monospace",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: role === "user" ? "#86efac" : "#4ade80",
    marginBottom: "4px",
    opacity: 0.75,
  }),
  bubble: (role) => ({
    padding: "10px 14px",
    borderRadius: "12px",
    borderBottomRightRadius: role === "user" ? "3px" : "12px",
    borderBottomLeftRadius: role === "user" ? "12px" : "3px",
    fontSize: "13.5px",
    lineHeight: "1.65",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    background: role === "user" ? "#14532d" : "#161f18",
    border: role === "user" ? "1px solid #166534" : "1px solid #1e3a22",
    color: role === "user" ? "#dcfce7" : "#d1fae5",
    fontFamily: "'Syne', sans-serif",
  }),
};

export default function ChatMessage({ role, content }) {
  return (
    <div style={styles.wrapper(role)}>
      <span style={styles.label(role)}>
        {role === "user" ? "You" : "Agronomist AI"}
      </span>
      <div style={styles.bubble(role)}>{content}</div>
    </div>
  );
}
