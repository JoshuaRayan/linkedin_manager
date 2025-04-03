"use client"

import type React from "react"
import { useState } from "react"
import type { LinkedInProfile, LinkedInResponse } from "../types"
import "./messageGenerator.css"
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";


const MessageGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"manual" | "url">("manual")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [manualProfile, setManualProfile] = useState<LinkedInProfile>({
    name: "John Doe",
    job_title: "Software Engineer",
    company: "TechCorp",
    location: "San Francisco, CA",
    summary: "Experienced in AI & ML with 5+ years of experience building scalable applications.",
  })

  const [linkedinUrl, setLinkedinUrl] = useState<string>("https://linkedin.com/in/johndoe")
  const [scrapedProfile, setScrapedProfile] = useState<LinkedInProfile | null>(null)

  const [generatedMessage, setGeneratedMessage] = useState<string>("")

  const handleManualProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target
    setManualProfile({ ...manualProfile, [name]: value })
  }

  const handleManualGenerate = async (): Promise<void> => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/personalized-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(manualProfile),
      })

      if (!response.ok) throw new Error("Failed to generate message")

      const data = await response.json()
      setGeneratedMessage(data.message)
    } catch (error) {
      console.error("Error generating message:", error)
      alert("Failed to generate personalized message. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUrlGenerate = async (): Promise<void> => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/personalized-message/url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkedin_url: linkedinUrl }),
      })

      if (!response.ok) throw new Error("Failed to generate message")

      const data: LinkedInResponse = await response.json()
      setScrapedProfile({
        name: data.name,
        job_title: data.job_title,
        company: data.company,
        location: data.location,
        summary: data.summary,
      })
      setGeneratedMessage(data.message)
    } catch (error) {
      console.error("Error generating message from URL:", error)
      alert("Failed to scrape LinkedIn profile or generate message. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (): void => {
    navigator.clipboard.writeText(generatedMessage)
    alert("Message copied to clipboard")
  }

  return (
    <div className="message-generator">
      <div className="message-card">
        <div className="message-card-header">
          <h2 className="message-card-title">LinkedIn Message Generator</h2>
        </div>
        <div className="message-card-body">
          <div className="message-tabs">
            <button
              className={`message-tab ${activeTab === "manual" ? "active" : ""}`}
              onClick={() => setActiveTab("manual")}
            >
              Manual Input
            </button>
            
          </div>

          <div className="message-tab-content">
            {activeTab === "manual" && (
              <div className="manual-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="name">
                      Name
                    </label>
                    <input
                      className="form-input"
                      id="name"
                      name="name"
                      value={manualProfile.name}
                      onChange={handleManualProfileChange}
                      placeholder="Enter name"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="job_title">
                      Job Title
                    </label>
                    <input
                      className="form-input"
                      id="job_title"
                      name="job_title"
                      value={manualProfile.job_title}
                      onChange={handleManualProfileChange}
                      placeholder="Enter job title"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="company">
                      Company
                    </label>
                    <input
                      className="form-input"
                      id="company"
                      name="company"
                      value={manualProfile.company}
                      onChange={handleManualProfileChange}
                      placeholder="Enter company"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="location">
                      Location
                    </label>
                    <input
                      className="form-input"
                      id="location"
                      name="location"
                      value={manualProfile.location}
                      onChange={handleManualProfileChange}
                      placeholder="Enter location"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="summary">
                    Profile Summary
                  </label>
                  <textarea
                    className="form-textarea"
                    id="summary"
                    name="summary"
                    value={manualProfile.summary}
                    onChange={handleManualProfileChange}
                    placeholder="Enter profile summary"
                    rows={3}
                  />
                </div>

                <button className="btn btn-primary w-full" onClick={handleManualGenerate} disabled={isLoading}>
                  {isLoading ? "Generating..." : "Generate Personalized Message"}
                </button>
              </div>
            )}

            {activeTab === "url" && (
              <div className="url-form">
                <div className="form-group">
                  <label className="form-label" htmlFor="linkedin_url">
                    LinkedIn Profile URL
                  </label>
                  <input
                    className="form-input"
                    id="linkedin_url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <button className="btn btn-primary w-full" onClick={handleUrlGenerate} disabled={isLoading}>
                  {isLoading ? "Fetching & Generating..." : "Fetch Profile & Generate Message"}
                </button>

                {scrapedProfile && (
                  <div className="scraped-profile">
                    <h3 className="scraped-profile-title">Scraped Profile Data:</h3>
                    <p>
                      <strong>Name:</strong> {scrapedProfile.name}
                    </p>
                    <p>
                      <strong>Job Title:</strong> {scrapedProfile.job_title}
                    </p>
                    <p>
                      <strong>Company:</strong> {scrapedProfile.company}
                    </p>
                    <p>
                      <strong>Location:</strong> {scrapedProfile.location}
                    </p>
                    <p>
                      <strong>Summary:</strong> {scrapedProfile.summary}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {generatedMessage && (
            <div className="generated-message-container">
              <h3 className="generated-message-title">Generated Message:</h3>
              <div className="generated-message">
                <p className="message-text">{generatedMessage}</p>
              </div>
              <div className="message-actions">
                <button className="btn btn-secondary" onClick={copyToClipboard}>
                  Copy to Clipboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MessageGenerator

