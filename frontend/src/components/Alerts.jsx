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

// ── Resolution Flow Component ────────────────────────────────────────────────
function ResolutionFlow() {
  const resolutions = [
    { title: "Dhaka Sector 4 Fixed", desc: "Irrigation valve recalibrated", time: "12 min ago" },
    { title: "Rajshahi Ph Anomaly Resolved", desc: "Manual soil treatment confirmed", time: "45 min ago" }
  ];

  return (
    <div style={{ ...glassPanel, padding: "24px", borderRadius: "16px", marginTop: "32px" }}>
      <h3 style={{ fontSize: "18px", fontWeight: "700", fontFamily: fontHeadline, margin: "0 0 24px" }}>Resolution Flow</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
        {resolutions.map((item, idx) => (
          <div key={idx} style={{ display: "flex", gap: "16px" }}>
            <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "rgba(136,217,130,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span className="material-symbols-outlined mat-fill" style={{ fontSize: "14px", color: C.primary }}>check_circle</span>
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

  useEffect(() => {
    // Check if we have saved alert data in LocalStorage to persist across tab changes
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

    // 1. Find the alert being resolved
    const alertToRemove = alertsData.alerts.find((a, idx) => (a.id || idx) === alertId);
    if (!alertToRemove) return;

    // 2. Logic for counts
    const isCritical = alertToRemove.severity === "URGENT";
    // Improved check: handles "Irrigation", "Low Water", "Watering needed", etc.
    const isIrrigationIssue = /water|irrigation/i.test(alertToRemove.issue);

    const updatedState = {
      ...alertsData,
      alerts: alertsData.alerts.filter((a, idx) => (a.id || idx) !== alertId),
      total_active: alertsData.total_active - 1,
      critical_alerts: isCritical ? Math.max(0, alertsData.critical_alerts - 1) : alertsData.critical_alerts,
      irrigation_required: isIrrigationIssue ? Math.max(0, alertsData.irrigation_required - 1) : alertsData.irrigation_required
    };

    // 3. Update State AND LocalStorage (for persistence)
    setAlertsData(updatedState);
    localStorage.setItem("nursery_alerts_state", JSON.stringify(updatedState));

    // Optional: Call API to resolve on backend
    // fetch(`http://127.0.0.1:8000/api/data/alerts/resolve/${alertId}`, { method: 'POST' });
  };

  const alerts = alertsData?.alerts || [];
  const criticalAlerts = alertsData?.critical_alerts ?? "—";
  const irrigationRequired = alertsData?.irrigation_required ?? "—";

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.onSurface, fontFamily: fontBody, display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap');
        .material-symbols-outlined { font-family: 'Material Symbols Outlined'; font-size: 20px; display: inline-block; vertical-align: middle; }
        .mat-fill { font-variation-settings: 'FILL' 1; }
        .nav-link:hover { background: rgba(255,255,255,0.05); color: #86efac; }
        .alert-row:hover { background: rgba(255,255,255,0.02); }
      `}</style>

      {/* Sidebar */}
      <aside style={{ position: "fixed", left: 0, top: 0, height: "100vh", width: "256px", background: "rgba(12,10,9,0.85)", backdropFilter: "blur(20px)", display: "flex", flexDirection: "column", paddingTop: "24px", zIndex: 50 }}>
        <div style={{ padding: "0 24px", marginBottom: "40px" }}>
          <div style={{ fontSize: "20px", fontWeight: "700", color: "#4ade80", fontFamily: fontHeadline }}>NurseryPulse</div>
        </div>
        <nav style={{ flex: 1 }}>
          {NAV_ITEMS.map(({ icon, label, page }) => (
            <a key={label} href="#" className={page === "alerts" ? "" : "nav-link"} onClick={(e) => { e.preventDefault(); onNavigate && onNavigate(page); }} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", color: page === "alerts" ? "#4ade80" : C.stone400, borderLeft: page === "alerts" ? "4px solid #22c55e" : "4px solid transparent", background: page === "alerts" ? "rgba(34,197,94,0.1)" : "transparent", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>
              <span className="material-symbols-outlined">{icon}</span> {label}
            </a>
          ))}
        </nav>
      </aside>

      <main style={{ marginLeft: "256px", padding: "96px 32px 48px", width: "calc(100% - 256px)", boxSizing: "border-box" }}>
        {/* Header & Stats */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
          <div>
            <h1 style={{ fontSize: "30px", fontWeight: "800", fontFamily: fontHeadline, margin: 0 }}>Resolution Hub</h1>
            <p style={{ fontSize: "14px", color: C.onSurfaceVariant }}>Real-time nursery anomaly management.</p>
          </div>
          <div style={{ display: "flex", gap: "16px" }}>
            <div style={{ ...glassPanel, padding: "12px 24px", borderRadius: "12px" }}>
              <p style={{ fontSize: "10px", color: C.stone500, margin: 0 }}>CRITICAL ALERTS</p>
              <p style={{ fontSize: "22px", fontWeight: "700", margin: 0 }}>{loading ? "—" : String(criticalAlerts).padStart(2, "0")}</p>
            </div>
            <div style={{ ...glassPanel, padding: "12px 24px", borderRadius: "12px" }}>
              <p style={{ fontSize: "10px", color: C.stone500, margin: 0 }}>IRRIGATION REQ.</p>
              <p style={{ fontSize: "22px", fontWeight: "700", margin: 0 }}>{loading ? "—" : String(irrigationRequired).padStart(2, "0")}</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ ...glassPanel, borderRadius: "12px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(49,54,48,0.5)", textAlign: "left" }}>
                {["Timestamp", "Location", "Issue", "Severity", "Actions"].map(h => (
                  <th key={h} style={{ padding: "14px 24px", fontSize: "10px", color: C.stone400, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {alerts.length === 0 && !loading ? (
                <tr><td colSpan="5" style={{ padding: "40px", textAlign: "center", color: C.stone500 }}>No active alerts.</td></tr>
              ) : (
                alerts.map((row, idx) => {
                  const ss = severityStyle(row.severity);
                  const alertId = row.id || idx;
                  return (
                    <tr key={alertId} className="alert-row" style={{ borderTop: "1px solid rgba(65,73,62,0.1)" }}>
                      <td style={{ padding: "20px 24px" }}>{row.timestamp}</td>
                      <td style={{ padding: "20px 24px" }}>{row.location}</td>
                      <td style={{ padding: "20px 24px", color: ss.issueColor, fontWeight: "700" }}>{row.issue}</td>
                      <td style={{ padding: "20px 24px" }}>
                        <span style={{ background: ss.severityBg, color: ss.severityColor, padding: "3px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: "800" }}>{row.severity}</span>
                      </td>
                      <td style={{ padding: "20px 24px", textAlign: "right" }}>
                        <button 
                          onClick={() => handleResolve(alertId)} 
                          style={{ padding: "6px 16px", background: "rgba(136,217,130,0.1)", border: "1px solid rgba(136,217,130,0.2)", color: C.primary, borderRadius: "8px", cursor: "pointer", fontWeight: "700" }}
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