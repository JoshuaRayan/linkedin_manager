"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const campaignController_1 = require("../controllers/campaignController");
const router = (0, express_1.Router)();
// GET all campaigns
router.get('/', campaignController_1.getCampaigns);
// POST a new campaign
router.post('/', campaignController_1.createCampaign);
// PUT (update) a campaign
router.put('/:id', campaignController_1.updateCampaign);
// DELETE (soft delete) a campaign
router.delete('/:id', campaignController_1.deleteCampaign);
exports.default = router;
