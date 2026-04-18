import React, { useState } from "react";

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

const BAR_DATA = [
  { label: "W1", fertilizer: 40, rainfall: 70 },
  { label: "W2", fertilizer: 55, rainfall: 30 },
  { label: "W3", fertilizer: 80, rainfall: 60 },
  { label: "W4", fertilizer: 45, rainfall: 90 },
  { label: "W5", fertilizer: 60, rainfall: 50 },
  { label: "W6", fertilizer: 30, rainfall: 65 },
];

export default function Trends({ onNavigate }) {
  const [period, setPeriod] = useState("Last 12 Months");
  const [location, setLocation] = useState("All Locations");
  const [cropType, setCropType] = useState("All Crop Types");

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
            {[
              { value: period, setter: setPeriod, icon: "calendar_today", options: ["Last 12 Months","Q3 - 2023","Q2 - 2023","Full Year 2022"] },
              { value: location, setter: setLocation, icon: "location_on", options: ["All Locations","Sector North-Alpha","Sector West-Gamma","Indoor Hydroponics Lab"] },
              { value: cropType, setter: setCropType, icon: "psychology", options: ["All Crop Types","Medicinal Herbs","Leafy Greens","Micro-fruitage"] },
            ].map(({ value, setter, icon, options }) => (
              <div key={icon} style={{ position: "relative" }}>
                <select value={value} onChange={(e) => setter(e.target.value)} style={{
                  background: C.surfaceHigh, border: "1px solid rgba(65,73,62,0.3)",
                  borderRadius: "8px", padding: "8px 36px 8px 14px",
                  fontSize: "14px", color: C.onSurface, cursor: "pointer",
                  fontFamily: fontBody, outline: "none",
                }}>
                  {options.map(o => <option key={o}>{o}</option>)}
                </select>
                <span className="material-symbols-outlined" style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", color: C.stone400, pointerEvents: "none" }}>{icon}</span>
              </div>
            ))}
            <button style={{
              background: C.primary, color: "#003909", border: "none",
              padding: "8px 18px", borderRadius: "8px", fontSize: "14px",
              fontWeight: "700", cursor: "pointer", fontFamily: fontBody,
              display: "flex", alignItems: "center", gap: "8px",
              boxShadow: "0 4px 14px rgba(136,217,130,0.15)",
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>download</span>
              Export Report
            </button>
          </div>
        </section>

        {/* ── Yield Chart + Stats ── */}
        <section style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", marginBottom: "24px" }}>

          {/* Line Chart */}
          <div style={{ ...glassPanel, padding: "32px", borderRadius: "12px", display: "flex", flexDirection: "column" }}>
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

            {/* SVG Chart */}
            <div style={{ position: "relative", height: "300px", width: "100%" }}>
              <svg width="100%" height="100%" viewBox="0 0 1000 300" preserveAspectRatio="none" style={{ overflow: "visible" }}>
                <defs>
                  <linearGradient id="growthGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#88d982" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#88d982" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[0, 200, 400, 600, 800, 1000].map(x => (
                  <line key={x} x1={x} x2={x} y1="0" y2="300" stroke="#41493e" strokeOpacity="0.1" />
                ))}
                <path d="M0,250 Q100,220 200,235 T400,160 T600,110 T800,120 T1000,40 V300 H0 Z" fill="url(#growthGrad)" />
                <path d="M0,250 Q100,220 200,235 T400,160 T600,110 T800,120 T1000,40" fill="none" stroke="#88d982" strokeWidth="4" strokeLinecap="round" />
                {[[200,235],[400,160],[600,110],[800,120]].map(([cx,cy]) => (
                  <circle key={cx} cx={cx} cy={cy} r="5" fill="#88d982" />
                ))}
                <circle cx="200" cy="235" r="5" fill="#88d982" className="pulse-dot" />
                <circle cx="1000" cy="40" r="8" fill="#88d982" stroke="rgba(136,217,130,0.4)" strokeWidth="10" />
              </svg>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                {["JAN","MAR","MAY","JUL","SEP","NOV"].map(m => (
                  <span key={m} style={{ fontSize: "10px", fontWeight: "700", color: C.stone500, letterSpacing: "0.05em" }}>{m}</span>
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
                <h4 style={{ fontSize: "40px", fontWeight: "800", fontFamily: fontHeadline, margin: "8px 0 0", lineHeight: 1 }}>+14.2%</h4>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "14px", color: C.primary }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>trending_up</span>
                  <span style={{ fontSize: "12px", fontWeight: "700" }}>Above industry average</span>
                </div>
              </div>
            </div>

            {/* Peak Performance */}
            <div style={{ ...glassPanel, padding: "24px", borderRadius: "12px", borderLeft: `4px solid ${C.secondaryContainer}` }}>
              <p style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.12em", color: C.stone400, margin: 0 }}>Peak Performance Month</p>
              <h4 style={{ fontSize: "24px", fontWeight: "700", fontFamily: fontHeadline, margin: "8px 0 4px" }}>September 2023</h4>
              <p style={{ fontSize: "13px", color: C.stone500, margin: 0 }}>2,480 tonnes harvested in Sector B.</p>
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

        {/* ── Resource Efficiency + Secondary Cards ── */}
        <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", paddingBottom: "32px" }}>

          {/* Bar Chart */}
          <div style={{ ...glassPanel, padding: "32px", borderRadius: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
              <div>
                <h3 style={{ fontSize: "20px", fontWeight: "700", fontFamily: fontHeadline, margin: 0 }}>Resource Efficiency</h3>
                <p style={{ fontSize: "10px", color: C.onSurfaceVariant, margin: "4px 0 0", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                  Fertilizer vs Rainfall Impact
                </p>
              </div>
              <span style={{
                background: C.surfaceHighest, fontSize: "10px", fontWeight: "700",
                padding: "4px 12px", borderRadius: "9999px", color: C.onSurface,
              }}>WEEKLY VIEWS</span>
            </div>

            {/* Bars */}
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: "200px", gap: "8px" }}>
              {BAR_DATA.map(({ label, fertilizer, rainfall }) => (
                <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", width: "100%", justifyContent: "center", height: "170px" }}>
                    <div style={{ width: "14px", background: "rgba(6,95,24,0.4)", borderRadius: "3px 3px 0 0", height: `${fertilizer}%` }} />
                    <div style={{ width: "14px", background: C.primary, borderRadius: "3px 3px 0 0", height: `${rainfall}%` }} />
                  </div>
                  <span style={{ fontSize: "9px", fontWeight: "700", color: C.stone500, marginTop: "10px" }}>{label}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "20px", marginTop: "24px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              {[
                { color: "rgba(6,95,24,0.4)", label: "Fertilizer Used (Kg)" },
                { color: C.primary, label: "Rainfall Intensity (mm)" },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: color, display: "inline-block" }} />
                  <span style={{ fontSize: "12px", color: C.stone400 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right 2x2 grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

            {/* Location Density */}
            <div style={{ background: C.surfaceHigh, borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.12em", color: C.stone500, margin: "0 0 12px" }}>Location Density</p>
                <h4 style={{ fontSize: "18px", fontWeight: "700", fontFamily: fontHeadline, margin: 0 }}>Sector Alpha-9</h4>
                <p style={{ fontSize: "13px", color: C.stone400, margin: "4px 0 0", lineHeight: 1.5 }}>Optimal resource utilization achieved last cycle.</p>
              </div>
              <div style={{ marginTop: "20px" }}>
                <div style={{ width: "100%", height: "6px", background: C.stone800, borderRadius: "9999px", overflow: "hidden" }}>
                  <div style={{ width: "92%", height: "100%", background: C.primary }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
                  <span style={{ fontSize: "10px", fontWeight: "700", color: C.primary }}>92% Efficiency</span>
                  <span style={{ fontSize: "10px", fontWeight: "700", color: C.stone500 }}>+4% YoY</span>
                </div>
              </div>
            </div>

            {/* Agronomist note card */}
            <div style={{ borderRadius: "12px", overflow: "hidden", position: "relative", minHeight: "200px", background: "#0d1a0d" }}>
              {/* Decorative plant SVG bg */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #0d1a0d 0%, #1a2f1a 50%, #0a150a 100%)" }} />
              <div style={{
                position: "absolute", inset: 0,
                background: "radial-gradient(ellipse at 60% 30%, rgba(136,217,130,0.15) 0%, transparent 60%)",
              }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, #0a0a0a, transparent)", height: "70%" }} />
              <div style={{ position: "absolute", bottom: "16px", left: "16px", right: "16px" }}>
                <p style={{ fontSize: "10px", fontWeight: "700", color: C.primary, textTransform: "uppercase", letterSpacing: "0.12em", margin: 0 }}>Agronomist Note</p>
                <h4 style={{ fontSize: "13px", fontWeight: "700", color: "#fff", margin: "4px 0 0", lineHeight: 1.4 }}>
                  Reduced phosphate levels correlated with +8% leaf surface area.
                </h4>
              </div>
            </div>

            {/* Rainfall Deficit Alert — spans both columns */}
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
              <button className="sim-btn" style={{
                fontSize: "12px", fontWeight: "700", color: C.primary,
                border: "1px solid rgba(136,217,130,0.2)", padding: "8px 16px",
                borderRadius: "8px", cursor: "pointer", background: "transparent",
                fontFamily: fontBody, transition: "all 0.15s", whiteSpace: "nowrap",
              }}>
                View Simulation
              </button>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}
