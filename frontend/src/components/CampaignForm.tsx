"use client"

import type React from "react"
import { useState } from "react"
import type { Campaign } from "../types"
import "./campaignForm.css"

interface CampaignFormProps {
  campaign: Campaign | null
  onSubmit: (campaign: Campaign) => void
  onCancel: () => void
}


const CampaignForm: React.FC<CampaignFormProps> = ({ campaign, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Campaign>({
    _id: campaign?._id || undefined,
    name: campaign?.name || "",
    description: campaign?.description || "",
    status: campaign?.status || "ACTIVE",
    leads: campaign?.leads || [],
    accountIDs: campaign?.accountIDs || [],
  })

  const [leadsInput, setLeadsInput] = useState<string>(campaign?.leads.join("\n") || "")
  const [accountsInput, setAccountsInput] = useState<string>(campaign?.accountIDs.join("\n") || "")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, status: e.target.value as "ACTIVE" | "INACTIVE" | "DELETED" })
  }

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()

    // Process leads and accountIDs from textarea inputs
    const leads = leadsInput.split("\n").filter((lead) => lead.trim() !== "")
    const accountIDs = accountsInput.split("\n").filter((id) => id.trim() !== "")

    onSubmit({
      ...formData,
      leads,
      accountIDs,
    })
  }

  return (
    <div className="campaign-form-container">
      <div className="campaign-form-card">
        <div className="campaign-form-header">
          <button className="btn-back" onClick={onCancel}>
            ← Back
          </button>
          <h2 className="campaign-form-title">{campaign ? "Edit Campaign" : "Create New Campaign"}</h2>
        </div>
        <div className="campaign-form-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Campaign Name
              </label>
              <input
                className="form-input"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter campaign name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="description">
                Description
              </label>
              <textarea
                className="form-textarea"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter campaign description"
                rows={3}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <div className="radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="active"
                    name="status"
                    value="ACTIVE"
                    checked={formData.status === "ACTIVE"}
                    onChange={handleStatusChange}
                  />
                  <label htmlFor="active">Active</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="inactive"
                    name="status"
                    value="INACTIVE"
                    checked={formData.status === "INACTIVE"}
                    onChange={handleStatusChange}
                  />
                  <label htmlFor="inactive">Inactive</label>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="leads">
                LinkedIn Leads (one URL per line)
              </label>
              <textarea
                className="form-textarea"
                id="leads"
                value={leadsInput}
                onChange={(e) => setLeadsInput(e.target.value)}
                placeholder="https://linkedin.com/in/profile-1
https://linkedin.com/in/profile-2"
                rows={4}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="accountIDs">
                Account IDs (one ID per line)
              </label>
              <textarea
                className="form-textarea"
                id="accountIDs"
                value={accountsInput}
                onChange={(e) => setAccountsInput(e.target.value)}
                placeholder="123
456"
                rows={3}
              />
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={onCancel}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {campaign ? "Update Campaign" : "Create Campaign"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CampaignForm

