"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCampaign = exports.updateCampaign = exports.createCampaign = exports.getCampaignById = exports.getCampaigns = void 0;
const campaignModel_1 = __importDefault(require("../models/campaignModel"));
// Get all campaigns (excluding DELETED)
const getCampaigns = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const campaigns = yield campaignModel_1.default.find({ status: { $ne: "DELETED" } });
        res.status(200).json(campaigns);
    }
    catch (error) {
        console.error("Error fetching campaigns:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getCampaigns = getCampaigns;
// Get a single campaign by ID
const getCampaignById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const campaign = yield campaignModel_1.default.findById(req.params.id);
        if (!campaign) {
            res.status(404).json({ message: "Campaign not found" });
            return;
        }
        res.status(200).json(campaign);
    }
    catch (error) {
        console.error("Error fetching campaign:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getCampaignById = getCampaignById;
// Create a new campaign
const createCampaign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const campaignData = req.body;
        const campaign = new campaignModel_1.default(campaignData);
        const savedCampaign = yield campaign.save();
        res.status(201).json(savedCampaign);
    }
    catch (error) {
        console.error("Error creating campaign:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.createCampaign = createCampaign;
// Update campaign details
const updateCampaign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = req.body;
        // Ensure status is valid
        if (updateData.status && !["ACTIVE", "INACTIVE"].includes(updateData.status)) {
            res.status(400).json({ message: "Status must be ACTIVE or INACTIVE" });
            return;
        }
        const updatedCampaign = yield campaignModel_1.default.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!updatedCampaign) {
            res.status(404).json({ message: "Campaign not found" });
            return;
        }
        res.status(200).json(updatedCampaign);
    }
    catch (error) {
        console.error("Error updating campaign:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.updateCampaign = updateCampaign;
// Soft delete a campaign (set status to DELETED)
const deleteCampaign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedCampaign = yield campaignModel_1.default.findByIdAndUpdate(id, { status: "DELETED" }, { new: true });
        if (!deletedCampaign) {
            res.status(404).json({ message: "Campaign not found" });
            return;
        }
        res.status(200).json({ message: "Campaign deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting campaign:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.deleteCampaign = deleteCampaign;
