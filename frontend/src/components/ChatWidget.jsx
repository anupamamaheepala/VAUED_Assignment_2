import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";

// ── Inline Styles ─────────────────────────────────────────────────────────────
const S = {
  // Floating toggle button
  fab: {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    zIndex: 9999,
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #166534, #15803d)",
    border: "2px solid #4ade80",
    color: "#4ade80",
    fontSize: "22px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 20px rgba(74, 222, 128, 0.35), 0 4px 20px rgba(0,0,0,0.5)",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  fabBadge: {
    position: "absolute",
    top: "-4px",
    right: "-4px",
    background: "#ef4444",
    color: "#fff",
    fontSize: "10px",
    fontWeight: "700",
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'IBM Plex Mono', monospace",
    border: "2px solid #0d1117",
  },

  // Chat window
  window: (open) => ({
    position: "fixed",
    bottom: "92px",
    right: "24px",
    zIndex: 9998,
    width: "380px",
    height: "560px",
    display: "flex",
    flexDirection: "column",
    background: "#111a14",
    border: "1px solid #1e3a22",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 0 50px rgba(34,197,94,0.08), 0 20px 60px rgba(0,0,0,0.6)",
    transformOrigin: "bottom right",
    transform: open ? "scale(1)" : "scale(0.85)",
    opacity: open ? 1 : 0,
    pointerEvents: open ? "all" : "none",
    transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease",
    fontFamily: "'Syne', sans-serif",
  }),

  // Header
  header: {
    padding: "12px 16px",
    background: "#0d1a10",
    borderBottom: "1px solid #1e3a22",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexShrink: 0,
  },
  headerIcon: {
    fontSize: "18px",
    lineHeight: 1,
  },
  headerTitle: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#4ade80",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    flex: 1,
  },
  headerSub: {
    fontSize: "10px",
    color: "#4a7c59",
    fontFamily: "'IBM Plex Mono', monospace",
    display: "block",
    marginTop: "1px",
    fontWeight: "400",
    letterSpacing: "0.05em",
  },
  statusDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#4ade80",
    boxShadow: "0 0 6px #4ade80",
    flexShrink: 0,
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "#4a7c59",
    fontSize: "18px",
    cursor: "pointer",
    lineHeight: 1,
    padding: "2px",
    borderRadius: "4px",
    transition: "color 0.15s",
  },

  // Messages
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    scrollbarWidth: "thin",
    scrollbarColor: "#1e3a22 transparent",
  },

  // Welcome state
  welcome: {
    textAlign: "center",
    padding: "28px 16px",
    color: "#2d5a36",
  },
  welcomeEmoji: { fontSize: "32px", marginBottom: "8px", display: "block" },
  welcomeTitle: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#4ade80",
    marginBottom: "6px",
  },
  welcomeText: {
    fontSize: "12px",
    lineHeight: "1.7",
    color: "#3d6b4a",
    maxWidth: "260px",
    margin: "0 auto",
  },

  // Suggestions
  suggestions: {
    padding: "0 12px 10px",
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    flexShrink: 0,
  },
  suggChip: {
    background: "#0d1a10",
    border: "1px solid #1e3a22",
    color: "#86efac",
    fontSize: "11px",
    padding: "5px 10px",
    borderRadius: "20px",
    cursor: "pointer",
    fontFamily: "'IBM Plex Mono', monospace",
    transition: "all 0.15s",
    lineHeight: 1.3,
  },

  // Thinking indicator
  thinkingBubble: {
    padding: "10px 14px",
    background: "#161f18",
    border: "1px solid #1e3a22",
    borderRadius: "12px",
    borderBottomLeftRadius: "3px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "12px",
    color: "#4ade80",
    fontFamily: "'IBM Plex Mono', monospace",
    alignSelf: "flex-start",
  },

  // Input area
  inputArea: {
    padding: "10px 12px",
    borderTop: "1px solid #1e3a22",
    background: "#0d1a10",
    display: "flex",
    gap: "8px",
    alignItems: "flex-end",
    flexShrink: 0,
  },
  inputWrap: {
    flex: 1,
    background: "#111a14",
    border: "1px solid #1e3a22",
    borderRadius: "10px",
    padding: "8px 12px",
    display: "flex",
    alignItems: "center",
    transition: "border-color 0.2s",
  },
  inputWrapFocused: {
    borderColor: "#4ade80",
  },
  textarea: {
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#dcfce7",
    fontFamily: "'Syne', sans-serif",
    fontSize: "13px",
    resize: "none",
    width: "100%",
    maxHeight: "80px",
    lineHeight: "1.5",
  },
  sendBtn: (disabled) => ({
    background: disabled ? "#1a2e1c" : "#166534",
    border: `1px solid ${disabled ? "#1e3a22" : "#16a34a"}`,
    color: disabled ? "#2d5a36" : "#4ade80",
    width: "36px",
    height: "36px",
    borderRadius: "9px",
    cursor: disabled ? "not-allowed" : "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    flexShrink: 0,
    transition: "all 0.2s",
    boxShadow: disabled ? "none" : "0 0 10px rgba(74,222,128,0.15)",
  }),
};

// ── Typing dots animation ─────────────────────────────────────────────────────
const dotStyle = (delay) => ({
  display: "inline-block",
  width: "5px",
  height: "5px",
  background: "#4ade80",
  borderRadius: "50%",
  margin: "0 2px",
  animation: "bounceDot 1.2s infinite",
  animationDelay: delay,
});

const SUGGESTIONS = [
  "Which crops are Critical?",
  "Average yield by crop type",
  "Which sectors need irrigation?",
  "Any anomalies detected?",
  "Dhaka soil moisture stats",
  "Compare Tomato vs Rice yield",
];

// ── Main Component ────────────────────────────────────────────────────────────
export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hasNew, setHasNew] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setHasNew(false);
  }, [open]);

  // Inject keyframe animation once
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.textContent = `
      @keyframes bounceDot {
        0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
        40% { transform: translateY(-5px); opacity: 1; }
      }
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(styleEl);
    return () => document.head.removeChild(styleEl);
  }, []);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          history: messages,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Server error");

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ Error: ${err.message}. Check that the backend is running on port 5000.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const autoResize = (el) => {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 80) + "px";
  };

  const showWelcome = messages.length === 0;

  return (
    <>
      {/* ── Chat window ── */}
      <div style={S.window(open)}>
        {/* Header */}
        <div style={S.header}>
          <span style={S.headerIcon}>🌱</span>
          <div style={{ flex: 1 }}>
            <div style={S.headerTitle}>
              NurseryPulse AI
              <span style={S.headerSub}>Crop Intelligence · 10,000 records</span>
            </div>
          </div>
          <div style={S.statusDot} />
          <button
            style={S.closeBtn}
            onClick={() => setOpen(false)}
            onMouseEnter={(e) => (e.target.style.color = "#4ade80")}
            onMouseLeave={(e) => (e.target.style.color = "#4a7c59")}
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div style={S.messages}>
          {showWelcome && (
            <div style={S.welcome}>
              <span style={S.welcomeEmoji}>🌾</span>
              <div style={S.welcomeTitle}>Crop Intelligence Bot</div>
              <p style={S.welcomeText}>
                Ask me anything about your field sensor data — crop health,
                yields, soil conditions, irrigation needs, and anomalies.
              </p>
            </div>
          )}

          {messages.map((m, i) => (
            <ChatMessage key={i} role={m.role} content={m.content} />
          ))}

          {loading && (
            <div>
              <div
                style={{
                  fontSize: "10px",
                  fontFamily: "'IBM Plex Mono', monospace",
                  color: "#4ade80",
                  opacity: 0.7,
                  textTransform: "uppercase",
                  marginBottom: "4px",
                }}
              >
                Agronomist AI
              </div>
              <div style={S.thinkingBubble}>
                <span style={dotStyle("0s")} />
                <span style={dotStyle("0.2s")} />
                <span style={dotStyle("0.4s")} />
                <span style={{ marginLeft: "4px", fontSize: "11px" }}>
                  Analyzing data...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion chips (only when no messages) */}
        {showWelcome && (
          <div style={S.suggestions}>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                style={S.suggChip}
                onClick={() => {
                  setOpen(true);
                  send(s);
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#14532d";
                  e.target.style.borderColor = "#4ade80";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#0d1a10";
                  e.target.style.borderColor = "#1e3a22";
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={S.inputArea}>
          <div
            style={{
              ...S.inputWrap,
              ...(focused ? S.inputWrapFocused : {}),
            }}
          >
            <textarea
              ref={textareaRef}
              value={input}
              rows={1}
              placeholder="Ask about your crop data..."
              style={S.textarea}
              onChange={(e) => {
                setInput(e.target.value);
                autoResize(e.target);
              }}
              onKeyDown={handleKey}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
          </div>
          <button
            style={S.sendBtn(loading || !input.trim())}
            disabled={loading || !input.trim()}
            onClick={() => send()}
            onMouseEnter={(e) => {
              if (!loading && input.trim())
                e.currentTarget.style.boxShadow =
                  "0 0 18px rgba(74,222,128,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow =
                "0 0 10px rgba(74,222,128,0.15)";
            }}
          >
            ↑
          </button>
        </div>
      </div>

      {/* ── FAB toggle button ── */}
      <button
        style={S.fab}
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.08)";
          e.currentTarget.style.boxShadow =
            "0 0 28px rgba(74,222,128,0.5), 0 4px 20px rgba(0,0,0,0.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow =
            "0 0 20px rgba(74, 222, 128, 0.35), 0 4px 20px rgba(0,0,0,0.5)";
        }}
        title="Ask the Crop AI"
      >
        {open ? "✕" : "🌱"}
        {hasNew && !open && <span style={S.fabBadge}>1</span>}
      </button>
    </>
  );
}
