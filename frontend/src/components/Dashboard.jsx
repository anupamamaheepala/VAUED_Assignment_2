import React from "react";

// ── Color tokens (matching original Tailwind theme) ──────────────────────────
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

// ── Shared font stacks ────────────────────────────────────────────────────────
const fontHeadline = "'Manrope', sans-serif";
const fontBody = "'Inter', sans-serif";
const fontMono = "'IBM Plex Mono', monospace";

export default function Dashboard({ onNavigate }) {
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
      {/* Google Fonts */}
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
        .mat-fill {
          font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .nav-link:hover { background: rgba(255,255,255,0.05); color: #86efac; }
        .pulse { animation: pulse 2s cubic-bezier(0.4,0,0.6,1) infinite; }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .advice-card:hover .advice-icon { opacity: 0.2; }
      `}</style>

      {/* ── Sidebar ── */}
      <aside
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          height: "100vh",
          width: "256px",
          background: "rgba(12,10,9,0.85)",
          backdropFilter: "blur(20px)",
          display: "flex",
          flexDirection: "column",
          paddingTop: "24px",
          paddingBottom: "24px",
          boxShadow: "32px 0 32px -4px rgba(0,0,0,0.45)",
          zIndex: 50,
        }}
      >
        {/* Logo */}
        <div style={{ padding: "0 24px", marginBottom: "40px" }}>
          <div
            style={{
              fontSize: "20px",
              fontWeight: "700",
              color: "#4ade80",
              fontFamily: fontHeadline,
              letterSpacing: "-0.02em",
            }}
          >
            NurseryPulse
          </div>
          <div
            style={{
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: C.stone500,
              marginTop: "2px",
            }}
          >
            Smart Observatory
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {[
            { icon: "dashboard", label: "Dashboard", page: "dashboard", active: true },
            { icon: "potted_plant", label: "Health", page: "health", active: false },
            { icon: "notifications_active", label: "Alerts", page: "alerts", active: false },
            { icon: "trending_up", label: "Trends", page: "trends", active: false },
            { icon: "smart_toy", label: "AI Chatbot", page: "chatbot", active: false },
          ].map(({ icon, label, page, active }) => (
            <a
              key={label}
              href="#"
              className={active ? "" : "nav-link"}
              onClick={(e) => { e.preventDefault(); onNavigate && onNavigate(page); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                color: active ? "#4ade80" : C.stone400,
                borderLeft: active ? "4px solid #22c55e" : "4px solid transparent",
                background: active ? "rgba(34,197,94,0.1)" : "transparent",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "500",
                transition: "all 0.2s",
                transform: active ? "translateX(2px)" : "none",
              }}
            >
              <span className="material-symbols-outlined">{icon}</span>
              {label}
            </a>
          ))}
        </nav>

        {/* User card */}
        <div style={{ padding: "0 24px", marginTop: "auto", marginBottom: "32px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.05)",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: C.primaryContainer,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                overflow: "hidden",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ color: C.primary, fontSize: "18px" }}
              >
                person
              </span>
            </div>
            <div style={{ overflow: "hidden" }}>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  margin: 0,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Executive Admin
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Top Header ── */}
      <header
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "calc(100% - 256px)",
          height: "64px",
          background: "rgba(12,10,9,0.5)",
          backdropFilter: "blur(12px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 32px",
          zIndex: 40,
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {/* Spacer to push search right */}
        <div style={{ flex: 1 }} />

        {/* Search */}
        <div style={{ width: "320px", position: "relative", marginRight: "16px" }}>
          <span
            className="material-symbols-outlined"
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: C.stone400,
              fontSize: "16px",
            }}
          >
            search
          </span>
          <input
            placeholder="Search nursery sectors..."
            style={{
              width: "100%",
              background: "rgba(38,43,38,0.9)",
              border: "1px solid rgba(136,217,130,0.2)",
              borderRadius: "9999px",
              padding: "9px 16px 9px 38px",
              fontSize: "13px",
              color: C.onSurface,
              outline: "none",
              fontFamily: fontBody,
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Right icons */}
        <div
          style={{ display: "flex", alignItems: "center", gap: "16px" }}
        >
          {["notifications", "settings"].map((icon) => (
            <button
              key={icon}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "50%",
                color: C.stone400,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span className="material-symbols-outlined">{icon}</span>
            </button>
          ))}
          <div
            style={{
              width: "1px",
              height: "16px",
              background: C.stone800,
            }}
          />
          <span
            style={{
              fontSize: "12px",
              fontWeight: "500",
              fontFamily: fontHeadline,
              color: C.stone300,
            }}
          >
            NurseryPulse Monitor
          </span>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main
        style={{
          marginLeft: "256px",
          paddingTop: "96px",
          paddingBottom: "48px",
          padding: "96px 32px 48px 32px",
          minHeight: "100vh",
          width: "calc(100% - 256px)",
          boxSizing: "border-box",
        }}
      >
        {/* Page title */}
        <section style={{ marginBottom: "32px" }}>
          <h1
            style={{
              fontSize: "30px",
              fontWeight: "800",
              fontFamily: fontHeadline,
              color: C.onSurface,
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Executive Overview
          </h1>
          <p style={{ fontSize: "14px", color: C.onSurfaceVariant, margin: "4px 0 0" }}>
            System Status:{" "}
            <span style={{ color: C.primary, fontWeight: "600" }}>Nominal</span>{" "}
            • Last Update: 2m ago
          </p>
        </section>

        {/* ── Bento Grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: "24px",
          }}
        >
          {/* Daily Advice Card */}
          <div
            className="advice-card"
            style={{
              gridColumn: "span 8",
              background: "rgba(49,54,48,0.7)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(65,73,62,0.2)",
              borderRadius: "12px",
              padding: "24px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Background icon */}
            <div
              className="advice-icon"
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                padding: "32px",
                opacity: 0.1,
                transition: "opacity 0.3s",
                pointerEvents: "none",
              }}
            >
              <span
                className="material-symbols-outlined mat-fill"
                style={{ fontSize: "96px", color: C.primary }}
              >
                psychology
              </span>
            </div>

            <div
              style={{
                position: "relative",
                zIndex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {/* Label */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span
                  className="pulse"
                  style={{
                    display: "inline-block",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: C.primary,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    fontWeight: "700",
                    color: C.primary,
                    fontFamily: fontBody,
                  }}
                >
                  Daily Advice
                </span>
              </div>

              {/* Headline */}
              <p
                style={{
                  fontSize: "22px",
                  fontWeight: "700",
                  fontFamily: fontHeadline,
                  lineHeight: "1.4",
                  margin: 0,
                  maxWidth: "600px",
                }}
              >
                Your nursery is{" "}
                <span style={{ color: C.primary }}>92% Healthy</span>. Dhaka
                sector has low soil moisture;{" "}
                <span
                  style={{
                    textDecoration: "underline",
                    textDecorationColor: C.secondaryContainer,
                    textUnderlineOffset: "4px",
                  }}
                >
                  consider irrigation
                </span>
                .
              </p>

              {/* Buttons */}
              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button
                  style={{
                    background: `linear-gradient(135deg, ${C.primary}, ${C.primaryContainer})`,
                    color: "#003909",
                    border: "none",
                    padding: "8px 20px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontFamily: fontBody,
                  }}
                >
                  <span
                    className="material-symbols-outlined mat-fill"
                    style={{ fontSize: "16px" }}
                  >
                    water_drop
                  </span>
                  Trigger Dhaka Irrigation
                </button>
                <button
                  style={{
                    background: "rgba(49,54,48,0.5)",
                    color: C.onSurface,
                    border: "none",
                    padding: "8px 20px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                    fontFamily: fontBody,
                  }}
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>

          {/* KPI: Overall Health */}
          <div
            style={{
              gridColumn: "span 4",
              background: C.surfaceHigh,
              borderRadius: "12px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <p
                style={{
                  fontSize: "14px",
                  color: C.onSurfaceVariant,
                  margin: 0,
                }}
              >
                Overall Health
              </p>
              <span
                className="material-symbols-outlined"
                style={{ color: C.primary }}
              >
                health_and_safety
              </span>
            </div>
            <div style={{ marginTop: "16px" }}>
              <div
                style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}
              >
                <span
                  style={{
                    fontSize: "48px",
                    fontWeight: "900",
                    fontFamily: fontHeadline,
                    lineHeight: 1,
                  }}
                >
                  92%
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    color: C.primary,
                    fontWeight: "700",
                    marginBottom: "6px",
                  }}
                >
                  +2.4% vs last week
                </span>
              </div>
              {/* Progress bar */}
              <div
                style={{
                  width: "100%",
                  height: "8px",
                  background: C.stone800,
                  borderRadius: "9999px",
                  marginTop: "16px",
                  overflow: "hidden",
                  display: "flex",
                }}
              >
                <div
                  style={{
                    width: "92%",
                    height: "100%",
                    background: C.primary,
                  }}
                />
                <div
                  style={{
                    width: "8%",
                    height: "100%",
                    background: C.error,
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "8px",
                }}
              >
                <span style={{ fontSize: "10px", color: C.stone500 }}>
                  92% Healthy
                </span>
                <span style={{ fontSize: "10px", color: C.stone500 }}>
                  8% Critical
                </span>
              </div>
            </div>
          </div>

          {/* KPI: Season Yield */}
          <div
            style={{
              gridColumn: "span 4",
              background: C.surfaceHigh,
              borderRadius: "12px",
              padding: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "24px",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "14px",
                    color: C.onSurfaceVariant,
                    margin: 0,
                  }}
                >
                  Season Yield
                </p>
                <p
                  style={{
                    fontSize: "22px",
                    fontWeight: "700",
                    fontFamily: fontHeadline,
                    margin: "4px 0 0",
                  }}
                >
                  Est. 1,420 Tons
                </p>
              </div>
              <span
                className="material-symbols-outlined"
                style={{ color: C.secondaryContainer }}
              >
                inventory_2
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { label: "Rice", value: "420T" },
                { label: "Wheat", value: "380T" },
                { label: "Tomato", value: "120T" },
                { label: "Jute", value: "310T" },
                { label: "Potato", value: "190T" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: "12px", color: C.stone400 }}>
                    {label}
                  </span>
                  <div
                    style={{
                      flex: 1,
                      margin: "0 12px",
                      height: "1px",
                      background: C.stone800,
                    }}
                  />
                  <span
                    style={{
                      fontSize: "12px",
                      fontFamily: fontMono,
                      fontWeight: "700",
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* KPI: Active Risks */}
          <div
            style={{
              gridColumn: "span 3",
              background: C.surfaceHigh,
              borderRadius: "12px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <p
                style={{
                  fontSize: "14px",
                  color: C.onSurfaceVariant,
                  margin: 0,
                }}
              >
                Active Risks
              </p>
              <span
                className="material-symbols-outlined mat-fill"
                style={{ color: C.error }}
              >
                warning
              </span>
            </div>
            <div style={{ marginTop: "16px" }}>
              <div
                style={{
                  fontSize: "56px",
                  fontWeight: "900",
                  fontFamily: fontHeadline,
                  color: C.error,
                  lineHeight: 1,
                }}
              >
                04
              </div>
              <p
                style={{
                  fontSize: "11px",
                  color: C.stone500,
                  marginTop: "8px",
                  lineHeight: "1.5",
                }}
              >
                anomaly_flag = 1 detected in sensor net #A-02, #B-19, #D-01,
                #D-04
              </p>
            </div>
            <div
              style={{
                marginTop: "16px",
                paddingTop: "16px",
                borderTop: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <a
                href="#"
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: C.error,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                View Anomaly Log{" "}
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "14px" }}
                >
                  arrow_forward
                </span>
              </a>
            </div>
          </div>

          {/* Crop Health Distribution */}
          <div
            style={{
              gridColumn: "span 5",
              background: C.surfaceHigh,
              borderRadius: "12px",
              padding: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "32px",
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    fontFamily: fontHeadline,
                    margin: 0,
                  }}
                >
                  Crop Health Distribution
                </h3>
                <p
                  style={{
                    fontSize: "11px",
                    color: C.stone500,
                    margin: "4px 0 0",
                  }}
                >
                  Live monitoring per category
                </p>
              </div>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: C.stone400,
                  cursor: "pointer",
                }}
              >
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {[
                {
                  label: "Rice Sector",
                  total: "Total 4,200 units",
                  healthy: 85,
                  stressed: 10,
                  critical: 5,
                },
                {
                  label: "Wheat Sector",
                  total: "Total 3,100 units",
                  healthy: 90,
                  stressed: 7,
                  critical: 3,
                },
                {
                  label: "Tomato Sector",
                  total: "Total 1,800 units",
                  healthy: 60,
                  stressed: 25,
                  critical: 15,
                },
              ].map(({ label, total, healthy, stressed, critical }) => (
                <div key={label}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10px",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        fontWeight: "700",
                      }}
                    >
                      {label}
                    </span>
                    <span style={{ fontSize: "10px", color: C.stone500 }}>
                      {total}
                    </span>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "12px",
                      background: C.stone800,
                      borderRadius: "9999px",
                      overflow: "hidden",
                      display: "flex",
                    }}
                  >
                    <div
                      style={{
                        width: `${healthy}%`,
                        height: "100%",
                        background: C.primary,
                      }}
                    />
                    <div
                      style={{
                        width: `${stressed}%`,
                        height: "100%",
                        background: C.secondaryContainer,
                      }}
                    />
                    <div
                      style={{
                        width: `${critical}%`,
                        height: "100%",
                        background: C.error,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div
              style={{
                marginTop: "32px",
                display: "flex",
                gap: "24px",
              }}
            >
              {[
                { color: C.primary, label: "Healthy" },
                { color: C.secondaryContainer, label: "Stressed" },
                { color: C.error, label: "Critical" },
              ].map(({ color, label }) => (
                <div
                  key={label}
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "3px",
                      background: color,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: "500",
                      color: C.stone400,
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sector Performance Matrix */}
          <div
            style={{
              gridColumn: "span 12",
              background: C.surfaceHigh,
              borderRadius: "12px",
              padding: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  fontFamily: fontHeadline,
                  margin: 0,
                }}
              >
                Sector Performance Matrix
              </h3>
              <div style={{ display: "flex", gap: "8px" }}>
                {["Export CSV", "Last 24h"].map((label) => (
                  <button
                    key={label}
                    style={{
                      background: C.surfaceHighest,
                      border: "1px solid rgba(255,255,255,0.05)",
                      color: C.onSurface,
                      padding: "6px 12px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: "500",
                      cursor: "pointer",
                      fontFamily: fontBody,
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "left",
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    {[
                      "Sector ID",
                      "Primary Crop",
                      "Moisture Level",
                      "pH Balance",
                      "Avg Temp",
                      "Status",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          paddingBottom: "16px",
                          fontSize: "10px",
                          textTransform: "uppercase",
                          fontWeight: "700",
                          color: C.stone500,
                          letterSpacing: "0.05em",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      id: "DHAKA-N1",
                      crop: "Rice / BRRI dhan28",
                      moisture: "22%",
                      moistureLabel: "Low",
                      moistureColor: C.error,
                      ph: "6.4",
                      temp: "28.4°C",
                      status: "Under Review",
                      statusBg: "rgba(147,0,10,0.3)",
                      statusColor: C.error,
                    },
                    {
                      id: "DHAKA-S2",
                      crop: "Potato / Cardinal",
                      moisture: "68%",
                      moistureLabel: "Optimum",
                      moistureColor: C.primary,
                      ph: "5.8",
                      temp: "21.1°C",
                      status: "Stable",
                      statusBg: "rgba(6,95,24,0.3)",
                      statusColor: C.primary,
                    },
                    {
                      id: "MYM-N1",
                      crop: "Jute / O-9897",
                      moisture: "45%",
                      moistureLabel: "Warning",
                      moistureColor: C.secondaryContainer,
                      ph: "7.1",
                      temp: "31.5°C",
                      status: "Monitoring",
                      statusBg: "rgba(254,179,0,0.1)",
                      statusColor: C.secondaryContainer,
                    },
                  ].map((row) => (
                    <tr
                      key={row.id}
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <td
                        style={{
                          padding: "16px 0",
                          fontSize: "14px",
                          fontWeight: "700",
                          fontFamily: fontHeadline,
                        }}
                      >
                        {row.id}
                      </td>
                      <td
                        style={{
                          padding: "16px 0",
                          fontSize: "14px",
                          color: C.stone300,
                        }}
                      >
                        {row.crop}
                      </td>
                      <td
                        style={{
                          padding: "16px 0",
                          fontSize: "14px",
                          fontFamily: fontMono,
                          color: row.moistureColor,
                        }}
                      >
                        {row.moisture}{" "}
                        <span
                          style={{ fontSize: "10px", opacity: 0.6 }}
                        >
                          ({row.moistureLabel})
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "16px 0",
                          fontSize: "14px",
                          color: C.stone300,
                          fontFamily: fontMono,
                        }}
                      >
                        {row.ph}
                      </td>
                      <td
                        style={{
                          padding: "16px 0",
                          fontSize: "14px",
                          color: C.stone300,
                          fontFamily: fontMono,
                        }}
                      >
                        {row.temp}
                      </td>
                      <td style={{ padding: "16px 0" }}>
                        <span
                          style={{
                            padding: "4px 8px",
                            background: row.statusBg,
                            color: row.statusColor,
                            fontSize: "10px",
                            fontWeight: "700",
                            borderRadius: "4px",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
