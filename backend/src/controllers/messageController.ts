import type { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

interface LinkedInProfile {
  name: string;
  job_title: string;
  company: string;
  location: string;
  summary: string;
}

// Generate personalized message from LinkedIn profile data
export const generatePersonalizedMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const profileData: LinkedInProfile = req.body;

    // Validate required fields
    if (!profileData.name || !profileData.job_title || !profileData.company) {
      res.status(400).json({ message: "Name, job title, and company are required" });
      return;
    }

    // Generate message using Gemini API
    const message = await generateAIMessage(profileData);

    res.status(200).json({ message });
  } catch (error) {
    console.error("Error generating personalized message:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Helper function to generate message using Gemini API
async function generateAIMessage(profile: LinkedInProfile): Promise<string> {
  
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Gemini API key is missing");

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [{
        parts: [{
          text: `Generate a professional and engaging outreach message for a LinkedIn profile. Name: ${profile.name} Job Title: ${profile.job_title} Company: ${profile.company} Location: ${profile.location} Summary: ${profile.summary} The message should be friendly, professional, and highlight how OutFlo (an AI-powered outreach tool) can enhance their sales process and customer meetings.`
        }]
      }]
    };
  
    try {
      const response = await axios.post(apiUrl, requestBody, {
        headers: { 'Content-Type': 'application/json' }
      });
  
    return response.data.candidates?.[0]?.content?.parts?.[0]?.text || generateTemplateMessage(profile);
  } catch (error: any) {
    console.error("Error calling Gemini API:", error.response?.data || error.message);
    return generateTemplateMessage(profile); // Fallback to template message
  }


// Fallback template-based message generator
function generateTemplateMessage(profile: LinkedInProfile): string {
  return `Hey ${profile.name},

I noticed you're working as a ${profile.job_title} at ${profile.company} in ${profile.location}. Your experience with ${extractKeywords(profile.summary)} caught my attention.

OutFlo can help automate your outreach to increase meetings & sales. Our AI-powered platform could save you hours each week on prospecting and follow-ups.

Would you be open to a quick 15-minute call to discuss how we might be able to help your team at ${profile.company}?

Looking forward to connecting!`;
}

// Helper function to extract keywords from summary
function extractKeywords(summary: string): string {
  const keywords = summary
    .split(" ")
    .filter((word) => word.length > 4)
    .slice(0, 3)
    .join(" and ");

  return keywords || "your professional background";
}
}
