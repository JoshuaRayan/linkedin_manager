import type { Request, Response } from "express"
import Campaign, { type ICampaign } from "../models/campaignModel"

// Get all campaigns (excluding DELETED)
export const getCampaigns = async (req: Request, res: Response): Promise<void> => {
  try {
    const campaigns = await Campaign.find({ status: { $ne: "DELETED" } })
    res.status(200).json(campaigns)
  } catch (error) {
    console.error("Error fetching campaigns:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Get a single campaign by ID
export const getCampaignById = async (req: Request, res: Response): Promise<void> => {
  try {
    const campaign = await Campaign.findById(req.params.id)

    if (!campaign) {
      res.status(404).json({ message: "Campaign not found" })
      return
    }

    res.status(200).json(campaign)
  } catch (error) {
    console.error("Error fetching campaign:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Create a new campaign
export const createCampaign = async (req: Request, res: Response): Promise<void> => {
  try {
    const campaignData: ICampaign = req.body
    const campaign = new Campaign(campaignData)
    const savedCampaign = await campaign.save()

    res.status(201).json(savedCampaign)
  } catch (error) {
    console.error("Error creating campaign:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Update campaign details
export const updateCampaign = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const updateData = req.body

    // Ensure status is valid
    if (updateData.status && !["ACTIVE", "INACTIVE"].includes(updateData.status)) {
      res.status(400).json({ message: "Status must be ACTIVE or INACTIVE" })
      return
    }

    const updatedCampaign = await Campaign.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })

    if (!updatedCampaign) {
      res.status(404).json({ message: "Campaign not found" })
      return
    }

    res.status(200).json(updatedCampaign)
  } catch (error) {
    console.error("Error updating campaign:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Soft delete a campaign (set status to DELETED)
export const deleteCampaign = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const deletedCampaign = await Campaign.findByIdAndUpdate(id, { status: "DELETED" }, { new: true })

    if (!deletedCampaign) {
      res.status(404).json({ message: "Campaign not found" })
      return
    }

    res.status(200).json({ message: "Campaign deleted successfully" })
  } catch (error) {
    console.error("Error deleting campaign:", error)
    res.status(500).json({ message: "Server error" })
  }
}

