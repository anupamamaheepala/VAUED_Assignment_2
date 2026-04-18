import React, { useState } from "react";

// ── Color tokens ──────────────────────────────────────────────────────────────
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
  errorContainer: "#93000a",
  onSurface: "#dfe4db",
  onSurfaceVariant: "#c0c9bb",
  stone500: "#78716c",
  stone400: "#a8a29e",
  stone300: "#d6d3d1",
  stone800: "#292524",
};

const fontHeadline = "'Manrope', sans-serif";
const fontBody = "'Inter', sans-serif";

const glassPanel = {
  background: "rgba(49,54,48,0.7)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(65,73,62,0.15)",
};

// ── Alert data ────────────────────────────────────────────────────────────────
const ALERTS = [
  {
    date: "Oct 24, 09:42 AM",
    ago: "Just now",
    location: "Dhaka South-A1",
    crop: "Arabica Coffee",
    issue: "Anomaly Detected: High pH",
    issueColor: "#ffb4ab",
    issueDot: "#ffb4ab",
    severity: "URGENT",
    severityBg: "#93000a",
    severityColor: "#ffdad6",
  },
  {
    date: "Oct 24, 08:15 AM",
    ago: "1.5h ago",
    location: "Rajshahi North-B",
    crop: "Hydroponic Lettuce",
    issue: "Irrigation Required",
    issueColor: "#ffd799",
    issueDot: "#ffd799",
    severity: "MODERATE",
    severityBg: "#feb300",
    severityColor: "#281900",
  },
  {
    date: "Oct 24, 07:30 AM",
    ago: "2h ago",
    location: "Dhaka Central-HUD",
    crop: "Sansevieria",
    issue: "Anomaly Detected: Temp Spike",
    issueColor: "#ffb4ab",
    issueDot: "#ffb4ab",
    severity: "URGENT",
    severityBg: "#93000a",
    severityColor: "#ffdad6",
  },
  {
    date: "Oct 23, 11:55 PM",
    ago: "9h ago",
    location: "Sylhet East-04",
    crop: "Orchids",
    issue: "Irrigation Required",
    issueColor: "#ffd799",
    issueDot: "#ffd799",
    severity: "MODERATE",
    severityBg: "#feb300",
    severityColor: "#281900",
  },
];

const NAV_ITEMS = [
  { icon: "dashboard",           label: "Dashboard", page: "dashboard" },
  { icon: "potted_plant",        label: "Health",    page: "health"    },
  { icon: "notifications_active",label: "Alerts",    page: "alerts"    },
  { icon: "trending_up",         label: "Trends",    page: "trends"    },
  { icon: "smart_toy",           label: "AI Chatbot",page: "chatbot"   },
];

// ── Heatmap canvas visual ─────────────────────────────────────────────────────
function HeatMap() {
  return (
    <div
      style={{
        position: "relative",
        borderRadius: "8px",
        overflow: "hidden",
        background: C.surfaceHighest,
        aspectRatio: "21/9",
      }}
    >
      {/* Gradient blobs simulating heat */}
      <div style={{ position: "absolute", inset: 0 }}>
        <svg width="100%" height="100%" style={{ display: "block" }}>
          <defs>
            <radialGradient id="blob1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#88d982" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#88d982" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="blob2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#feb300" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#feb300" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="blob3" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffb4ab" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#ffb4ab" stopOpacity="0" />
            </radialGradient>
            {/* Topographic contour effect */}
            <filter id="blur">
              <feGaussianBlur stdDeviation="18" />
            </filter>
          </defs>
          {/* Dark base topo */}
          <rect width="100%" height="100%" fill="#0d120d" />
          {/* Blobs */}
          <ellipse cx="72%" cy="30%" rx="22%" ry="35%" fill="url(#blob1)" filter="url(#blur)" />
          <ellipse cx="85%" cy="60%" rx="18%" ry="28%" fill="url(#blob2)" filter="url(#blur)" />
          <ellipse cx="20%" cy="70%" rx="16%" ry="22%" fill="url(#blob3)" filter="url(#blur)" />
          {/* Subtle topo lines */}
          <ellipse cx="72%" cy="30%" rx="14%" ry="20%" fill="none" stroke="#88d982" strokeWidth="0.4" opacity="0.3" />
          <ellipse cx="72%" cy="30%" rx="20%" ry="30%" fill="none" stroke="#88d982" strokeWidth="0.3" opacity="0.15" />
          <ellipse cx="85%" cy="60%" rx="12%" ry="18%" fill="none" stroke="#feb300" strokeWidth="0.4" opacity="0.3" />
          <ellipse cx="20%" cy="70%" rx="10%" ry="15%" fill="none" stroke="#ffb4ab" strokeWidth="0.4" opacity="0.25" />
          {/* Gradient overlay bottom */}
          <rect width="100%" height="40%" y="60%" fill="url(#fadeBottom)" />
          <defs>
            <linearGradient id="fadeBottom" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d120d" stopOpacity="0" />
              <stop offset="100%" stopColor="#0d120d" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Pulse markers */}
      <div style={{ position: "absolute", top: "25%", left: "33%", width: "10px", height: "10px" }}>
        <span style={{
          display: "block", width: "10px", height: "10px", borderRadius: "50%",
          background: C.error, position: "absolute",
          animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite",
          opacity: 0.75,
        }} />
        <span style={{ display: "block", width: "6px", height: "6px", borderRadius: "50%", background: C.error, position: "absolute", top: "2px", left: "2px" }} />
      </div>
      <div style={{ position: "absolute", bottom: "42%", right: "26%", width: "10px", height: "10px" }}>
        <span style={{
          display: "block", width: "10px", height: "10px", borderRadius: "50%",
          background: C.secondaryContainer, position: "absolute",
          animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite 0.5s",
          opacity: 0.75,
        }} />
        <span style={{ display: "block", width: "6px", height: "6px", borderRadius: "50%", background: C.secondaryContainer, position: "absolute", top: "2px", left: "2px" }} />
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Alerts({ onNavigate }) {
  const [location, setLocation] = useState("All Locations");
  const [cropType, setCropType] = useState("All Crops");

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.onSurface, fontFamily: fontBody, display: "flex" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&display=swap');
        .material-symbols-outlined {
          font-family: 'Material Symbols Outlined';
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          font-size: 20px;
          line-height: 1;
          display: inline-block;
          vertical-align: middle;
        }
        .mat-fill { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .nav-link:hover { background: rgba(255,255,255,0.05); color: #86efac; }
        .alert-row:hover { background: rgba(255,255,255,0.02); }
        .resolve-btn:hover { background: #88d982 !important; color: #003909 !important; }
        .pulse { animation: pulse 2s cubic-bezier(0.4,0,0.6,1) infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        select { appearance: none; -webkit-appearance: none; }
        select option { background: #1c211b; color: #dfe4db; }
      `}</style>

      {/* ── Sidebar ── */}
      <aside style={{
        position: "fixed", left: 0, top: 0, height: "100vh", width: "256px",
        background: "rgba(12,10,9,0.85)", backdropFilter: "blur(20px)",
        display: "flex", flexDirection: "column",
        paddingTop: "24px", paddingBottom: "24px",
        boxShadow: "32px 0 32px -4px rgba(0,0,0,0.45)", zIndex: 50,
      }}>
        {/* Logo */}
        <div style={{ padding: "0 24px", marginBottom: "40px" }}>
          <div style={{ fontSize: "20px", fontWeight: "700", color: "#4ade80", fontFamily: fontHeadline, letterSpacing: "-0.02em" }}>
            NurseryPulse
          </div>
          <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.2em", color: C.stone500, marginTop: "2px" }}>
            Smart Observatory
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {NAV_ITEMS.map(({ icon, label, page }) => {
            const active = page === "alerts";
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

        {/* User card — same as Dashboard.jsx */}
        <div style={{ padding: "0 24px", marginTop: "auto", marginBottom: "32px" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "12px",
            padding: "12px", borderRadius: "12px", background: "rgba(255,255,255,0.05)",
          }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%",
              background: C.primaryContainer, display: "flex",
              alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden",
            }}>
              <span className="material-symbols-outlined" style={{ color: C.primary, fontSize: "18px" }}>person</span>
            </div>
            <div style={{ overflow: "hidden" }}>
              <p style={{ fontSize: "12px", fontWeight: "700", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                Executive Admin
              </p>
              
            </div>
          </div>
        </div>
      </aside>

      {/* ── Top Header — same as Dashboard.jsx ── */}
      <header style={{
        position: "fixed", top: 0, right: 0,
        width: "calc(100% - 256px)", height: "64px",
        background: "rgba(12,10,9,0.5)", backdropFilter: "blur(12px)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0 32px", zIndex: 40,
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div style={{ flex: 1 }} />
        {/* Search */}
        <div style={{ width: "320px", position: "relative", marginRight: "16px" }}>
          <span className="material-symbols-outlined" style={{
            position: "absolute", left: "12px", top: "50%",
            transform: "translateY(-50%)", color: C.stone400, fontSize: "16px",
          }}>search</span>
          <input
            placeholder="Search alerts or locations..."
            style={{
              width: "100%", background: "rgba(38,43,38,0.9)",
              border: "1px solid rgba(136,217,130,0.2)",
              borderRadius: "9999px", padding: "9px 16px 9px 38px",
              fontSize: "13px", color: C.onSurface, outline: "none",
              fontFamily: fontBody, boxSizing: "border-box",
            }}
          />
        </div>
        {/* Icons */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {["notifications", "settings"].map((icon) => (
            <button key={icon} style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "8px", borderRadius: "50%", color: C.stone400,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span className="material-symbols-outlined">{icon}</span>
            </button>
          ))}
          <div style={{ width: "1px", height: "16px", background: C.stone800 }} />
          <span style={{ fontSize: "12px", fontWeight: "500", fontFamily: fontHeadline, color: C.stone300 }}>
            NurseryPulse Monitor
          </span>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main style={{
        marginLeft: "256px",
        padding: "96px 32px 48px 32px",
        minHeight: "100vh",
        width: "calc(100% - 256px)",
        boxSizing: "border-box",
      }}>

        {/* ── Page Header + Stats ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
          <div>
            <h1 style={{ fontSize: "30px", fontWeight: "800", fontFamily: fontHeadline, margin: 0, letterSpacing: "-0.02em" }}>
              Resolution Hub
            </h1>
            <p style={{ fontSize: "14px", color: C.onSurfaceVariant, margin: "6px 0 0" }}>
              Manage critical anomalies and irrigation requirements across all sectors.
            </p>
          </div>

          {/* KPI badges */}
          <div style={{ display: "flex", gap: "16px" }}>
            {/* Critical Alerts */}
            <div style={{ ...glassPanel, padding: "12px 24px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ padding: "8px", background: "rgba(147,0,10,0.3)", borderRadius: "8px", display: "flex" }}>
                <span className="material-symbols-outlined mat-fill" style={{ color: C.error }}>warning</span>
              </div>
              <div>
                <p style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", color: C.stone500, margin: 0, letterSpacing: "0.08em" }}>
                  Critical Alerts
                </p>
                <p style={{ fontSize: "22px", fontWeight: "700", fontFamily: fontHeadline, margin: "2px 0 0" }}>14</p>
              </div>
            </div>
            {/* Irrigation Req */}
            <div style={{ ...glassPanel, padding: "12px 24px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ padding: "8px", background: "rgba(254,179,0,0.15)", borderRadius: "8px", display: "flex" }}>
                <span className="material-symbols-outlined" style={{ color: C.secondary }}>water_drop</span>
              </div>
              <div>
                <p style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", color: C.stone500, margin: 0, letterSpacing: "0.08em" }}>
                  Irrigation Req.
                </p>
                <p style={{ fontSize: "22px", fontWeight: "700", fontFamily: fontHeadline, margin: "2px 0 0" }}>08</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Filters Bar ── */}
        <div style={{
          display: "flex", flexWrap: "wrap", alignItems: "center",
          justifyContent: "space-between", gap: "16px",
          padding: "16px 20px", borderRadius: "12px",
          background: C.surfaceLow, marginBottom: "24px",
        }}>
          <div style={{ display: "flex", gap: "24px" }}>
            {/* Location filter */}
            <div>
              <label style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", color: C.stone500, letterSpacing: "0.08em", display: "block", marginBottom: "4px", paddingLeft: "4px" }}>
                Location
              </label>
              <div style={{ position: "relative" }}>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{
                    background: C.surfaceHighest, border: "1px solid rgba(65,73,62,0.3)",
                    borderRadius: "8px", padding: "7px 36px 7px 12px",
                    fontSize: "14px", color: C.onSurface,
                    cursor: "pointer", fontFamily: fontBody, outline: "none",
                  }}
                >
                  {["All Locations","Dhaka","Rajshahi","Sylhet","Chittagong"].map(o => <option key={o}>{o}</option>)}
                </select>
                <span className="material-symbols-outlined" style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", color: C.stone400, pointerEvents: "none" }}>expand_more</span>
              </div>
            </div>
            {/* Crop type filter */}
            <div>
              <label style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", color: C.stone500, letterSpacing: "0.08em", display: "block", marginBottom: "4px", paddingLeft: "4px" }}>
                Crop Type
              </label>
              <div style={{ position: "relative" }}>
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  style={{
                    background: C.surfaceHighest, border: "1px solid rgba(65,73,62,0.3)",
                    borderRadius: "8px", padding: "7px 36px 7px 12px",
                    fontSize: "14px", color: C.onSurface,
                    cursor: "pointer", fontFamily: fontBody, outline: "none",
                  }}
                >
                  {["All Crops","Arabica Coffee","Hydroponic Lettuce","Sansevieria","Orchids"].map(o => <option key={o}>{o}</option>)}
                </select>
                <span className="material-symbols-outlined" style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", color: C.stone400, pointerEvents: "none" }}>expand_more</span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "8px 16px", background: C.surfaceHighest,
              color: C.onSurface, border: "none", borderRadius: "8px",
              fontSize: "13px", fontWeight: "500", cursor: "pointer", fontFamily: fontBody,
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>filter_list</span>
              Advanced Filters
            </button>
            <button style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "8px 16px",
              background: C.primary, color: "#003909",
              border: "none", borderRadius: "8px",
              fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: fontBody,
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>download</span>
              Export Report
            </button>
          </div>
        </div>

        {/* ── Alert Feed Table ── */}
        <div style={{ ...glassPanel, borderRadius: "12px", overflow: "hidden", marginBottom: "24px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "rgba(49,54,48,0.5)" }}>
                {["Timestamp","Location","Crop Type","Issue","Severity","Actions"].map((h, i) => (
                  <th key={h} style={{
                    padding: "14px 24px",
                    fontSize: "10px", fontWeight: "800",
                    textTransform: "uppercase", letterSpacing: "0.12em",
                    color: C.stone400,
                    textAlign: i === 5 ? "right" : "left",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ALERTS.map((row, idx) => (
                <tr
                  key={idx}
                  className="alert-row"
                  style={{
                    borderTop: "1px solid rgba(65,73,62,0.1)",
                    transition: "background 0.15s",
                  }}
                >
                  {/* Timestamp */}
                  <td style={{ padding: "20px 24px", whiteSpace: "nowrap" }}>
                    <div style={{ fontSize: "14px", fontWeight: "600" }}>{row.date}</div>
                    <div style={{ fontSize: "10px", color: C.stone500, fontWeight: "500", marginTop: "2px" }}>{row.ago}</div>
                  </td>
                  {/* Location */}
                  <td style={{ padding: "20px 24px", whiteSpace: "nowrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "16px", color: C.stone500 }}>location_on</span>
                      <span style={{ fontSize: "14px", fontWeight: "500" }}>{row.location}</span>
                    </div>
                  </td>
                  {/* Crop */}
                  <td style={{ padding: "20px 24px", whiteSpace: "nowrap" }}>
                    <span style={{
                      padding: "4px 12px", borderRadius: "9999px",
                      background: C.surface, fontSize: "11px", fontWeight: "700",
                      border: "1px solid rgba(65,73,62,0.2)", color: C.onSurfaceVariant,
                    }}>{row.crop}</span>
                  </td>
                  {/* Issue */}
                  <td style={{ padding: "20px 24px", whiteSpace: "nowrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: row.issueDot, flexShrink: 0, display: "inline-block" }} />
                      <span style={{ fontSize: "14px", fontWeight: "700", color: row.issueColor }}>{row.issue}</span>
                    </div>
                  </td>
                  {/* Severity */}
                  <td style={{ padding: "20px 24px", whiteSpace: "nowrap" }}>
                    <span style={{
                      fontSize: "10px", fontWeight: "800",
                      padding: "3px 8px", borderRadius: "4px",
                      background: row.severityBg, color: row.severityColor,
                      letterSpacing: "0.04em",
                    }}>{row.severity}</span>
                  </td>
                  {/* Actions */}
                  <td style={{ padding: "20px 24px", whiteSpace: "nowrap", textAlign: "right" }}>
                    <button
                      className="resolve-btn"
                      style={{
                        padding: "6px 16px",
                        background: "rgba(136,217,130,0.1)",
                        border: "1px solid rgba(136,217,130,0.2)",
                        color: C.primary, fontSize: "12px", fontWeight: "700",
                        borderRadius: "8px", cursor: "pointer",
                        fontFamily: fontBody, transition: "all 0.15s",
                      }}
                    >
                      Mark as Resolved
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination footer */}
          <div style={{
            padding: "12px 24px",
            background: C.surfaceLow,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <p style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", color: C.stone500, margin: 0, letterSpacing: "0.08em" }}>
              Showing 4 of 22 active alerts
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              {["chevron_left","chevron_right"].map((icon) => (
                <button key={icon} style={{
                  padding: "4px", background: C.surface,
                  border: "none", borderRadius: "4px",
                  color: C.onSurface, cursor: "pointer", display: "flex",
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>{icon}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bento Bottom: Heatmap + Resolution Flow ── */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>

          {/* Anomaly Distribution */}
          <div style={{ ...glassPanel, padding: "24px", borderRadius: "12px", overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: "700", fontFamily: fontHeadline, margin: 0 }}>
                  Anomaly Distribution
                </h3>
                <p style={{ fontSize: "12px", color: C.onSurfaceVariant, margin: "4px 0 0" }}>
                  Real-time geographical density of issues
                </p>
              </div>
              <button style={{ background: "none", border: "none", color: C.primary, fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: fontBody }}>
                Full Map view
              </button>
            </div>
            <HeatMap />
          </div>

          {/* Resolution Flow */}
          <div style={{ ...glassPanel, padding: "24px", borderRadius: "12px", display: "flex", flexDirection: "column" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "700", fontFamily: fontHeadline, margin: "0 0 24px" }}>
              Resolution Flow
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "24px", flex: 1 }}>
              {/* Item 1 */}
              <div style={{ display: "flex", gap: "16px", position: "relative" }}>
                <div style={{ position: "absolute", left: "11px", top: "28px", width: "1px", height: "40px", background: "rgba(65,73,62,0.3)" }} />
                <div style={{
                  width: "24px", height: "24px", borderRadius: "50%",
                  background: "rgba(136,217,130,0.2)", display: "flex",
                  alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <span className="material-symbols-outlined mat-fill" style={{ fontSize: "14px", color: C.primary }}>check_circle</span>
                </div>
                <div>
                  <p style={{ fontSize: "12px", fontWeight: "700", margin: 0 }}>Dhaka Sector 4 Fixed</p>
                  <p style={{ fontSize: "10px", color: C.stone500, margin: "2px 0 0" }}>Irrigation valve recalibrated by Automata-2</p>
                  <p style={{ fontSize: "10px", color: C.primary, fontWeight: "700", margin: "4px 0 0" }}>12 min ago</p>
                </div>
              </div>

              {/* Item 2 */}
              <div style={{ display: "flex", gap: "16px", position: "relative" }}>
                <div style={{ position: "absolute", left: "11px", top: "28px", width: "1px", height: "40px", background: "rgba(65,73,62,0.3)" }} />
                <div style={{
                  width: "24px", height: "24px", borderRadius: "50%",
                  background: "rgba(136,217,130,0.2)", display: "flex",
                  alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <span className="material-symbols-outlined mat-fill" style={{ fontSize: "14px", color: C.primary }}>check_circle</span>
                </div>
                <div>
                  <p style={{ fontSize: "12px", fontWeight: "700", margin: 0 }}>Rajshahi Ph Anomaly Resolved</p>
                  <p style={{ fontSize: "10px", color: C.stone500, margin: "2px 0 0" }}>Manual soil treatment confirmed by Field Staff</p>
                  <p style={{ fontSize: "10px", color: C.primary, fontWeight: "700", margin: "4px 0 0" }}>45 min ago</p>
                </div>
              </div>

              {/* Item 3 — history */}
              <div style={{ display: "flex", gap: "16px" }}>
                <div style={{
                  width: "24px", height: "24px", borderRadius: "50%",
                  background: C.stone800, display: "flex",
                  alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "14px", color: C.stone500 }}>history</span>
                </div>
                <div>
                  <p style={{ fontSize: "12px", fontWeight: "700", color: C.stone400, margin: 0 }}>View Resolution History</p>
                  <p style={{ fontSize: "10px", color: "#57534e", margin: "2px 0 0" }}>Total 142 resolutions this week</p>
                </div>
              </div>
            </div>

            {/* Download button */}
            <button style={{
              width: "100%", marginTop: "24px",
              padding: "10px", background: C.surfaceHighest,
              color: C.onSurface, border: "1px solid rgba(65,73,62,0.1)",
              borderRadius: "8px", fontSize: "12px", fontWeight: "700",
              cursor: "pointer", fontFamily: fontBody,
            }}>
              Download Weekly Log
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
