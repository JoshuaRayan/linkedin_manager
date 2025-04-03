import { Router } from 'express';
import { createCampaign, deleteCampaign, getCampaigns, updateCampaign } from '../controllers/campaignController';

const router = Router();

// GET all campaigns
router.get('/', getCampaigns);

// POST a new campaign
router.post('/', createCampaign);

// PUT (update) a campaign
router.put('/:id', updateCampaign);

// DELETE (soft delete) a campaign
router.delete('/:id', deleteCampaign);

export default router;