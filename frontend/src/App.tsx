"use client"

import type React from "react"
import { useState } from "react"
import CampaignDashboard from "./components/campaignDashboard"
import MessageGenerator from "./components/MessageGenerator"
import "./App.css"

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"campaigns" | "messages">("campaigns")

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">OutFlo</h1>
          <span className="app-subtitle">Campaign Management System</span>
        </div>
      </header>

      <main className="app-main">
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === "campaigns" ? "active" : ""}`}
            onClick={() => setActiveTab("campaigns")}
          >
            Campaign Management
          </button>
          <button
            className={`tab-button ${activeTab === "messages" ? "active" : ""}`}
            onClick={() => setActiveTab("messages")}
          >
            Message Generator
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "campaigns" && <CampaignDashboard />}
          {activeTab === "messages" && <MessageGenerator />}
        </div>
      </main>
    </div>
  )
}

export default App

