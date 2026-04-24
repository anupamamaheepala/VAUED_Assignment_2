import React, { useEffect, useState } from "react";

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

const NAV_ITEMS = [
  { icon: "dashboard",            label: "Dashboard", page: "dashboard" },
  { icon: "potted_plant",         label: "Health",    page: "health"    },
  { icon: "notifications_active", label: "Alerts",    page: "alerts"    },
  { icon: "trending_up",          label: "Trends",    page: "trends"    },
  { icon: "smart_toy",            label: "AI Chatbot",page: "chatbot"   },
];

function severityStyle(severity) {
  if (severity === "URGENT") {
    return {
      severityBg: "#93000a",
      severityColor: "#ffdad6",
      issueDot: C.error,
      issueColor: C.error,
    };
  }
  return {
    severityBg: C.secondaryContainer,
    severityColor: "#281900",
    issueDot: C.secondary,
    issueColor: C.secondary,
  };
}

// ── TopHeader ─────────────────────────────────────────────────────────────────
function TopHeader() {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "calc(100% - 256px)",
        height: 64,
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
      <div style={{ flex: 1 }} />
      <div style={{ width: 320, position: "relative", marginRight: 16 }}>
        <span
          className="material-symbols-outlined"
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            color: C.stone400,
            fontSize: 16,
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
            borderRadius: 9999,
            padding: "9px 16px 9px 38px",
            fontSize: 13,
            color: C.onSurface,
            outline: "none",
            fontFamily: fontBody,
            boxSizing: "border-box",
          }}
        />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {["notifications", "settings"].map((icon) => (
          <button
            key={icon}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 8,
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
        <div style={{ width: 1, height: 16, background: C.stone800 }} />
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            fontFamily: fontHeadline,
            color: C.stone300,
          }}
        >
          NurseryPulse Monitor
        </span>
      </div>
    </header>
  );
}

// ── Resolution Flow Component ────────────────────────────────────────────────
function ResolutionFlow() {
  const resolutions = [
    { title: "Dhaka Sector 4 Fixed", desc: "Irrigation valve recalibrated", time: "12 min ago" },
    { title: "Rajshahi Ph Anomaly Resolved", desc: "Manual soil treatment confirmed", time: "45 min ago" },
  ];

  return (
    <div style={{ ...glassPanel, padding: "24px", borderRadius: "16px", marginTop: "32px" }}>
      <h3 style={{ fontSize: "18px", fontWeight: "700", fontFamily: fontHeadline, margin: "0 0 24px" }}>
        Resolution Flow
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
        {resolutions.map((item, idx) => (
          <div key={idx} style={{ display: "flex", gap: "16px" }}>
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: "rgba(136,217,130,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span
                className="material-symbols-outlined mat-fill"
                style={{ fontSize: "14px", color: C.primary }}
              >
                check_circle
              </span>
            </div>
            <div>
              <p style={{ fontSize: "13px", fontWeight: "700", margin: 0, color: C.onSurface }}>{item.title}</p>
              <p style={{ fontSize: "11px", color: C.stone500, margin: "4px 0 0", lineHeight: "1.4" }}>{item.desc}</p>
              <p style={{ fontSize: "10px", color: C.primary, fontWeight: "700", margin: "6px 0 0" }}>{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Alerts({ onNavigate }) {
  const [alertsData, setAlertsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState("All");

  useEffect(() => {
    const savedData = localStorage.getItem("nursery_alerts_state");
    if (savedData) {
      setAlertsData(JSON.parse(savedData));
      setLoading(false);
    } else {
      fetch("http://127.0.0.1:8000/api/data/alerts")
        .then((res) => res.json())
        .then((data) => {
          setAlertsData(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, []);

  const handleResolve = async (alertId) => {
    if (!alertsData) return;

    const alertToRemove = alertsData.alerts.find((a, idx) => (a.id || idx) === alertId);
    if (!alertToRemove) return;

    const isCritical = alertToRemove.severity === "URGENT";
    const isIrrigationIssue = /water|irrigation/i.test(alertToRemove.issue);

    const updatedState = {
      ...alertsData,
      alerts: alertsData.alerts.filter((a, idx) => (a.id || idx) !== alertId),
      total_active: alertsData.total_active - 1,
      critical_alerts: isCritical ? Math.max(0, alertsData.critical_alerts - 1) : alertsData.critical_alerts,
      irrigation_required: isIrrigationIssue
        ? Math.max(0, alertsData.irrigation_required - 1)
        : alertsData.irrigation_required,
    };

    setAlertsData(updatedState);
    localStorage.setItem("nursery_alerts_state", JSON.stringify(updatedState));
  };

  const alerts = alertsData?.alerts || [];
  const criticalAlerts = alertsData?.critical_alerts ?? "—";
  const irrigationRequired = alertsData?.irrigation_required ?? "—";

  // Derive unique locations for filter buttons
  const uniqueLocations = ["All", ...Array.from(new Set(alerts.map((a) => a.location)))];
  const filteredAlerts = selectedLocation === "All"
    ? alerts
    : alerts.filter((a) => a.location === selectedLocation);

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
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; font-size: 20px; display: inline-block; vertical-align: middle; }
        .mat-fill { font-variation-settings: 'FILL' 1; }
        .nav-link:hover { background: rgba(255,255,255,0.05); color: #86efac; }
        .alert-row:hover { background: rgba(255,255,255,0.02); }
        * { box-sizing: border-box; }
      `}</style>

      {/* ── Sidebar ── */}
      <aside
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          height: "100vh",
          width: "256px",
          background: "rgba(12,10,9,0.88)",
          backdropFilter: "blur(20px)",
          display: "flex",
          flexDirection: "column",
          paddingTop: "24px",
          paddingBottom: "24px",
          boxShadow: "32px 0 32px -4px rgba(0,0,0,0.45)",
          zIndex: 50,
        }}
      >
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
              marginTop: 2,
            }}
          >
            Smart Observatory
          </div>
        </div>

        <nav style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {NAV_ITEMS.map(({ icon, label, page }) => {
            const active = page === "alerts";
            return (
              <a
                key={label}
                href="#"
                className={active ? "" : "nav-link"}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate && onNavigate(page);
                }}
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
                }}
              >
                <span className="material-symbols-outlined">{icon}</span>
                {label}
              </a>
            );
          })}
        </nav>

        <div style={{ padding: "0 24px", marginTop: "auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: 12,
              borderRadius: 12,
              background: "rgba(255,255,255,0.05)",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: C.primaryContainer,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span className="material-symbols-outlined" style={{ color: C.primary, fontSize: 18 }}>
                person
              </span>
            </div>
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
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
      </aside>

      {/* ── Top Header ── */}
      <TopHeader />

      {/* ── Main Content ── */}
      <main
        style={{
          marginLeft: "256px",
          padding: "96px 32px 48px",
          width: "calc(100% - 256px)",
          boxSizing: "border-box",
        }}
      >
        {/* Page Header & Stats */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "32px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "30px",
                fontWeight: "800",
                fontFamily: fontHeadline,
                margin: 0,
              }}
            >
              Resolution Hub
            </h1>
            <p style={{ fontSize: "14px", color: C.onSurfaceVariant, margin: "4px 0 0" }}>
              Real-time nursery anomaly management.
            </p>
          </div>
          <div style={{ display: "flex", gap: "16px" }}>
            <div style={{ ...glassPanel, padding: "12px 24px", borderRadius: "12px" }}>
              <p style={{ fontSize: "10px", color: C.stone500, margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Critical Alerts
              </p>
              <p style={{ fontSize: "22px", fontWeight: "700", fontFamily: fontHeadline, margin: "4px 0 0", color: C.error }}>
                {loading ? "—" : String(criticalAlerts).padStart(2, "0")}
              </p>
            </div>
            <div style={{ ...glassPanel, padding: "12px 24px", borderRadius: "12px" }}>
              <p style={{ fontSize: "10px", color: C.stone500, margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Irrigation Req.
              </p>
              <p style={{ fontSize: "22px", fontWeight: "700", fontFamily: fontHeadline, margin: "4px 0 0", color: C.secondaryContainer }}>
                {loading ? "—" : String(irrigationRequired).padStart(2, "0")}
              </p>
            </div>
          </div>
        </div>

        {/* Alerts Table */}
        <div style={{ ...glassPanel, borderRadius: "12px", overflow: "hidden" }}>

          {/* ── Location Filter Bar ── */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "16px 24px",
            borderBottom: "1px solid rgba(65,73,62,0.15)",
            flexWrap: "wrap",
          }}>
            <span className="material-symbols-outlined" style={{ color: C.stone500, fontSize: 16, marginRight: 4 }}>
              location_on
            </span>
            <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, color: C.stone500, marginRight: 8 }}>
              Filter by Location
            </span>
            {uniqueLocations.map((loc) => {
              const active = selectedLocation === loc;
              return (
                <button
                  key={loc}
                  onClick={() => setSelectedLocation(loc)}
                  style={{
                    padding: "5px 14px",
                    borderRadius: 9999,
                    fontSize: 12,
                    fontWeight: active ? 700 : 500,
                    fontFamily: fontBody,
                    cursor: "pointer",
                    transition: "all 0.18s",
                    border: active
                      ? "1px solid rgba(136,217,130,0.5)"
                      : "1px solid rgba(65,73,62,0.3)",
                    background: active
                      ? "rgba(136,217,130,0.12)"
                      : "rgba(49,54,48,0.4)",
                    color: active ? C.primary : C.stone400,
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = "rgba(136,217,130,0.06)";
                      e.currentTarget.style.color = C.onSurface;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = "rgba(49,54,48,0.4)";
                      e.currentTarget.style.color = C.stone400;
                    }
                  }}
                >
                  {loc}
                  {loc !== "All" && (
                    <span style={{
                      marginLeft: 6,
                      fontSize: 10,
                      fontWeight: 700,
                      background: active ? "rgba(136,217,130,0.2)" : "rgba(255,255,255,0.06)",
                      color: active ? C.primary : C.stone500,
                      borderRadius: 9999,
                      padding: "1px 6px",
                    }}>
                      {alerts.filter((a) => a.location === loc).length}
                    </span>
                  )}
                </button>
              );
            })}
            {selectedLocation !== "All" && (
              <button
                onClick={() => setSelectedLocation("All")}
                style={{
                  marginLeft: "auto",
                  background: "none",
                  border: "none",
                  color: C.stone500,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontFamily: fontBody,
                  padding: "4px 8px",
                  borderRadius: 6,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.error)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.stone500)}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
                Clear filter
              </button>
            )}
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(49,54,48,0.5)", textAlign: "left" }}>
                {["Timestamp", "Location", "Issue", "Severity", "Actions"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "14px 24px",
                      fontSize: "10px",
                      color: C.stone400,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      fontWeight: 700,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.length === 0 && !loading ? (
                <tr>
                  <td colSpan="5" style={{ padding: "40px", textAlign: "center", color: C.stone500 }}>
                    {selectedLocation === "All" ? "No active alerts." : `No alerts for "${selectedLocation}".`}
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((row, idx) => {
                  const ss = severityStyle(row.severity);
                  const alertId = row.id || idx;
                  return (
                    <tr
                      key={alertId}
                      className="alert-row"
                      style={{ borderTop: "1px solid rgba(65,73,62,0.1)", transition: "background 0.15s" }}
                    >
                      <td style={{ padding: "20px 24px", fontSize: 13, color: C.stone400 }}>{row.timestamp}</td>
                      <td style={{ padding: "20px 24px", fontSize: 13, fontWeight: 600 }}>{row.location}</td>
                      <td style={{ padding: "20px 24px", color: ss.issueColor, fontWeight: "700", fontSize: 13 }}>
                        {row.issue}
                      </td>
                      <td style={{ padding: "20px 24px" }}>
                        <span
                          style={{
                            background: ss.severityBg,
                            color: ss.severityColor,
                            padding: "3px 8px",
                            borderRadius: "4px",
                            fontSize: "10px",
                            fontWeight: "800",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          {row.severity}
                        </span>
                      </td>
                      <td style={{ padding: "20px 24px", textAlign: "right" }}>
                        <button
                          onClick={() => handleResolve(alertId)}
                          style={{
                            padding: "6px 16px",
                            background: "rgba(136,217,130,0.1)",
                            border: "1px solid rgba(136,217,130,0.2)",
                            color: C.primary,
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "700",
                            fontSize: 12,
                            fontFamily: fontBody,
                            transition: "background 0.2s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(136,217,130,0.2)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(136,217,130,0.1)")}
                        >
                          Mark as Resolved
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <ResolutionFlow />
      </main>
    </div>
  );
}