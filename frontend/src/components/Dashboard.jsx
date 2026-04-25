import React, { useEffect, useState } from "react";

// ── Color tokens ──────────────────────────────────────────────────────────────
const C = {
  bg: "#101510",
  surface: "#1c211b",
  surfaceHigh: "#262b26",
  surfaceHighest: "#313630",
  primary: "#88d982",
  primaryContainer: "#065f18",
  secondaryContainer: "#feb300",
  error: "#ffb4ab",
  errorContainer: "#93000a",
  onSurface: "#dfe4db",
  onSurfaceVariant: "#c0c9bb",
  stone950: "#0a0a0a",
  stone800: "#292524",
  stone500: "#78716c",
  stone400: "#a8a29e",
  stone300: "#d6d3d1",
  stone900: "#1c1917",
};

const fontHeadline = "'Manrope', sans-serif";
const fontBody = "'Inter', sans-serif";
const fontMono = "'IBM Plex Mono', monospace";

// ── Helpers ───────────────────────────────────────────────────────────────────
function moistureColor(pct) {
  if (pct < 30) return C.error;
  if (pct < 50) return C.secondaryContainer;
  return C.primary;
}
function moistureLabel(pct) {
  if (pct < 30) return "Low";
  if (pct < 50) return "Warning";
  return "Optimum";
}
const statusMap = {
  "Under Review": { bg: "rgba(147,0,10,0.3)", color: C.error },
  Stable:         { bg: "rgba(6,95,24,0.3)",  color: C.primary },
  Monitoring:     { bg: "rgba(254,179,0,0.1)", color: C.secondaryContainer },
};

// ── Nav items ─────────────────────────────────────────────────────────────────
const NAV = [
  { icon: "dashboard",         label: "Dashboard", page: "dashboard" },
  { icon: "potted_plant",         label: "Health",     page: "health"    },
  { icon: "notifications_active",label: "Alerts",     page: "alerts"    },
  { icon: "trending_up",          label: "Trends",     page: "trends"    },
  { icon: "smart_toy",           label: "AI Chatbot",page: "chatbot"   },
];

// ── Demo fallback ─────────────────────────────────────────────────────────────
const DEMO = {
  summary: {
    daily_advice:
      'Your nursery is <span style="color:#88d982">92% Healthy</span>. Dhaka sector has low soil moisture; <span style="text-decoration:underline;text-decoration-color:#feb300;text-underline-offset:4px">consider irrigation</span>.',
    overall_health_pct: 92,
    health_trend: "+2.4% vs last week",
    season_yield: "1,420",
    active_risks: 4,
    risk_description:
      "anomaly_flag = 1 detected in sensor net #A-02, #B-19, #D-01, #D-04",
  },
  season_yield_by_crop: [
    { label: "Rice",   value: "420T" },
    { label: "Wheat",  value: "380T" },
    { label: "Tomato", value: "120T" },
    { label: "Jute",   value: "310T" },
    { label: "Potato", value: "190T" },
  ],
  crop_distribution: [
    { label: "Rice Sector",   total: "Total 4,200 units", healthy: 85, stressed: 10, critical: 5  },
    { label: "Wheat Sector",  total: "Total 3,100 units", healthy: 90, stressed: 7,  critical: 3  },
    { label: "Tomato Sector", total: "Total 1,800 units", healthy: 60, stressed: 25, critical: 15 },
  ],
  table_rows: [
    { sector_id: "DHAKA-N1", primary_crop: "Rice / BRRI dhan28", soil_moisture: 22, ph_balance: 6.4, temperature: 28.4, status: "Under Review" },
    { sector_id: "DHAKA-S2", primary_crop: "Potato / Cardinal",  soil_moisture: 68, ph_balance: 5.8, temperature: 21.1, status: "Stable"        },
    { sector_id: "MYM-N1",   primary_crop: "Jute / O-9897",      soil_moisture: 45, ph_balance: 7.1, temperature: 31.5, status: "Monitoring"   },
  ],
};

// ── Sub-components ────────────────────────────────────────────────────────────

function Icon({ name, filled = false, style = {} }) {
  return (
    <span
      className="material-symbols-outlined"
      style={{
        fontVariationSettings: filled
          ? "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24"
          : "'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24",
        ...style,
      }}
    >
      {name}
    </span>
  );
}

function Sidebar({ activePage, onNavigate }) {
  return (
    <aside
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        height: "100vh",
        width: 256,
        background: "rgba(12,10,9,0.88)",
        backdropFilter: "blur(20px)",
        display: "flex",
        flexDirection: "column",
        paddingTop: 24,
        paddingBottom: 24,
        boxShadow: "32px 0 32px -4px rgba(0,0,0,0.45)",
        zIndex: 50,
      }}
    >
      <div style={{ padding: "0 24px", marginBottom: 40 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#4ade80", fontFamily: fontHeadline, letterSpacing: "-0.02em" }}>
          NurseryPulse
        </div>
        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em", color: C.stone500, marginTop: 2 }}>
          Smart Observatory
        </div>
      </div>

      <nav style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {NAV.map(({ icon, label, page }) => {
          const active = activePage === page;
          return (
            <a
              key={page}
              href="#"
              onClick={(e) => { e.preventDefault(); onNavigate && onNavigate(page); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                color: active ? "#4ade80" : C.stone400,
                borderLeft: active ? "4px solid #22c55e" : "4px solid transparent",
                background: active ? "rgba(34,197,94,0.1)" : "transparent",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 500,
                transition: "all 0.2s",
                transform: active ? "translateX(2px)" : "none",
              }}
            >
              <Icon name={icon} />
              {label}
            </a>
          );
        })}
      </nav>

      <div style={{ padding: "0 24px", marginTop: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 12, background: "rgba(255,255,255,0.05)" }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.primaryContainer, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="person" style={{ color: C.primary, fontSize: 18 }} />
          </div>
          <p style={{ fontSize: 12, fontWeight: 700, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            Executive Admin
          </p>
        </div>
      </div>
    </aside>
  );
}

function TopHeader() {
  return (
    <header style={{ position: "fixed", top: 0, right: 0, width: "calc(100% - 256px)", height: 64, background: "rgba(12,10,9,0.5)", backdropFilter: "blur(12px)", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 32px", zIndex: 40, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ flex: 1 }} />
      <div style={{ width: 320, position: "relative", marginRight: 16 }}>
        <Icon name="search" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.stone400, fontSize: 16 }} />
        <input placeholder="Search nursery sectors..." style={{ width: "100%", background: "rgba(38,43,38,0.9)", border: "1px solid rgba(136,217,130,0.2)", borderRadius: 9999, padding: "9px 16px 9px 38px", fontSize: 13, color: C.onSurface, outline: "none", fontFamily: fontBody, boxSizing: "border-box" }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {["notifications", "settings"].map((icon) => (
          <button key={icon} style={{ background: "none", border: "none", cursor: "pointer", padding: 8, borderRadius: "50%", color: C.stone400, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name={icon} /></button>
        ))}
        <div style={{ width: 1, height: 16, background: C.stone800 }} />
        <span style={{ fontSize: 12, fontWeight: 500, fontFamily: fontHeadline, color: C.stone300 }}>NurseryPulse Monitor</span>
      </div>
    </header>
  );
}

function Card({ children, style = {} }) {
  return <div style={{ background: C.surfaceHigh, borderRadius: 12, padding: 24, ...style }}>{children}</div>;
}

// function AdviceCard({ text }) {
//   return (
//     <div style={{ gridColumn: "span 8", background: "rgba(49,54,48,0.7)", backdropFilter: "blur(12px)", border: "1px solid rgba(65,73,62,0.2)", borderRadius: 12, padding: 24, position: "relative", overflow: "hidden" }}>
//       <div style={{ position: "absolute", top: 0, right: 0, padding: 32, opacity: 0.1, pointerEvents: "none" }}><Icon name="psychology" filled style={{ fontSize: 96, color: C.primary }} /></div>
//       <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//           <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: C.primary, flexShrink: 0, animation: "pulse 2s cubic-bezier(.4,0,.6,1) infinite" }} />
//           <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, color: C.primary }}>Daily Advice</span>
//         </div>
//         <p dangerouslySetInnerHTML={{ __html: text }} style={{ fontSize: 22, fontWeight: 700, fontFamily: fontHeadline, lineHeight: 1.4, margin: 0, maxWidth: 600 }} />
//         <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
//           <button style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primaryContainer})`, color: "#003909", border: "none", padding: "8px 20px", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontFamily: fontBody }}><Icon name="water_drop" filled style={{ fontSize: 16 }} /> Trigger Dhaka Irrigation</button>
//           <button style={{ background: "rgba(49,54,48,0.5)", color: C.onSurface, border: "none", padding: "8px 20px", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: fontBody }}>Dismiss</button>
//         </div>
//       </div>
//     </div>
//   );
// }

function AdviceCard({ text }) {
  // Local state to handle dismissal
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleTriggerIrrigation = async () => {
    try {
      // Example API call to your backend
      // await fetch("http://127.0.0.1:8000/api/irrigation/trigger", { method: "POST" });
      alert("Irrigation system triggered for Dhaka Sector.");
    } catch (error) {
      console.error("Failed to trigger irrigation:", error);
    }
  };

  return (
    <div
      style={{
        gridColumn: "span 8",
        background: "rgba(49,54,48,0.7)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(65,73,62,0.2)",
        borderRadius: 12,
        padding: 24,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background icon */}
      <div style={{ position: "absolute", top: 0, right: 0, padding: 32, opacity: 0.1, pointerEvents: "none" }}>
        <Icon name="psychology" filled style={{ fontSize: 96, color: C.primary }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: C.primary, flexShrink: 0, animation: "pulse 2s cubic-bezier(.4,0,.6,1) infinite" }} />
          <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, color: C.primary }}>
            Daily Advice
          </span>
        </div>

        <p dangerouslySetInnerHTML={{ __html: text }} style={{ fontSize: 22, fontWeight: 700, fontFamily: fontHeadline, lineHeight: 1.4, margin: 0, maxWidth: 600 }} />

        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          {/* Action Button */}
          <button
            onClick={handleTriggerIrrigation}
            style={{
              background: `linear-gradient(135deg, ${C.primary}, ${C.primaryContainer})`,
              color: "#003909",
              border: "none",
              padding: "8px 20px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: fontBody,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <Icon name="water_drop" filled style={{ fontSize: 16 }} />
            Trigger Dhaka Irrigation
          </button>

          {/* Dismiss Button */}
          <button
            onClick={() => setIsVisible(false)}
            style={{
              background: "rgba(49,54,48,0.5)",
              color: C.onSurface,
              border: "none",
              padding: "8px 20px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: fontBody,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(49,54,48,0.8)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(49,54,48,0.5)")}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

function HealthCard({ pct, trend }) {
  return (
    <Card style={{ gridColumn: "span 4", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <p style={{ fontSize: 14, color: C.onSurfaceVariant, margin: 0 }}>Overall Health</p>
        <Icon name="health_and_safety" style={{ color: C.primary }} />
      </div>
      <div style={{ marginTop: 16 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
          <span style={{ fontSize: 48, fontWeight: 900, fontFamily: fontHeadline, lineHeight: 1 }}>{pct}%</span>
          <span style={{ fontSize: 12, color: C.primary, fontWeight: 700, marginBottom: 6 }}>{trend || "+2.4% vs last week"}</span>
        </div>
        <div style={{ width: "100%", height: 8, background: C.stone800, borderRadius: 9999, marginTop: 16, overflow: "hidden", display: "flex" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: C.primary }} />
          <div style={{ width: `${100 - pct}%`, height: "100%", background: C.error }} />
        </div>
      </div>
    </Card>
  );
}

function YieldCard({ total, items }) {
  return (
    <Card style={{ gridColumn: "span 4" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <p style={{ fontSize: 14, color: C.onSurfaceVariant, margin: 0 }}>Season Yield</p>
          <p style={{ fontSize: 22, fontWeight: 700, fontFamily: fontHeadline, margin: "4px 0 0" }}>Est. {total} Tons</p>
        </div>
        <Icon name="inventory_2" style={{ color: C.secondaryContainer }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map(({ label, value }) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: C.stone400 }}>{label}</span>
            <div style={{ flex: 1, margin: "0 12px", height: 1, background: C.stone800 }} />
            <span style={{ fontSize: 12, fontFamily: fontMono, fontWeight: 700 }}>{value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function RisksCard({ count, description }) {
  return (
    <Card style={{ gridColumn: "span 3", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <p style={{ fontSize: 14, color: C.onSurfaceVariant, margin: 0 }}>Active Risks</p>
        <Icon name="warning" filled style={{ color: C.error }} />
      </div>
      
      <div style={{ marginTop: 16 }}>
        <div style={{ 
          fontSize: 56, 
          fontWeight: 900, 
          fontFamily: fontHeadline, 
          color: C.error, 
          lineHeight: 1 
        }}>
          {String(count).padStart(2, "0")}
        </div>
        {/* Description text - only shows if provided */}
        {description && (
          <p style={{ fontSize: 11, color: C.stone500, marginTop: 8, lineHeight: 1.5 }}>
            {description}
          </p>
        )}
      </div>

      {/* This is the missing footer section */}
      <div style={{ 
        marginTop: 16, 
        paddingTop: 16, 
        borderTop: "1px solid rgba(255,255,255,0.05)" 
      }}>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: C.error,
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          View Anomaly Log
          <Icon name="arrow_forward" style={{ fontSize: 14 }} />
        </a>
      </div>
    </Card>
  );
}

function CropDistCard({ items }) {
  return (
    <Card style={{ gridColumn: "span 5" }}>
      <h3 style={{ fontSize: 18, fontWeight: 700, fontFamily: fontHeadline, marginBottom: 32 }}>Crop Health Distribution</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {items.map(({ label, total, healthy, stressed, critical }) => (
          <div key={label}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 10, textTransform: "uppercase", fontWeight: 700 }}>{label}</span>
              <span style={{ fontSize: 10, color: C.stone500 }}>{total}</span>
            </div>
            <div style={{ width: "100%", height: 12, background: C.stone800, borderRadius: 9999, overflow: "hidden", display: "flex" }}>
              <div style={{ width: `${healthy}%`, background: C.primary }} />
              <div style={{ width: `${stressed}%`, background: C.secondaryContainer }} />
              <div style={{ width: `${critical}%`, background: C.error }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Sector Performance Matrix ─────────────────────────────────────────────────
function SectorTable({ rows }) {
  const handleExport = () => {
    if (!rows || rows.length === 0) return;

    // 1. Prepare Headers
    const headers = ["Sector ID", "Primary Crop", "Moisture %", "pH Balance", "Temp (C)", "Status"];
    
    // 2. Map Rows to CSV strings (handling potential commas with quotes)
    const csvContent = [
      headers.join(","), 
      ...rows.map(r => [
        r.sector_id,
        `"${r.primary_crop}"`,
        r.soil_moisture,
        r.ph_balance,
        r.temperature,
        r.status
      ].join(","))
    ].join("\n");

    // 3. Create Blob and Trigger Download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Nursery_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card style={{ gridColumn: "span 12" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, fontFamily: fontHeadline, margin: 0 }}>
          Sector Performance Matrix
        </h3>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={handleExport}
            style={{
              background: C.surfaceHighest,
              border: "1px solid rgba(255,255,255,0.05)",
              color: C.onSurface,
              padding: "6px 12px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: fontBody,
            }}
          >
            Export CSV
          </button>
          <button style={{ background: C.surfaceHighest, border: "1px solid rgba(255,255,255,0.05)", color: C.onSurface, padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: fontBody }}>
            Last 24h
          </button>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              {["Sector ID", "Primary Crop", "Moisture Level", "pH Balance", "Avg Temp", "Status"].map((h) => (
                <th key={h} style={{ paddingBottom: 16, fontSize: 10, textTransform: "uppercase", fontWeight: 700, color: C.stone500, letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const mc = moistureColor(row.soil_moisture);
              const ml = moistureLabel(row.soil_moisture);
              const st = statusMap[row.status] || { bg: "rgba(49,54,48,0.5)", color: C.onSurfaceVariant };
              return (
                <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "16px 0", fontSize: 14, fontWeight: 700, fontFamily: fontHeadline }}>{row.sector_id}</td>
                  <td style={{ padding: "16px 0", fontSize: 14, color: C.stone300 }}>{row.primary_crop}</td>
                  <td style={{ padding: "16px 0", fontSize: 14, fontFamily: fontMono, color: mc }}>{row.soil_moisture}% <span style={{ fontSize: 10, opacity: 0.6 }}>({ml})</span></td>
                  <td style={{ padding: "16px 0", fontSize: 14, color: C.stone300, fontFamily: fontMono }}>{row.ph_balance}</td>
                  <td style={{ padding: "16px 0", fontSize: 14, color: C.stone300, fontFamily: fontMono }}>{row.temperature}°C</td>
                  <td style={{ padding: "16px 0" }}>
                    <span style={{ padding: "4px 8px", background: st.bg, color: st.color, fontSize: 10, fontWeight: 700, borderRadius: 4, textTransform: "uppercase" }}>{row.status}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard({ onNavigate }) {
  const [data, setData] = useState(null);
  const [activePage, setActivePage] = useState("dashboard");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/data/dashboard")
      .then((res) => res.json())
      .then(setData)
      .catch(() => setData(DEMO));
  }, []);

  const handleNav = (page) => {
    setActivePage(page);
    onNavigate && onNavigate(page);
  };

  const { summary, season_yield_by_crop, crop_distribution, table_rows } = data || {};

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.onSurface, fontFamily: fontBody, display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&display=swap');
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; font-size: 20px; line-height: 1; display: inline-block; vertical-align: middle; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        * { box-sizing: border-box; }
      `}</style>

      <Sidebar activePage={activePage} onNavigate={handleNav} />
      <TopHeader />

      <main style={{ marginLeft: 256, padding: "96px 32px 48px", width: "calc(100% - 256px)", minHeight: "100vh" }}>
        {!data ? (
          <div style={{ color: C.primary, fontSize: 16, padding: "40px 0" }}>Loading dashboard data…</div>
        ) : (
          <>
            <section style={{ marginBottom: 32 }}>
              <h1 style={{ fontSize: 30, fontWeight: 800, fontFamily: fontHeadline, margin: 0 }}>Executive Overview</h1>
              <p style={{ fontSize: 14, color: C.onSurfaceVariant, margin: "4px 0 0" }}>System Status: <span style={{ color: C.primary, fontWeight: 600 }}>Nominal</span> • Last Update: 2m ago</p>
            </section>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 24 }}>
              <AdviceCard text={summary.daily_advice} />
              <HealthCard pct={summary.overall_health_pct} trend={summary.health_trend} />
              <YieldCard total={summary.season_yield} items={season_yield_by_crop} />
              <RisksCard count={summary.active_risks} description={summary.risk_description} />
              <CropDistCard items={crop_distribution} />
              <SectorTable rows={table_rows} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}