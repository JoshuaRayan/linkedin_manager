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
exports.generatePersonalizedMessage = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Generate personalized message from LinkedIn profile data
const generatePersonalizedMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profileData = req.body;
        // Validate required fields
        if (!profileData.name || !profileData.job_title || !profileData.company) {
            res.status(400).json({ message: "Name, job title, and company are required" });
            return;
        }
        // Generate message using Gemini API
        const message = yield generateAIMessage(profileData);
        res.status(200).json({ message });
    }
    catch (error) {
        console.error("Error generating personalized message:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.generatePersonalizedMessage = generatePersonalizedMessage;
// Helper function to generate message using Gemini API
function generateAIMessage(profile) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey)
            throw new Error("Gemini API key is missing");
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        const requestBody = {
            contents: [{
                    parts: [{
                            text: `Generate a professional and engaging outreach message for a LinkedIn profile. Name: ${profile.name} Job Title: ${profile.job_title} Company: ${profile.company} Location: ${profile.location} Summary: ${profile.summary} The message should be friendly, professional, and highlight how OutFlo (an AI-powered outreach tool) can enhance their sales process and customer meetings.`
                        }]
                }]
        };
        try {
            const response = yield axios_1.default.post(apiUrl, requestBody, {
                headers: { 'Content-Type': 'application/json' }
            });
            return ((_e = (_d = (_c = (_b = (_a = response.data.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.parts) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.text) || generateTemplateMessage(profile);
        }
        catch (error) {
            console.error("Error calling Gemini API:", ((_f = error.response) === null || _f === void 0 ? void 0 : _f.data) || error.message);
            return generateTemplateMessage(profile); // Fallback to template message
        }
        // Fallback template-based message generator
        function generateTemplateMessage(profile) {
            return `Hey ${profile.name},

I noticed you're working as a ${profile.job_title} at ${profile.company} in ${profile.location}. Your experience with ${extractKeywords(profile.summary)} caught my attention.

OutFlo can help automate your outreach to increase meetings & sales. Our AI-powered platform could save you hours each week on prospecting and follow-ups.

Would you be open to a quick 15-minute call to discuss how we might be able to help your team at ${profile.company}?

Looking forward to connecting!`;
        }
        // Helper function to extract keywords from summary
        function extractKeywords(summary) {
            const keywords = summary
                .split(" ")
                .filter((word) => word.length > 4)
                .slice(0, 3)
                .join(" and ");
            return keywords || "your professional background";
        }
    });
}
