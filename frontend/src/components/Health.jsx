import React, { useEffect, useState } from "react";

const C = {
  bg: "#101510",
  surface: "#1c211b",
  surfaceHigh: "#262b26",
  surfaceHighest: "#313630",
  surfaceLow: "#181d17",
  primary: "#88d982",
  primaryContainer: "#065f18",
  secondaryContainer: "#feb300",
  secondary: "#ffd799",
  error: "#ffb4ab",
  onSurface: "#dfe4db",
  onSurfaceVariant: "#c0c9bb",
  stone950: "#0a0a0a",
  stone800: "#292524",
  stone500: "#78716c",
  stone400: "#a8a29e",
  stone300: "#d6d3d1",
};

const fontHeadline = "'Manrope', sans-serif";
const fontBody = "'Inter', sans-serif";
const fontMono = "'IBM Plex Mono', monospace";

const glassPanel = {
  background: "rgba(49,54,48,0.7)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(65,73,62,0.2)",
};

// ── Demo fallback data ─────────────────────────────────────────────────────────
const DEMO = {
  gauges: {
    soil_moisture: 65,
    soil_ph: 6.8,
    light_intensity: 840,
  },
  crops: [
    { name: "Rice",   status: "Stable",   risk: "Low",    sync: "14:20 PM", icon: "grass",     iconColor: "#88d982" },
    { name: "Wheat",  status: "Warning",  risk: "Medium", sync: "14:15 PM", icon: "grain",     iconColor: "#ffd799" },
    { name: "Tomato", status: "Critical", risk: "Medium", sync: "13:58 PM", icon: "nutrition", iconColor: "#ffb4ab" },
    { name: "Jute",   status: "Stable",   risk: "Low",    sync: "14:02 PM", icon: "spa",       iconColor: "#88d982" },
    { name: "Potato", status: "Stable",   risk: "Low",    sync: "13:45 PM", icon: "egg",       iconColor: "#88d982" },
  ],
  ai_diagnosis: "Detecting nutrient leaching in Section B (Tomato crops). Moisture levels exceed optimal range by 12%.",
  confidence_score: 94,
  network: {
    soil_sensors: { active: 12, total: 12 },
    light_nodes:  { active: 8,  total: 8  },
  },
};

// ── Helpers ────────────────────────────────────────────────────────────────────
function statusStyle(status) {
  if (status === "Critical") return { color: C.error,            glow: "rgba(255,180,171,0.6)" };
  if (status === "Warning")  return { color: C.secondaryContainer, glow: "rgba(254,179,0,0.6)"   };
  return                            { color: C.primary,          glow: "rgba(136,217,130,0.6)"  };
}
function riskStyle(risk) {
  if (risk === "High")   return { bg: "rgba(255,180,171,0.1)", color: C.error            };
  if (risk === "Medium") return { bg: "rgba(254,179,0,0.1)",   color: C.secondaryContainer };
  return                        { bg: "rgba(136,217,130,0.1)", color: C.primary          };
}
function cropIcon(name) {
  const map = { Rice: "grass", Wheat: "grain", Tomato: "nutrition", Jute: "spa", Potato: "egg" };
  return map[name] || "eco";
}
function cropIconColor(name) {
  const map = { Rice: C.primary, Wheat: C.secondary, Tomato: C.error, Jute: C.primary, Potato: C.primary };
  return map[name] || C.primary;
}

// ── Circular Gauge ─────────────────────────────────────────────────────────────
function Gauge({ value, max: maxProp, label, sublabel, color, footnote, footnoteColor }) {
  // For Light Intensity the max must always be >= value so the arc never overflows
  const max = label === "LIGHT INTENSITY" ? Math.max(maxProp, value * 1.25) : maxProp;
  const r = 40;
  const circ = 2 * Math.PI * r;
  const dash = Math.min(value / max, 1) * circ;

  const iconName =
    label === "SOIL MOISTURE" ? "water_drop"
    : label === "SOIL PH BALANCE" ? "science"
    : "wb_sunny";

  return (
    <div
      style={{
        ...glassPanel,
        borderRadius: "12px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        flex: 1,
      }}
    >
      {/* Corner icon */}
      <div style={{ position: "absolute", top: 0, right: 0, padding: "16px", opacity: 0.2, pointerEvents: "none" }}>
        <span className="material-symbols-outlined" style={{ fontSize: "36px", color: C.onSurfaceVariant }}>
          {iconName}
        </span>
      </div>

      <p
        style={{
          fontSize: "10px",
          fontWeight: "700",
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          color: C.onSurfaceVariant,
          marginBottom: "24px",
          fontFamily: fontBody,
          margin: "0 0 24px",
        }}
      >
        {label}
      </p>

      {/* SVG ring */}
      <div style={{ position: "relative", width: "192px", height: "192px" }}>
        <svg
          viewBox="0 0 100 100"
          style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}
        >
          <defs>
            <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#88d982" />
              <stop offset="100%" stopColor="#065f18" />
            </linearGradient>
            <linearGradient id="secondaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#feb300" />
              <stop offset="100%" stopColor="#6a4800" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r={r} fill="transparent" stroke={C.surfaceHighest} strokeWidth="8" />
          <circle
            cx="50" cy="50" r={r}
            fill="transparent"
            stroke={`url(#${color === "primary" ? "primaryGrad" : "secondaryGrad"})`}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
          />
        </svg>

        {/* Center text */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: String(value).length > 5 ? "22px" : "38px", fontWeight: "800", fontFamily: fontHeadline, lineHeight: 1 }}>
            {value}
            {label === "SOIL MOISTURE" && <span style={{ fontSize: "18px" }}>%</span>}
          </span>
          <span
            style={{
              fontSize: "10px",
              fontWeight: "700",
              textTransform: "uppercase",
              color: color === "primary" ? C.primary : C.secondaryContainer,
              marginTop: "4px",
              letterSpacing: "0.08em",
            }}
          >
            {sublabel}
          </span>
          {label === "LIGHT INTENSITY" && (
            <span style={{ fontSize: "9px", color: C.onSurfaceVariant, marginTop: "2px", textTransform: "uppercase" }}>
              μmol/m²/s
            </span>
          )}
        </div>
      </div>

      {/* Footnote */}
      <div style={{ marginTop: "24px", fontSize: "10px", color: C.onSurfaceVariant, display: "flex", alignItems: "center", gap: "4px" }}>
        {footnoteColor && (
          <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: footnoteColor, opacity: 0.5, flexShrink: 0 }} />
        )}
        {footnote}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Health({ onNavigate }) {
  const [healthData, setHealthData] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/data/health")
      .then((res) => res.json())
      .then((raw) => {
        // Normalise: inject icon + iconColor if API doesn't return them
        const normalised = {
          ...raw,
          crops: (raw.crops || []).map((c) => ({
            icon:      c.icon      || cropIcon(c.name),
            iconColor: c.iconColor || cropIconColor(c.name),
            ...c,
          })),
          confidence_score: raw.confidence_score ?? 94,
          network: raw.network ?? DEMO.network,
        };
        setHealthData(normalised);
      })
      .catch(() => setHealthData(DEMO));
  }, []);

  const navItems = [
    { icon: "dashboard",            label: "Dashboard", page: "dashboard" },
    { icon: "potted_plant",         label: "Health",    page: "health"    },
    { icon: "notifications_active", label: "Alerts",    page: "alerts"    },
    { icon: "trending_up",          label: "Trends",    page: "trends"    },
    { icon: "smart_toy",            label: "AI Chatbot",page: "chatbot"   },
  ];

  const crops   = healthData?.crops   ?? [];
  const gauges  = healthData?.gauges  ?? {};
  const network = healthData?.network ?? DEMO.network;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        color: C.onSurface,
        fontFamily: fontBody,
        display: "flex",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&display=swap');
        .material-symbols-outlined {
          font-family: 'Material Symbols Outlined';
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          font-size: 20px; line-height: 1;
          display: inline-block; vertical-align: middle;
        }
        .mat-fill { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .nav-link:hover { background: rgba(255,255,255,0.05); color: #86efac; }
        .crop-row:hover { background: rgba(255,255,255,0.04); }
        .pulse { animation: pulse 2s cubic-bezier(0.4,0,0.6,1) infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        * { box-sizing: border-box; }
      `}</style>

      {/* ── Sidebar ── */}
      <aside
        style={{
          position: "fixed", left: 0, top: 0,
          height: "100vh", width: "256px",
          background: "rgba(12,10,9,0.85)",
          backdropFilter: "blur(20px)",
          display: "flex", flexDirection: "column",
          paddingTop: "24px", paddingBottom: "24px",
          boxShadow: "32px 0 32px -4px rgba(0,0,0,0.45)",
          zIndex: 50,
        }}
      >
        <div style={{ padding: "0 24px", marginBottom: "40px" }}>
          <div style={{ fontSize: "20px", fontWeight: "700", color: "#4ade80", fontFamily: fontHeadline, letterSpacing: "-0.02em" }}>
            NurseryPulse
          </div>
          <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.2em", color: C.stone500, marginTop: "2px" }}>
            Smart Observatory
          </div>
        </div>

        <nav style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {navItems.map(({ icon, label, page }) => {
            const active = page === "health";
            return (
              <a
                key={label}
                href="#"
                className={active ? "" : "nav-link"}
                onClick={(e) => { e.preventDefault(); onNavigate && onNavigate(page); }}
                style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "12px 16px",
                  color: active ? "#4ade80" : C.stone400,
                  borderLeft: active ? "4px solid #22c55e" : "4px solid transparent",
                  background: active ? "rgba(34,197,94,0.1)" : "transparent",
                  textDecoration: "none", fontSize: "14px", fontWeight: "500",
                  transition: "all 0.2s",
                  transform: active ? "translateX(2px)" : "none",
                }}
              >
                <span className="material-symbols-outlined">{icon}</span>
                {label}
              </a>
            );
          })}
        </nav>

        <div style={{ padding: "0 24px", marginTop: "auto", marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "12px", background: "rgba(255,255,255,0.05)" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: C.primaryContainer, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span className="material-symbols-outlined" style={{ color: C.primary, fontSize: "18px" }}>person</span>
            </div>
            <p style={{ fontSize: "12px", fontWeight: "700", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Executive Admin
            </p>
          </div>
        </div>
      </aside>

      {/* ── Top Header ── */}
      <header
        style={{
          position: "fixed", top: 0, right: 0,
          width: "calc(100% - 256px)", height: "64px",
          background: "rgba(12,10,9,0.5)", backdropFilter: "blur(12px)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "0 32px", zIndex: 40,
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div style={{ flex: 1 }} />
        <div style={{ width: "320px", position: "relative", marginRight: "16px" }}>
          <span className="material-symbols-outlined" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: C.stone400, fontSize: "16px" }}>search</span>
          <input
            placeholder="Search biological data..."
            style={{ width: "100%", background: "rgba(38,43,38,0.9)", border: "1px solid rgba(136,217,130,0.2)", borderRadius: "9999px", padding: "9px 16px 9px 38px", fontSize: "13px", color: C.onSurface, outline: "none", fontFamily: fontBody }}
          />
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

      {/* ── Main Content ── */}
      <main
        style={{
          marginLeft: "256px",
          padding: "96px 32px 48px 32px",
          minHeight: "100vh",
          width: "calc(100% - 256px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient glows */}
        <div style={{ position: "absolute", top: "-10%", right: "-5%", width: "600px", height: "600px", background: "rgba(136,217,130,0.06)", borderRadius: "50%", filter: "blur(120px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-10%", left: "-5%", width: "400px", height: "400px", background: "rgba(255,180,171,0.03)", borderRadius: "50%", filter: "blur(100px)", pointerEvents: "none" }} />

        {/* Loading state */}
        {!healthData ? (
          <div style={{ color: C.primary, fontSize: "16px", padding: "40px 0" }}>Loading health data…</div>
        ) : (
          <>
            {/* Page header */}
            <section style={{ marginBottom: "32px", position: "relative" }}>
              <h1 style={{ fontSize: "36px", fontWeight: "800", fontFamily: fontHeadline, margin: 0, letterSpacing: "-0.02em" }}>
                Health Observatory
              </h1>
              <p style={{ fontSize: "14px", color: C.onSurfaceVariant, margin: "8px 0 0", maxWidth: "600px", lineHeight: "1.6" }}>
                Real-time biological monitoring and environmental synthesis. Analyze crop vitality through distributed sensor arrays.
              </p>
            </section>

            {/* ── Gauge Row ── */}
            <section style={{ display: "flex", gap: "24px", marginBottom: "32px" }}>
              <Gauge
                label="SOIL MOISTURE"
                value={gauges.soil_moisture ?? 65}
                max={100}
                sublabel="Optimal"
                color="primary"
                footnote="Range: 60-85%"
                footnoteColor={C.primary}
              />
              <Gauge
                label="SOIL PH BALANCE"
                value={gauges.soil_ph ?? 6.8}
                max={14}
                sublabel="Balanced"
                color="secondary"
                footnote="Target: 6.0 - 7.0"
                footnoteColor={C.secondaryContainer}
              />
              <Gauge
                label="LIGHT INTENSITY"
                value={gauges.light_intensity ?? 840}
                max={1200}
                sublabel=""
                color="primary"
                footnote="Duration: 12.4h Photoperiod"
                footnoteColor={null}
              />
            </section>

            {/* ── Bottom Grid: Table + Right Sidebar ── */}
            <section style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px" }}>

              {/* Crop Status Matrix */}
              <div style={{ ...glassPanel, borderRadius: "12px", overflow: "hidden" }}>
                {/* Header */}
                <div style={{ padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "700", fontFamily: fontHeadline, margin: 0 }}>Crop Status Matrix</h3>
                  <span style={{ fontSize: "10px", fontWeight: "700", padding: "4px 10px", borderRadius: "6px", background: "rgba(136,217,130,0.1)", color: C.primary, letterSpacing: "0.05em" }}>
                    {crops.length} ACTIVE BATCHES
                  </span>
                </div>

                {/* Table */}
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ background: C.surfaceLow }}>
                      {["Crop Type", "Vitality Status", "Pest Risk", "Next Sync", "Actions"].map((h, i) => (
                        <th
                          key={h}
                          style={{ padding: "12px 32px", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.12em", color: C.onSurfaceVariant, textAlign: i === 4 ? "right" : "left" }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {crops.map((crop, idx) => {
                      const ss = statusStyle(crop.status);
                      const rs = riskStyle(crop.risk);
                      return (
                        <tr
                          key={crop.name + idx}
                          className="crop-row"
                          style={{ borderTop: idx > 0 ? "1px solid rgba(255,255,255,0.05)" : "none", transition: "background 0.15s" }}
                        >
                          {/* Crop name */}
                          <td style={{ padding: "20px 32px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                              <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: C.surfaceHighest, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <span className="material-symbols-outlined" style={{ fontSize: "16px", color: crop.iconColor || cropIconColor(crop.name) }}>
                                  {crop.icon || cropIcon(crop.name)}
                                </span>
                              </div>
                              <span style={{ fontSize: "14px", fontWeight: "700" }}>{crop.name}</span>
                            </div>
                          </td>
                          {/* Status */}
                          <td style={{ padding: "20px 32px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: ss.color, boxShadow: `0 0 8px ${ss.glow}`, flexShrink: 0 }} />
                              <span style={{ fontSize: "12px" }}>{crop.status}</span>
                            </div>
                          </td>
                          {/* Risk */}
                          <td style={{ padding: "20px 32px" }}>
                            <span style={{ fontSize: "11px", fontWeight: "500", padding: "3px 10px", borderRadius: "9999px", background: rs.bg, color: rs.color }}>
                              {crop.risk}
                            </span>
                          </td>
                          {/* Sync */}
                          <td style={{ padding: "20px 32px", fontSize: "12px", color: C.onSurfaceVariant }}>
                            {crop.sync}
                          </td>
                          {/* Actions */}
                          <td style={{ padding: "20px 32px", textAlign: "right" }}>
                            <button style={{ background: "none", border: "none", cursor: "pointer", color: C.primary, padding: "6px", borderRadius: "6px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>more_vert</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Right Sidebar */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                {/* AI Diagnosis */}
                <div style={{ ...glassPanel, borderRadius: "12px", padding: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                    <span className="material-symbols-outlined mat-fill" style={{ color: C.primary }}>auto_awesome</span>
                    <h3 style={{ fontSize: "18px", fontWeight: "700", fontFamily: fontHeadline, margin: 0 }}>AI Diagnosis</h3>
                  </div>
                  <p style={{ fontSize: "14px", color: C.onSurfaceVariant, lineHeight: "1.65", margin: 0 }}>
                    {/* Highlight "nutrient leaching" if present in the text */}
                    {healthData.ai_diagnosis?.split(/(nutrient leaching)/i).map((part, i) =>
                      /nutrient leaching/i.test(part)
                        ? <strong key={i} style={{ color: C.secondaryContainer }}>{part}</strong>
                        : part
                    )}
                  </p>

                  <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", flexDirection: "column", gap: "12px" }}>
                    {/* Confidence score */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: C.surfaceLow, padding: "12px", borderRadius: "8px", border: "1px solid rgba(65,73,62,0.15)" }}>
                      <span style={{ fontSize: "12px", fontWeight: "500" }}>Confidence Score</span>
                      <span style={{ fontSize: "12px", fontWeight: "700", color: C.primary }}>
                        {healthData.confidence_score ?? 94}%
                      </span>
                    </div>
                    {/* CTA */}
                    <button
                      style={{ width: "100%", padding: "12px", borderRadius: "12px", background: `linear-gradient(135deg, ${C.primary}, ${C.primaryContainer})`, color: "#003909", border: "none", fontSize: "14px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontFamily: fontBody, boxShadow: "0 4px 20px rgba(136,217,130,0.2)" }}
                    >
                      <span className="material-symbols-outlined mat-fill" style={{ fontSize: "16px" }}>water_ph</span>
                      Adjust Irrigation
                    </button>
                  </div>
                </div>

                {/* Network Health */}
                <div style={{ ...glassPanel, borderRadius: "12px", padding: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <span style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.15em", color: C.onSurfaceVariant }}>
                      Network Health
                    </span>
                    <span style={{ fontSize: "10px", fontWeight: "700", color: C.primary, display: "flex", alignItems: "center", gap: "4px" }}>
                      <span className="pulse" style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: C.primary }} />
                      Live
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {[
                      { label: "Soil Sensors", active: network.soil_sensors?.active ?? 12, total: network.soil_sensors?.total ?? 12 },
                      { label: "Light Nodes",  active: network.light_nodes?.active  ?? 8,  total: network.light_nodes?.total  ?? 8  },
                    ].map(({ label, active, total }) => (
                      <div key={label}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                          <span style={{ fontSize: "12px", color: C.onSurfaceVariant }}>{label}</span>
                          <span style={{ fontSize: "12px", fontWeight: "700" }}>{active} / {total}</span>
                        </div>
                        <div style={{ width: "100%", height: "4px", background: C.surfaceHighest, borderRadius: "9999px", overflow: "hidden" }}>
                          <div style={{ width: `${(active / total) * 100}%`, height: "100%", background: C.primary }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
