import express from "express"
import { generatePersonalizedMessage} from "../controllers/messageController"

const router = express.Router()

// POST /api/personalized-message - Generate message from profile data
router.post("/", generatePersonalizedMessage)



export default router

