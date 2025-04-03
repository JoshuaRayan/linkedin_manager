"use client"

import type React from "react"
import { useState, useEffect } from "react"
import CampaignForm from "./CampaignForm"
import type { Campaign } from "../types"
import "./campaignDashboard.css"

const CampaignDashboard: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)

  useEffect(() => {
    fetchCampaigns()
  }, [])
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
  const fetchCampaigns = async (): Promise<void> => {
    setIsLoading(true);
    try {
        const response = await fetch(`${API_BASE_URL}/api/campaigns`);
        if (!response.ok) {
          throw new Error(`Failed to fetch campaigns: ${response.statusText}`);
        }
      const data = await response.json();
      setCampaigns(data);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      alert("Failed to load campaigns. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleStatusToggle = async (campaign: Campaign): Promise<void> => {
    const newStatus = campaign.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
    try {
      const response = await fetch(`${API_BASE_URL}/api/campaigns/${campaign._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...campaign, status: newStatus }),
      })

      if (!response.ok) throw new Error("Failed to update campaign status")

      setCampaigns(campaigns.map((c) => (c._id === campaign._id ? { ...c, status: newStatus } : c)))

      alert(`Campaign status updated to ${newStatus}`)
    } catch (error) {
      console.error("Error updating campaign status:", error)
      alert("Failed to update campaign status. Please try again.")
    }
  }

  const handleDelete = async (id: string): Promise<void> => {
    if (!window.confirm("Are you sure you want to delete this campaign?")) return

    try {
      const response = await fetch(`${API_BASE_URL}/api/campaigns/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete campaign")

      // Remove from UI
      setCampaigns(campaigns.filter((c) => c._id !== id))

      alert("Campaign deleted successfully")
    } catch (error) {
      console.error("Error deleting campaign:", error)
      alert("Failed to delete campaign. Please try again.")
    }
  }

  const handleEdit = (campaign: Campaign): void => {
    setEditingCampaign(campaign)
    setShowForm(true)
  }

  const handleFormSubmit = async (campaign: Campaign): Promise<void> => {
    try {
      const isEditing = !!campaign._id;
      const url = isEditing ? `${API_BASE_URL}/api/campaigns/${campaign._id}` : `${API_BASE_URL}/api/campaigns`;
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campaign),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? "update" : "create"} campaign: ${response.statusText}`);
      }

      const savedCampaign = await response.json();

      if (isEditing) {
        setCampaigns(campaigns.map((c) => (c._id === campaign._id ? savedCampaign : c)));
      } else {
        setCampaigns([...campaigns, savedCampaign]);
      }

      setShowForm(false);
      setEditingCampaign(null);

      alert(`Campaign ${isEditing ? "updated" : "created"} successfully`);
    } catch (error) {
      console.error(`Error ${editingCampaign ? "updating" : "creating"} campaign:`, error);
      alert(`Failed to ${editingCampaign ? "update" : "create"} campaign. Please try again.`);
    }
  };

  const handleFormCancel = (): void => {
    setShowForm(false)
    setEditingCampaign(null)
  }

  if (showForm) {
    return <CampaignForm campaign={editingCampaign} onSubmit={handleFormSubmit} onCancel={handleFormCancel} />
  }

  return (
    <div className="campaign-dashboard">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Campaigns</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + New Campaign
        </button>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : campaigns.length === 0 ? (
        <div className="empty-state">
          <p>No campaigns found. Create your first campaign!</p>
        </div>
      ) : (
        <div className="campaign-grid">
          {campaigns.map((campaign) => (
            <div key={campaign._id} className="campaign-card">
              <div className="campaign-card-body">
                <div className="campaign-card-header">
                  <h3 className="campaign-name">{campaign.name}</h3>
                  <div className="status-toggle">
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={campaign.status === "ACTIVE"}
                        onChange={() => handleStatusToggle(campaign)}
                      />
                      <span className="slider"></span>
                    </label>
                    <span className={`status-text ${campaign.status === "ACTIVE" ? "text-success" : "text-gray"}`}>
                      {campaign.status}
                    </span>
                  </div>
                </div>
                <p className="campaign-description">{campaign.description}</p>
                <div className="campaign-stats">
                  <p>Leads: {campaign.leads.length}</p>
                  <p>Accounts: {campaign.accountIDs.length}</p>
                </div>
              </div>
              <div className="campaign-card-footer">
                <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(campaign)}>
                  Edit
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(campaign._id as string)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CampaignDashboard

