import React, { useState, useRef, useEffect } from "react";

const C = {
  bg: "#101510",
  surface: "#1c211b",
  surfaceHigh: "#262b26",
  surfaceHighest: "#313630",
  surfaceLow: "#181d17",
  surfaceLowest: "#0a0f0a",
  primary: "#88d982",
  primaryContainer: "#065f18",
  secondaryContainer: "#feb300",
  secondary: "#ffd799",
  error: "#ffb4ab",
  onSurface: "#dfe4db",
  onSurfaceVariant: "#c0c9bb",
  stone500: "#78716c",
  stone400: "#a8a29e",
  stone300: "#d6d3d1",
  stone800: "#292524",
  stone600: "#57534e",
};

const fontHeadline = "'Manrope', sans-serif";
const fontBody = "'Inter', sans-serif";

const glassPanel = {
  background: "rgba(49,54,48,0.7)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(138,147,134,0.15)",
};

const NAV_ITEMS = [
  { icon: "dashboard",            label: "Dashboard", page: "dashboard" },
  { icon: "potted_plant",         label: "Health",    page: "health"    },
  { icon: "notifications_active", label: "Alerts",    page: "alerts"    },
  { icon: "trending_up",          label: "Trends",    page: "trends"    },
  { icon: "smart_toy",            label: "AI Chatbot",page: "chatbot"   },
];

const INITIAL_MESSAGES = [
  {
    role: "bot",
    content: null,
    welcome: true,
  },
  {
    role: "user",
    content: "Summarize today's alerts for Mymensingh",
    time: "Sent 2m ago",
  },
  {
    role: "bot",
    content: null,
    summary: true,
  },
];

const CHIPS = [
  { icon: "summarize",   label: "Summarize today's alerts for Mymensingh" },
  { icon: "science",     label: "Is the soil pH okay for Rice?" },
  { icon: "agriculture", label: "Show me the expected yield for the Summer season." },
];

function BotAvatar() {
  return (
    <div style={{
      width: "40px", height: "40px", borderRadius: "50%", flexShrink: 0,
      background: "rgba(136,217,130,0.2)", border: "1px solid rgba(136,217,130,0.3)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <span className="material-symbols-outlined" style={{ color: C.primary, fontSize: "20px" }}>smart_toy</span>
    </div>
  );
}

function UserAvatar() {
  return (
    <div style={{
      width: "40px", height: "40px", borderRadius: "50%", flexShrink: 0,
      background: C.surfaceHigh, border: "1px solid rgba(65,73,62,0.2)",
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden",
    }}>
      <span className="material-symbols-outlined" style={{ color: C.onSurfaceVariant, fontSize: "20px" }}>person</span>
    </div>
  );
}

function WelcomeMessage() {
  return (
    <div style={{ ...glassPanel, padding: "24px", borderRadius: "16px", borderTopLeftRadius: "4px", maxWidth: "600px" }}>
      <h2 style={{ fontSize: "18px", fontWeight: "700", fontFamily: fontHeadline, margin: "0 0 8px", color: C.onSurface }}>
        Good morning, Aris.
      </h2>
      <p style={{ fontSize: "14px", color: C.onSurfaceVariant, lineHeight: "1.65", margin: 0 }}>
        I've been monitoring the nursery sensors in the{" "}
        <strong style={{ color: C.onSurface }}>Mymensingh Sector</strong>. All systems are currently within nominal parameters,
        but I've noticed a slight trend in moisture evaporation rates.
      </p>
      <p style={{ fontSize: "14px", color: C.onSurfaceVariant, lineHeight: "1.65", margin: "14px 0 0" }}>
        How can I assist your observatory operations today?
      </p>
    </div>
  );
}

function SummaryMessage() {
  return (
    <div style={{ ...glassPanel, padding: "24px", borderRadius: "16px", borderTopLeftRadius: "4px", maxWidth: "720px" }}>
      <h3 style={{
        fontSize: "13px", fontWeight: "800", color: C.primary, margin: "0 0 20px",
        display: "flex", alignItems: "center", gap: "8px", letterSpacing: "0.04em",
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>analytics</span>
        MYMENSINGH SECTOR SUMMARY
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px", color: C.onSurfaceVariant, fontSize: "14px" }}>
        {/* Soil Health */}
        <div>
          <h4 style={{ fontSize: "14px", fontWeight: "700", color: C.onSurface, margin: "0 0 8px", display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.secondaryContainer, display: "inline-block", flexShrink: 0 }} />
            Soil Health Advisory
          </h4>
          <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "1.7" }}>
            <li><strong style={{ color: C.onSurface }}>PH Balance:</strong> Currently at 6.2 across the Rice fields. This is within the optimal range (6.0-6.5). No limestone correction required.</li>
            <li style={{ marginTop: "6px" }}><strong style={{ color: C.onSurface }}>Nitrogen Levels:</strong> Dropped by 4% in the last 24 hours. Consider scheduled fertigation for the North-East quadrant.</li>
          </ul>
        </div>
        {/* Atmospheric */}
        <div>
          <h4 style={{ fontSize: "14px", fontWeight: "700", color: C.onSurface, margin: "0 0 8px", display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.primary, display: "inline-block", flexShrink: 0 }} />
            Atmospheric Observations
          </h4>
          <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "1.7" }}>
            <li><strong style={{ color: C.onSurface }}>Relative Humidity:</strong> Average 78%. Ideal for current growth stage.</li>
            <li style={{ marginTop: "6px" }}><strong style={{ color: C.onSurface }}>Potential Risk:</strong> Thermal sensors indicate a 1.2°C rise in canopy temperature. Ventilation automation has been adjusted to +15% capacity.</li>
          </ul>
        </div>
        {/* Advice box */}
        <div style={{
          padding: "14px 16px", background: "rgba(10,15,10,0.5)",
          borderRadius: "10px", borderLeft: `3px solid rgba(254,179,0,0.5)`,
        }}>
          <p style={{ fontSize: "13px", fontStyle: "italic", margin: 0, lineHeight: "1.6" }}>
            "Advice: Prioritize checking the North-East irrigation valves. Sensor 4B is reporting irregular pressure pulses."
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AIchatbot({ onNavigate }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
  const msg = text || input.trim();
  if (!msg || loading) return;
  setInput("");

  // Build history for the FastAPI backend
  const history = messages
    .filter((m) => !m.welcome && !m.summary && m.content)
    .map((m) => ({
      role: m.role === "bot" ? "assistant" : "user",
      content: m.content,
    }));

  setMessages((prev) => [...prev, { role: "user", content: msg, time: "Just now" }]);
  setLoading(true);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg, history }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Server error");
    setMessages((prev) => [...prev, { role: "bot", content: data.reply }]);
  } catch (err) {
    setMessages((prev) => [
      ...prev,
      { role: "bot", content: `⚠️ ${err.message}. Ensure the Python backend is running on port 5000.` },
    ]);
  } finally {
    setLoading(false);
  }
};

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.onSurface, fontFamily: fontBody, display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap');
        .material-symbols-outlined {
          font-family: 'Material Symbols Outlined';
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          font-size: 20px; line-height: 1; display: inline-block; vertical-align: middle;
        }
        .mat-fill { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .nav-link:hover { background: rgba(255,255,255,0.05); color: #86efac; }
        .chip-btn:hover { background: #313630 !important; }
        .send-btn:hover { filter: brightness(1.1); }
        .messages-area::-webkit-scrollbar { width: 4px; }
        .messages-area::-webkit-scrollbar-track { background: transparent; }
        .messages-area::-webkit-scrollbar-thumb { background: rgba(65,73,62,0.4); border-radius: 4px; }
        @keyframes blink { 0%,80%,100%{opacity:0.3} 40%{opacity:1} }
      `}</style>

      {/* Ambient glows */}
      <div style={{ position: "fixed", top: "25%", right: "25%", width: "384px", height: "384px", background: "rgba(136,217,130,0.04)", borderRadius: "50%", filter: "blur(120px)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "25%", left: "33%", width: "500px", height: "500px", background: "rgba(254,179,0,0.03)", borderRadius: "50%", filter: "blur(150px)", pointerEvents: "none", zIndex: 0 }} />

      {/* ── Sidebar ── */}
      <aside style={{
        position: "fixed", left: 0, top: 0, height: "100vh", width: "256px",
        background: "rgba(12,10,9,0.85)", backdropFilter: "blur(20px)",
        display: "flex", flexDirection: "column",
        paddingTop: "24px", paddingBottom: "24px",
        boxShadow: "32px 0 32px -4px rgba(0,0,0,0.45)", zIndex: 50,
      }}>
        <div style={{ padding: "0 24px", marginBottom: "40px" }}>
          <div style={{ fontSize: "20px", fontWeight: "700", color: "#4ade80", fontFamily: fontHeadline, letterSpacing: "-0.02em" }}>NurseryPulse</div>
          <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.2em", color: C.stone500, marginTop: "2px" }}>Smart Observatory</div>
        </div>
        <nav style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {NAV_ITEMS.map(({ icon, label, page }) => {
            const active = page === "chatbot";
            return (
              <a key={label} href="#" className={active ? "" : "nav-link"}
                onClick={(e) => { e.preventDefault(); onNavigate && onNavigate(page); }}
                style={{
                  display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px",
                  color: active ? "#4ade80" : C.stone400,
                  borderLeft: active ? "4px solid #22c55e" : "4px solid transparent",
                  background: active ? "rgba(34,197,94,0.1)" : "transparent",
                  textDecoration: "none", fontSize: "14px", fontWeight: "500",
                  transition: "all 0.2s", transform: active ? "translateX(2px)" : "none",
                }}>
                <span className="material-symbols-outlined">{icon}</span>
                {label}
              </a>
            );
          })}
        </nav>
        {/* User card — same as Dashboard.jsx */}
        <div style={{ padding: "0 24px", marginTop: "auto", marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "12px", background: "rgba(255,255,255,0.05)" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: C.primaryContainer, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
              <span className="material-symbols-outlined" style={{ color: C.primary, fontSize: "18px" }}>person</span>
            </div>
            <div style={{ overflow: "hidden" }}>
              <p style={{ fontSize: "12px", fontWeight: "700", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Executive Admin</p>
              
            </div>
          </div>
        </div>
      </aside>

      {/* ── Top Header — same as Dashboard.jsx ── */}
      <header style={{
        position: "fixed", top: 0, right: 0, width: "calc(100% - 256px)", height: "64px",
        background: "rgba(12,10,9,0.5)", backdropFilter: "blur(12px)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0 32px", zIndex: 40, borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div style={{ flex: 1 }} />
        <div style={{ width: "320px", position: "relative", marginRight: "16px" }}>
          <span className="material-symbols-outlined" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: C.stone400, fontSize: "16px" }}>search</span>
          <input placeholder="Search nursery data..." style={{
            width: "100%", background: "rgba(38,43,38,0.9)", border: "1px solid rgba(136,217,130,0.2)",
            borderRadius: "9999px", padding: "9px 16px 9px 38px", fontSize: "13px",
            color: C.onSurface, outline: "none", fontFamily: fontBody, boxSizing: "border-box",
          }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {["notifications", "settings"].map((icon) => (
            <button key={icon} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", borderRadius: "50%", color: C.stone400, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="material-symbols-outlined">{icon}</span>
            </button>
          ))}
          <div style={{ width: "1px", height: "16px", background: C.stone800 }} />
          <span style={{ fontSize: "12px", fontWeight: "500", fontFamily: fontHeadline, color: C.stone300 }}>NurseryPulse Monitor</span>
        </div>
      </header>

      {/* ── Chat Area ── */}
      <main style={{
        marginLeft: "256px",
        width: "calc(100% - 256px)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        zIndex: 1,
      }}>
        {/* Scrollable messages */}
        <div
          className="messages-area"
          style={{
            flex: 1,
            paddingTop: "96px",
            paddingBottom: "220px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "32px",
            maxWidth: "860px",
            margin: "0 auto",
            width: "100%",
            padding: "96px 32px 220px",
            boxSizing: "border-box",
          }}
        >
          {messages.map((msg, idx) => {
            if (msg.role === "bot") {
              return (
                <div key={idx} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <BotAvatar />
                  <div style={{ maxWidth: "720px" }}>
                    {msg.welcome && <WelcomeMessage />}
                    {msg.summary && <SummaryMessage />}
                    {msg.content && (
                      <div style={{ ...glassPanel, padding: "20px 24px", borderRadius: "16px", borderTopLeftRadius: "4px" }}>
                        <p style={{ fontSize: "14px", color: C.onSurfaceVariant, lineHeight: "1.7", margin: 0, whiteSpace: "pre-wrap" }}>{msg.content}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            }
            return (
              <div key={idx} style={{ display: "flex", gap: "16px", alignItems: "flex-start", flexDirection: "row-reverse" }}>
                <UserAvatar />
                <div style={{ maxWidth: "600px" }}>
                  <div style={{
                    background: "rgba(6,95,24,0.3)", border: "1px solid rgba(136,217,130,0.2)",
                    padding: "16px 20px", borderRadius: "16px", borderTopRightRadius: "4px",
                  }}>
                    <p style={{ fontSize: "14px", color: C.onSurface, margin: 0, lineHeight: "1.6" }}>{msg.content}</p>
                  </div>
                  {msg.time && (
                    <p style={{ fontSize: "10px", color: C.stone500, marginTop: "6px", textAlign: "right", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                      {msg.time}
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          {/* Loading dots */}
          {loading && (
            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <BotAvatar />
              <div style={{ ...glassPanel, padding: "16px 20px", borderRadius: "16px", borderTopLeftRadius: "4px" }}>
                <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <span key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.primary, display: "inline-block", animation: `blink 1.2s infinite ${delay}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* ── Fixed Bottom Input ── */}
        <div style={{
          position: "fixed", bottom: 0, right: 0,
          width: "calc(100% - 256px)",
          padding: "24px 32px 32px",
          background: `linear-gradient(to top, ${C.bg} 60%, transparent)`,
          zIndex: 10,
        }}>
          <div style={{ maxWidth: "860px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Suggestion chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
              {CHIPS.map(({ icon, label }) => (
                <button
                  key={label}
                  className="chip-btn"
                  onClick={() => sendMessage(label)}
                  style={{
                    background: C.surfaceHigh, color: C.onSurfaceVariant,
                    border: "1px solid rgba(65,73,62,0.1)", padding: "8px 16px",
                    borderRadius: "9999px", fontSize: "12px", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: "6px",
                    fontFamily: fontBody, transition: "background 0.15s",
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>{icon}</span>
                  {label}
                </button>
              ))}
            </div>

            {/* Input bar */}
            <div style={{
              ...glassPanel, borderRadius: "16px",
              padding: "8px", display: "flex", alignItems: "center", gap: "8px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }}>
              <button style={{ width: "40px", height: "40px", borderRadius: "10px", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.stone400, flexShrink: 0 }}>
                <span className="material-symbols-outlined">attach_file</span>
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Inquire about your nursery's vitals..."
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none",
                  fontSize: "14px", color: C.onSurface, fontFamily: fontBody, padding: "10px 4px",
                }}
              />
              <button
                className="send-btn"
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                style={{
                  background: loading || !input.trim()
                    ? "rgba(6,95,24,0.3)"
                    : `linear-gradient(135deg, ${C.primary}, ${C.primaryContainer})`,
                  color: loading || !input.trim() ? C.stone400 : "#003909",
                  border: "none", padding: "10px 24px", borderRadius: "10px",
                  fontSize: "14px", fontWeight: "700", cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", gap: "8px",
                  fontFamily: fontBody, transition: "all 0.2s", flexShrink: 0,
                  boxShadow: loading || !input.trim() ? "none" : "0 4px 14px rgba(136,217,130,0.2)",
                }}
              >
                Send
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>send</span>
              </button>
            </div>

            {/* Footer */}
            <p style={{ fontSize: "10px", color: C.stone600, textAlign: "center", margin: 0, textTransform: "uppercase", letterSpacing: "0.15em" }}>
              NurseryPulse AI v4.2 • Secured Bio-Metric Uplink
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
