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
  stone500: "#78716c",
  stone400: "#a8a29e",
  stone300: "#d6d3d1",
  stone800: "#292524",
};

const fontHeadline = "'Manrope', sans-serif";
const fontBody = "'Inter', sans-serif";

const glassPanel = {
  background: "rgba(24,29,23,0.7)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(65,73,62,0.15)",
};

const NAV_ITEMS = [
  { icon: "dashboard",            label: "Dashboard", page: "dashboard" },
  { icon: "potted_plant",         label: "Health",    page: "health"    },
  { icon: "notifications_active", label: "Alerts",    page: "alerts"    },
  { icon: "trending_up",          label: "Trends",    page: "trends"    },
  { icon: "smart_toy",            label: "AI Chatbot",page: "chatbot"   },
];

// ── CSV Export ────────────────────────────────────────────────────────────────
// function exportCSV({ BAR_DATA, avgGrowthRate, peakMonth, bestLocation, period, location, cropType }) {
//   const growthStr = `${avgGrowthRate >= 0 ? "+" : ""}${avgGrowthRate}%`;
//   const rows = [
//     ["NurseryPulse — Historical Performance Report"],
//     [`Period: ${period}`, `Location: ${location}`, `Crop: ${cropType}`],
//     [],
//     ["Avg Growth Rate", growthStr],
//     ["Peak Month", peakMonth.month, `${peakMonth.value} yield`],
//     ["Best Location", bestLocation.name, `${bestLocation.efficiency}% efficiency`],
//     [],
//     ["Week", "Fertilizer (%)", "Rainfall (%)"],
//     ...BAR_DATA.map(({ label, fertilizer, rainfall }) => [label, fertilizer, rainfall]),
//   ];
//   const csv  = rows.map((r) => r.join(",")).join("\n");
//   const blob = new Blob([csv], { type: "text/csv" });
//   const url  = URL.createObjectURL(blob);
//   const a    = document.createElement("a");
//   a.href     = url;
//   a.download = `nursery-trends-${Date.now()}.csv`;
//   a.click();
//   URL.revokeObjectURL(url);
// }

// ── PDF Export ────────────────────────────────────────────────────────────────
async function exportPDF({ BAR_DATA, avgGrowthRate, peakMonth, bestLocation, period, location, cropType }) {
  if (!window.jspdf) {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const growthStr = `${avgGrowthRate >= 0 ? "+" : ""}${avgGrowthRate}%`;

  // Dark background
  doc.setFillColor(16, 21, 16);
  doc.rect(0, 0, W, 297, "F");

  // Header band
  doc.setFillColor(12, 20, 12);
  doc.rect(0, 0, W, 36, "F");
  doc.setFillColor(34, 197, 94);
  doc.rect(0, 0, 4, 36, "F");

  // Brand
  doc.setTextColor(74, 222, 128);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("NurseryPulse", 12, 14);
  doc.setTextColor(120, 113, 108);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("SMART OBSERVATORY", 12, 20);

  // Report title right-aligned
  doc.setTextColor(223, 228, 219);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Historical Performance Report", W - 12, 14, { align: "right" });
  doc.setTextColor(120, 113, 108);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Generated ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`,
    W - 12, 20, { align: "right" }
  );

  // Filter pills
  let pillX = 12;
  const pillY = 42;
  [{ icon: "Period", val: period }, { icon: "Location", val: location }, { icon: "Crop", val: cropType }]
    .forEach(({ icon, val }) => {
      const label = `${icon}: ${val}`;
      const textW = doc.getTextWidth(label) + 8;
      doc.setFillColor(38, 43, 38);
      doc.roundedRect(pillX, pillY - 4, textW, 7, 2, 2, "F");
      doc.setTextColor(192, 201, 187);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.text(label, pillX + 4, pillY + 0.5);
      pillX += textW + 5;
    });

  // KPI cards
  const cardY = 58;
  const cards = [
    { title: "AVG GROWTH RATE", value: growthStr,         sub: "Above industry avg",                  accent: [136, 217, 130] },
    { title: "PEAK MONTH",      value: peakMonth.month,   sub: `${peakMonth.value} yield`,             accent: [254, 179, 0]   },
    { title: "BEST LOCATION",   value: bestLocation.name, sub: `${bestLocation.efficiency}% efficiency`, accent: [136, 217, 130] },
  ];
  const cardW = (W - 28) / 3;
  cards.forEach(({ title, value, sub, accent }, i) => {
    const cx = 12 + i * (cardW + 4);
    doc.setFillColor(28, 33, 27);
    doc.roundedRect(cx, cardY, cardW, 30, 3, 3, "F");
    doc.setFillColor(...accent);
    doc.rect(cx, cardY, 3, 30, "F");
    doc.setTextColor(120, 113, 108);
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "bold");
    doc.text(title, cx + 7, cardY + 7);
    doc.setTextColor(223, 228, 219);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(value ?? "—", cx + 7, cardY + 19);
    doc.setTextColor(120, 113, 108);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(sub ?? "", cx + 7, cardY + 26);
  });

  // Data table header
  const tableY = 102;
  doc.setTextColor(223, 228, 219);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Resource Efficiency — Weekly Data", 12, tableY);
  doc.setTextColor(120, 113, 108);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("Fertilizer vs Rainfall Impact", 12, tableY + 5);

  const tStartY = tableY + 12;
  const cols = [20, 90, 150];
  doc.setFillColor(38, 43, 38);
  doc.rect(12, tStartY - 5, W - 24, 8, "F");
  ["Week", "Fertilizer Used (%)", "Rainfall Intensity (%)"].forEach((h, i) => {
    doc.setTextColor(136, 217, 130);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.text(h, cols[i], tStartY);
  });

  doc.setFont("helvetica", "normal");
  BAR_DATA.forEach(({ label, fertilizer, rainfall }, idx) => {
    const rowY = tStartY + 8 + idx * 8;
    if (idx % 2 === 0) {
      doc.setFillColor(24, 29, 23);
      doc.rect(12, rowY - 5, W - 24, 8, "F");
    }
    doc.setTextColor(223, 228, 219);
    doc.setFontSize(8);
    doc.text(label,            cols[0], rowY);
    doc.text(`${fertilizer}%`, cols[1], rowY);
    doc.text(`${rainfall}%`,   cols[2], rowY);
  });

  // Bar chart
  const barSectionY = tStartY + 10 + BAR_DATA.length * 8 + 8;
  doc.setTextColor(223, 228, 219);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Visual: Fertilizer vs Rainfall", 12, barSectionY);

  const chartLeft   = 20;
  const chartBottom = barSectionY + 48;
  const chartHeight = 36;
  const barGroupW   = BAR_DATA.length > 0 ? Math.min(16, (W - 30) / BAR_DATA.length) : 16;

  BAR_DATA.forEach(({ label, fertilizer, rainfall }, i) => {
    const gx = chartLeft + i * (barGroupW + 4);
    const fH = (fertilizer / 100) * chartHeight;
    doc.setFillColor(20, 60, 28);
    doc.rect(gx, chartBottom - fH, barGroupW * 0.45, fH, "F");
    const rH = (rainfall / 100) * chartHeight;
    doc.setFillColor(136, 217, 130);
    doc.rect(gx + barGroupW * 0.5, chartBottom - rH, barGroupW * 0.45, rH, "F");
    doc.setTextColor(120, 113, 108);
    doc.setFontSize(5.5);
    doc.setFont("helvetica", "normal");
    doc.text(label, gx + barGroupW * 0.25, chartBottom + 4, { align: "center" });
  });

  // Legend
  doc.setFillColor(20, 60, 28);
  doc.rect(chartLeft, chartBottom + 10, 5, 3, "F");
  doc.setTextColor(192, 201, 187);
  doc.setFontSize(6.5);
  doc.text("Fertilizer Used", chartLeft + 7, chartBottom + 13);
  doc.setFillColor(136, 217, 130);
  doc.rect(chartLeft + 38, chartBottom + 10, 5, 3, "F");
  doc.text("Rainfall Intensity", chartLeft + 45, chartBottom + 13);

  // Footer
  doc.setFillColor(12, 20, 12);
  doc.rect(0, 285, W, 12, "F");
  doc.setTextColor(78, 71, 68);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.text("NurseryPulse Smart Observatory  •  Confidential", 12, 292);
  doc.text("Page 1 of 1", W - 12, 292, { align: "right" });

  doc.save(`nursery-trends-${Date.now()}.pdf`);
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Trends({ onNavigate }) {
  const [period,     setPeriod]     = useState("Last 12 Months");
  const [location,   setLocation]   = useState("All Locations");
  const [cropType,   setCropType]   = useState("All Crop Types");
  const [trendsData, setTrendsData] = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [showSimulation, setShowSimulation] = useState(false);

  // Re-fetch whenever any filter changes
  useEffect(() => {
  setLoading(true);

  const url = `http://127.0.0.1:5000/api/data/trends?location=${encodeURIComponent(location)}&crop=${encodeURIComponent(cropType)}&period=${encodeURIComponent(period)}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      setTrendsData(data);
      setLoading(false);
    })
    .catch((err) => {
      console.error(err);
      setLoading(false);
    });
}, [location, cropType, period]);

  // ── Safe derived values ───────────────────────────────────────────────────
  const BAR_DATA      = Array.isArray(trendsData?.bar_chart) ? trendsData.bar_chart : [];
  const avgGrowthRate = trendsData?.avg_growth_rate ?? 0;
  const peakMonth     = trendsData?.peak_month     ?? { month: "N/A", value: "—" };
  const bestLocation  = trendsData?.best_location  ?? { name: "N/A", efficiency: 0 };
  const growthDisplay = loading ? "—" : `${avgGrowthRate >= 0 ? "+" : ""}${avgGrowthRate}%`;
  const efficiencyPct = typeof bestLocation.efficiency === "string"
    ? bestLocation.efficiency
    : `${bestLocation.efficiency}%`;

  // Simulation: project a −15% rainfall scenario and estimate yield impact per month
  const simulationData = BAR_DATA.map(d => {
    const simRainfall = parseFloat((d.rainfall * 0.85).toFixed(1));
    const rainfallShare = (d.rainfall + d.fertilizer) > 0
      ? d.rainfall / (d.rainfall + d.fertilizer) : 0.5;
    const yieldDrop = parseFloat((d.actual_output * 0.15 * rainfallShare).toFixed(1));
    return { ...d, simRainfall, yieldDrop };
  });
  const totalYield      = BAR_DATA.reduce((s, d) => s + d.actual_output, 0);
  const totalYieldDrop  = simulationData.reduce((s, d) => s + d.yieldDrop, 0);
  const avgYieldDropPct = totalYield > 0 ? ((totalYieldDrop / totalYield) * 100).toFixed(1) : "0.0";
  const mostAffectedMonth = simulationData.length > 0
    ? simulationData.reduce((best, d) => d.yieldDrop > best.yieldDrop ? d : best, simulationData[0])
    : null;

  // Dynamic agronomist insight computed from real BAR_DATA
  const agronomistInsight = (() => {
    if (BAR_DATA.length === 0) return "Monitoring active. Awaiting sufficient data for analysis.";
    const peak = BAR_DATA.reduce((best, d) => {
      const ratio = d.fertilizer > 0 ? d.actual_output / d.fertilizer : 0;
      return ratio > (best?.ratio ?? 0) ? { ...d, ratio } : best;
    }, null);
    if (!peak) return "Fertilizer levels are within optimal range across all monitored sectors.";
    return `${peak.label} recorded peak yield efficiency at ${Number(peak.actual_output).toFixed(0)} t — best output-to-input ratio in the current period.`;
  })();

  const FILTER_CONFIG = [
    {
      value: period,   setter: setPeriod,   icon: "calendar_today",
      options: ["Last 12 Months", "Q1 - 2024", "Q2 - 2024", "Q3 - 2024", "Q4 - 2024"]
    },
    {
      value: location, setter: setLocation, icon: "location_on",
      options: ["All Locations", "Dhaka", "Rajshahi", "Sylhet", "Chattogram", "Khulna"],
    },
    {
      value: cropType, setter: setCropType, icon: "psychology",
      options: ["All Crop Types", "Rice", "Wheat", "Tomato", "Jute", "Potato"],
    },
  ];

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
        .pulse-dot { animation: pulse 2s cubic-bezier(0.4,0,0.6,1) infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        select { appearance: none; -webkit-appearance: none; }
        select option { background: #1c211b; color: #dfe4db; }
        .sim-btn:hover { background: rgba(136,217,130,0.1) !important; }
        .export-btn:hover { opacity: 0.85; }
      `}</style>

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
            const active = page === "trends";
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
        <div style={{ padding: "0 24px", marginTop: "auto", marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "12px", background: "rgba(255,255,255,0.05)" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: C.primaryContainer, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span className="material-symbols-outlined" style={{ color: C.primary, fontSize: "18px" }}>person</span>
            </div>
            <p style={{ fontSize: "12px", fontWeight: "700", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Executive Admin</p>
          </div>
        </div>
      </aside>

      {/* ── Top Header ── */}
      <header style={{
        position: "fixed", top: 0, right: 0, width: "calc(100% - 256px)", height: "64px",
        background: "rgba(12,10,9,0.5)", backdropFilter: "blur(12px)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0 32px", zIndex: 40, borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div style={{ flex: 1 }} />
        <div style={{ width: "320px", position: "relative", marginRight: "16px" }}>
          <span className="material-symbols-outlined" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: C.stone400, fontSize: "16px" }}>search</span>
          <input placeholder="Search sensor data or logs..." style={{
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

      {/* ── Main Content ── */}
      <main style={{ marginLeft: "256px", padding: "96px 32px 48px 32px", minHeight: "100vh", width: "calc(100% - 256px)", boxSizing: "border-box" }}>

        {/* ── Page Header + Filters ── */}
        <section style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "24px", marginBottom: "32px" }}>
          <div>
            <h1 style={{ fontSize: "36px", fontWeight: "800", fontFamily: fontHeadline, margin: 0, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
              Historical<br />Performance
            </h1>
            <p style={{ fontSize: "14px", color: C.onSurfaceVariant, margin: "8px 0 0" }}>
              Deep analytical insights from the last harvest cycle.
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px" }}>
            {FILTER_CONFIG.map(({ value, setter, icon, options }) => (
              <div key={icon} style={{ position: "relative" }}>
                <select
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  disabled={loading}
                  style={{
                    background: C.surfaceHigh, border: "1px solid rgba(65,73,62,0.3)",
                    borderRadius: "8px", padding: "8px 36px 8px 14px",
                    fontSize: "14px", color: loading ? C.stone500 : C.onSurface,
                    cursor: loading ? "not-allowed" : "pointer",
                    fontFamily: fontBody, outline: "none", transition: "color 0.2s",
                  }}
                >
                  {options.map((o) => <option key={o}>{o}</option>)}
                </select>
                <span className="material-symbols-outlined" style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", color: C.stone400, pointerEvents: "none" }}>{icon}</span>
              </div>
            ))}

            {/* Export CSV button */}
            <button
            className="export-btn"
            disabled={loading || BAR_DATA.length === 0}
            onClick={() => exportPDF({ BAR_DATA, avgGrowthRate, peakMonth, bestLocation, period, location, cropType })}
            style={{
              background: loading || BAR_DATA.length === 0 ? C.surfaceHigh : C.primary,
              color: loading || BAR_DATA.length === 0 ? C.stone500 : "#003909",
              border: "none", padding: "8px 18px", borderRadius: "8px",
              fontSize: "14px", fontWeight: "700",
              cursor: loading || BAR_DATA.length === 0 ? "not-allowed" : "pointer",
              fontFamily: fontBody, display: "flex", alignItems: "center", gap: "8px",
              boxShadow: loading ? "none" : "0 4px 14px rgba(136,217,130,0.15)",
              transition: "all 0.2s",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>picture_as_pdf</span>
              Export PDF
            </button>
          </div>
        </section>

        {/* ── Yield Chart + Stats ── */}
        <section style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", marginBottom: "24px" }}>

          {/* Line Chart */}
          <div style={{ ...glassPanel, padding: "32px", borderRadius: "12px", display: "flex", flexDirection: "column", position: "relative" }}>
            {loading && (
              <div style={{
                position: "absolute", inset: 0, borderRadius: "12px",
                background: "rgba(16,21,16,0.55)", backdropFilter: "blur(4px)",
                display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10,
              }}>
                <span style={{ fontSize: "13px", color: C.stone400, fontWeight: "600" }}>Updating chart…</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
              <div>
                <h3 style={{ fontSize: "20px", fontWeight: "700", fontFamily: fontHeadline, margin: 0 }}>Yield Estimate Trends</h3>
                <p style={{ fontSize: "10px", color: C.onSurfaceVariant, margin: "4px 0 0", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                  Projected vs Actual Output (Tonnes)
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: C.primary, display: "inline-block" }} />
                  <span style={{ fontSize: "10px", fontWeight: "700", color: C.onSurfaceVariant }}>ACTUAL</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", opacity: 0.4 }}>
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: C.primaryContainer, display: "inline-block" }} />
                  <span style={{ fontSize: "10px", fontWeight: "700", color: C.onSurfaceVariant }}>FORECAST</span>
                </div>
              </div>
            </div>
            <div style={{ position: "relative", height: "300px", width: "100%" }}>
              <svg width="100%" height="100%" viewBox="0 0 1000 300" preserveAspectRatio="none">
                {BAR_DATA.length > 0 && (() => {
                  const max = Math.max(...BAR_DATA.map(d => d.actual_output || 0), 1);

                  const points = BAR_DATA.map((d, i) => {
                    const x = (i / (BAR_DATA.length - 1 || 1)) * 1000;
                    const y = 300 - ((d.actual_output || 0) / max) * 260;
                    return `${x},${y}`;
                  }).join(" ");

                  return (
                    <>
                      <polyline
                        fill="none"
                        stroke="#88d982"
                        strokeWidth="4"
                        points={points}
                      />
                      {BAR_DATA.map((d, i) => {
                        const x = (i / (BAR_DATA.length - 1 || 1)) * 1000;
                        const y = 300 - ((d.actual_output || 0) / max) * 260;
                        return <circle key={i} cx={x} cy={y} r="5" fill="#88d982" />;
                      })}
                    </>
                  );
                })()}

              </svg>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                {BAR_DATA.map((d) => (
                  <span key={d.label} style={{ fontSize: "10px", fontWeight: "700", color: C.stone500, letterSpacing: "0.05em" }}>{d.label.toUpperCase()}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Avg Growth Rate */}
            <div style={{ ...glassPanel, padding: "24px", borderRadius: "12px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, right: 0, width: "96px", height: "96px", background: "rgba(136,217,130,0.05)", borderRadius: "50%", marginRight: "-40px", marginTop: "-40px", filter: "blur(24px)", pointerEvents: "none" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "inline-flex", padding: "8px", background: "rgba(136,217,130,0.1)", borderRadius: "8px", marginBottom: "14px" }}>
                  <span className="material-symbols-outlined" style={{ color: C.primary }}>speed</span>
                </div>
                <p style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.12em", color: C.stone400, margin: 0 }}>Avg Growth Rate</p>
                <h4 style={{ fontSize: "40px", fontWeight: "800", fontFamily: fontHeadline, margin: "8px 0 0", lineHeight: 1 }}>
                  {growthDisplay}
                </h4>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "14px", color: C.primary }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>trending_up</span>
                  <span style={{ fontSize: "12px", fontWeight: "700" }}>Above industry average</span>
                </div>
              </div>
            </div>

            {/* Peak Performance */}
            <div style={{ ...glassPanel, padding: "24px", borderRadius: "12px", borderLeft: `4px solid ${C.secondaryContainer}` }}>
              <p style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.12em", color: C.stone400, margin: 0 }}>Peak Performance Month</p>
              <h4 style={{ fontSize: "24px", fontWeight: "700", fontFamily: fontHeadline, margin: "8px 0 4px" }}>
                {loading ? "—" : peakMonth.month}
              </h4>
              <p style={{ fontSize: "13px", color: C.stone500, margin: 0 }}>
                {loading ? "" : `${peakMonth.value} yield`}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "20px" }}>
                <div style={{ display: "flex" }}>
                  {["BIO","ENV"].map((tag, i) => (
                    <div key={tag} style={{
                      width: "32px", height: "32px", borderRadius: "50%",
                      background: i === 0 ? C.stone800 : "#374151",
                      border: "2px solid #0a0a0a",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      marginLeft: i > 0 ? "-8px" : 0, fontSize: "8px", fontWeight: "700",
                    }}>{tag}</div>
                  ))}
                </div>
                <span style={{ fontSize: "10px", fontWeight: "700", color: C.stone400 }}>Analyzed by AI</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Resource Efficiency Bar Chart + Secondary Cards ── */}
        <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", paddingBottom: "32px" }}>

          {/* Bar Chart */}
          <div style={{ ...glassPanel, padding: "32px", borderRadius: "12px", position: "relative" }}>
            {loading && (
              <div style={{
                position: "absolute", inset: 0, borderRadius: "12px",
                background: "rgba(16,21,16,0.55)", backdropFilter: "blur(4px)",
                display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10,
              }}>
                <span style={{ fontSize: "13px", color: C.stone400, fontWeight: "600" }}>Updating…</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
              <div>
                <h3 style={{ fontSize: "20px", fontWeight: "700", fontFamily: fontHeadline, margin: 0 }}>Resource Efficiency</h3>
                <p style={{ fontSize: "10px", color: C.onSurfaceVariant, margin: "4px 0 0", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                  Fertilizer vs Rainfall Impact
                </p>
              </div>
              <span style={{ background: C.surfaceHighest, fontSize: "10px", fontWeight: "700", padding: "4px 12px", borderRadius: "9999px", color: C.onSurface }}>WEEKLY VIEWS</span>
            </div>

            {BAR_DATA.length === 0 && !loading ? (
              <div style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ color: C.stone500, fontSize: "14px" }}>No data for selected filters.</p>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: "200px", gap: "8px" }}>
                {BAR_DATA.map(({ label, fertilizer, rainfall }) => (
                  <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", width: "100%", justifyContent: "center", height: "170px" }}>
                      <div style={{ width: "14px", background: "rgba(6,95,24,0.4)", borderRadius: "3px 3px 0 0", height: `${fertilizer}%`, transition: "height 0.5s ease" }} />
                      <div style={{ width: "14px", background: C.primary, borderRadius: "3px 3px 0 0", height: `${rainfall}%`, transition: "height 0.5s ease" }} />
                    </div>
                    <span style={{ fontSize: "9px", fontWeight: "700", color: C.stone500, marginTop: "10px" }}>{label}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: "20px", marginTop: "24px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              {[
                { color: "rgba(6,95,24,0.4)", label: "Fertilizer Used (Kg)" },
                { color: C.primary,           label: "Rainfall Intensity (mm)" },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: color, display: "inline-block" }} />
                  <span style={{ fontSize: "12px", color: C.stone400 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right 2×2 grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

            {/* Best Location */}
            <div style={{ background: C.surfaceHigh, borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.12em", color: C.stone500, margin: "0 0 12px" }}>Location Density</p>
                <h4 style={{ fontSize: "18px", fontWeight: "700", fontFamily: fontHeadline, margin: 0 }}>
                  {loading ? "—" : bestLocation.name}
                </h4>
                <p style={{ fontSize: "13px", color: C.stone400, margin: "4px 0 0", lineHeight: 1.5 }}>Optimal resource utilization achieved last cycle.</p>
              </div>
              <div style={{ marginTop: "20px" }}>
                <div style={{ width: "100%", height: "6px", background: C.stone800, borderRadius: "9999px", overflow: "hidden" }}>
                  <div style={{ width: loading ? "0%" : efficiencyPct, height: "100%", background: C.primary, transition: "width 0.8s ease" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
                  <span style={{ fontSize: "10px", fontWeight: "700", color: C.primary }}>
                    {loading ? "—" : `${efficiencyPct} Efficiency`}
                  </span>
                  <span style={{ fontSize: "10px", fontWeight: "700", color: C.stone500 }}>+4% YoY</span>
                </div>
              </div>
            </div>

            {/* Agronomist note */}
            <div style={{ borderRadius: "12px", overflow: "hidden", position: "relative", minHeight: "200px", background: "#0d1a0d" }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #0d1a0d 0%, #1a2f1a 50%, #0a150a 100%)" }} />
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 65% 25%, rgba(136,217,130,0.18) 0%, transparent 65%)" }} />
              {/* Leaf SVG watermark */}
              <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"
                style={{ position: "absolute", top: "-8px", right: "-8px", width: "155px", height: "155px", opacity: 0.13, pointerEvents: "none" }}>
                <path d="M155 18 C155 18 65 32 40 112 C28 148 52 184 98 184 C144 184 174 148 174 106 C174 62 142 18 155 18Z" fill="#88d982" />
                <line x1="97" y1="184" x2="97" y2="62" stroke="#88d982" strokeWidth="4" strokeLinecap="round" />
                <path d="M97 145 C76 128 52 126 36 120" stroke="#88d982" strokeWidth="3" strokeLinecap="round" />
                <path d="M97 118 C118 102 141 101 158 95" stroke="#88d982" strokeWidth="3" strokeLinecap="round" />
                <path d="M97 92 C78 78 57 76 43 71" stroke="#88d982" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, #0a0a0a 45%, transparent)", height: "78%" }} />
              <div style={{ position: "absolute", bottom: "16px", left: "16px", right: "16px" }}>
                <p style={{ fontSize: "10px", fontWeight: "700", color: C.primary, textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 5px" }}>Agronomist Note</p>
                <h4 style={{ fontSize: "12px", fontWeight: "600", color: "#e8f5e6", margin: 0, lineHeight: 1.5 }}>
                  {loading ? "Analyzing crop data…" : agronomistInsight}
                </h4>
              </div>
            </div>

            {/* Rainfall Deficit Alert */}
            <div style={{
              gridColumn: "span 2", background: C.surfaceHigh, borderRadius: "12px",
              padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ padding: "10px", background: "rgba(254,179,0,0.1)", borderRadius: "8px", display: "flex" }}>
                  <span className="material-symbols-outlined" style={{ color: C.secondaryContainer }}>warning</span>
                </div>
                <div>
                  <h4 style={{ fontSize: "14px", fontWeight: "700", margin: 0 }}>Rainfall Deficit Alert</h4>
                  <p style={{ fontSize: "12px", color: C.stone500, margin: "2px 0 0" }}>Historical data suggests a 15% drop in Q4 rainfall.</p>
                </div>
              </div>
              <button className="sim-btn" onClick={() => setShowSimulation(true)}
                disabled={BAR_DATA.length === 0}
                style={{
                  fontSize: "12px", fontWeight: "700", color: BAR_DATA.length === 0 ? C.stone500 : C.primary,
                  border: `1px solid ${BAR_DATA.length === 0 ? "rgba(120,113,108,0.2)" : "rgba(136,217,130,0.2)"}`,
                  padding: "8px 16px", borderRadius: "8px",
                  cursor: BAR_DATA.length === 0 ? "not-allowed" : "pointer",
                  background: "transparent", fontFamily: fontBody, transition: "all 0.15s", whiteSpace: "nowrap",
                }}>
                View Simulation
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ── Rainfall Simulation Popup ── */}
      {showSimulation && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 200,
            background: "rgba(0,0,0,0.45)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: "16px",
          }}
          onClick={() => setShowSimulation(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: C.surface,
              border: "1px solid rgba(136,217,130,0.15)",
              borderRadius: "14px",
              padding: "20px 22px",
              width: "100%",
              maxWidth: "480px",
              boxShadow: "0 16px 48px rgba(0,0,0,0.55)",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            {/* Header row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="material-symbols-outlined" style={{ color: C.secondaryContainer, fontSize: "18px" }}>water_drop</span>
                <span style={{ fontSize: "14px", fontWeight: "700", fontFamily: fontHeadline, color: C.onSurface }}>
                  Rainfall Deficit Simulation
                </span>
                <span style={{
                  fontSize: "10px", fontWeight: "700", padding: "2px 7px",
                  borderRadius: "9999px", background: "rgba(254,179,0,0.12)",
                  color: C.secondaryContainer, letterSpacing: "0.04em",
                }}>−15%</span>
              </div>
              <button onClick={() => setShowSimulation(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: C.stone500, display: "flex", padding: "2px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>close</span>
              </button>
            </div>

            {/* 3 KPI chips */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
              {[
                { label: "Yield Drop",      value: `-${avgYieldDropPct}%`, accent: C.secondaryContainer },
                { label: "Most Affected",   value: mostAffectedMonth?.label ?? "—", accent: C.error },
                { label: "Recovery",        value: "Moderate",             accent: C.primary },
              ].map(({ label, value, accent }) => (
                <div key={label} style={{
                  background: C.surfaceHigh, borderRadius: "8px", padding: "10px 10px 8px",
                  borderTop: `2px solid ${accent}`,
                }}>
                  <p style={{ fontSize: "9px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: C.stone500, margin: "0 0 4px" }}>{label}</p>
                  <p style={{ fontSize: "16px", fontWeight: "800", fontFamily: fontHeadline, color: accent, margin: 0 }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Mini bar chart: Actual vs Simulated */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "11px", fontWeight: "700", color: C.onSurfaceVariant }}>Actual vs Simulated Rainfall</span>
                <div style={{ display: "flex", gap: "10px" }}>
                  {[{ color: C.primary, label: "Actual" }, { color: C.secondaryContainer, label: "−15%" }].map(({ color, label }) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ width: "8px", height: "8px", borderRadius: "2px", background: color, display: "inline-block" }} />
                      <span style={{ fontSize: "9px", color: C.stone400 }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
              {simulationData.length > 0 && (() => {
                const maxR  = Math.max(...simulationData.map(d => d.rainfall), 1);
                const chartH = 80;
                const chartW = 440;
                const slotW  = chartW / simulationData.length;
                const barW   = Math.min(16, slotW * 0.3);
                return (
                  <svg viewBox={`0 0 ${chartW} ${chartH + 20}`} width="100%" style={{ display: "block" }}>
                    {[0.5, 1].map(f => (
                      <line key={f} x1="0" y1={chartH * (1 - f)} x2={chartW} y2={chartH * (1 - f)}
                        stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                    ))}
                    {simulationData.map((d, i) => {
                      const cx      = slotW * i + slotW / 2;
                      const actualH = (d.rainfall / maxR) * chartH;
                      const simH    = (d.simRainfall / maxR) * chartH;
                      return (
                        <g key={d.label}>
                          <rect x={cx - barW - 1} y={chartH - actualH} width={barW} height={actualH} fill="#88d982" rx="2" opacity="0.85" />
                          <rect x={cx + 1}         y={chartH - simH}    width={barW} height={simH}    fill={C.secondaryContainer} rx="2" opacity="0.75" />
                          <text x={cx} y={chartH + 14} textAnchor="middle" fontSize="9" fill={C.stone500} fontFamily="Inter,sans-serif" fontWeight="700">{d.label}</text>
                        </g>
                      );
                    })}
                    <line x1="0" y1={chartH} x2={chartW} y2={chartH} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
                  </svg>
                );
              })()}
            </div>

            {/* Yield impact rows */}
            <div>
              <span style={{ fontSize: "11px", fontWeight: "700", color: C.onSurfaceVariant, display: "block", marginBottom: "8px" }}>Estimated Yield Impact</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {simulationData.map(d => {
                  const impactPct = d.actual_output > 0 ? (d.yieldDrop / d.actual_output) * 100 : 0;
                  const barColor  = impactPct > 12 ? C.error : C.secondaryContainer;
                  return (
                    <div key={d.label} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ width: "28px", fontSize: "9px", fontWeight: "700", color: C.stone400, flexShrink: 0 }}>{d.label}</span>
                      <div style={{ flex: 1, height: "5px", background: C.stone800, borderRadius: "9999px", overflow: "hidden" }}>
                        <div style={{ width: `${Math.min(impactPct * 5.5, 100)}%`, height: "100%", background: barColor, borderRadius: "9999px" }} />
                      </div>
                      <span style={{ width: "38px", fontSize: "9px", fontWeight: "700", color: barColor, textAlign: "right", flexShrink: 0 }}>−{impactPct.toFixed(1)}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommendation */}
            <div style={{ display: "flex", gap: "8px", padding: "10px 12px", background: "rgba(136,217,130,0.06)", borderRadius: "8px", border: "1px solid rgba(136,217,130,0.1)" }}>
              <span className="material-symbols-outlined" style={{ color: C.primary, fontSize: "16px", flexShrink: 0, marginTop: "1px" }}>eco</span>
              <p style={{ fontSize: "11px", color: C.onSurfaceVariant, margin: 0, lineHeight: 1.6 }}>
                Increase drip irrigation by 20% in high-risk months and maintain soil moisture ≥55%.
                Schedule reservoir top-ups before <strong style={{ color: C.primary }}>{mostAffectedMonth?.label ?? "peak season"}</strong>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}