import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import Health from "./components/Health";
import Alerts from "./components/Alerts";
import Trends from "./components/Trends";
import AIchatbot from "./components/AIchatbot";
import ChatWidget from "./components/ChatWidget";

export default function App() {
  const [page, setPage] = useState("dashboard");

  const renderPage = () => {
    switch (page) {
      case "health":
        return <Health onNavigate={setPage} />;
      case "alerts":
        return <Alerts onNavigate={setPage} />;
      case "trends":
        return <Trends onNavigate={setPage} />;
      case "chatbot":
        return <AIchatbot onNavigate={setPage} />;
      case "dashboard":
      default:
        return <Dashboard onNavigate={setPage} />;
    }
  };

  return (
    <>
      {renderPage()}
      {/* Hide floating chat widget on AI Chatbot page — it has its own full interface */}
      {page !== "chatbot" && <ChatWidget />}
    </>
  );
}
