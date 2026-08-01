import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Property from "../models/Property.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

const getModel = () => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({ model: "gemini-flash-latest" });
};

// @route POST /api/ai/generate-description  (agent only)
router.post("/generate-description", protect, authorize("agent", "admin"), async (req, res) => {
  try {
    const { title, propertyType, listingType, bedrooms, bathrooms, area, city, amenities } = req.body;

    const model = getModel();
    const prompt = `Write a professional, appealing real estate listing description (max 120 words) for the following property. Do not use markdown formatting, just plain text paragraphs.

Title: ${title}
Type: ${propertyType}
For: ${listingType}
Bedrooms: ${bedrooms}
Bathrooms: ${bathrooms}
Area: ${area} sq.ft
City: ${city}
Amenities: ${(amenities || []).join(", ")}

Make it warm, persuasive, and highlight the best features.`;

    const result = await model.generateContent(prompt);
    const description = result.response.text();

    res.json({ description });
  } catch (error) {
    res.status(500).json({ message: "AI generation failed", error: error.message });
  }
});

// @route POST /api/ai/chat  (public chatbot for property search assistance)
router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    // Fetch a sample of approved properties to ground the AI's suggestions
    const properties = await Property.find({ status: "approved" })
      .select("title city price listingType propertyType bedrooms")
      .limit(30);

    const model = getModel();
    const prompt = `You are a helpful real estate assistant for a property listing website. A user asked: "${message}"

Here is a sample of currently available properties (JSON):
${JSON.stringify(properties)}

Based on the user's query, suggest 1-3 relevant properties from the list above by title, and briefly explain why they match. If nothing matches well, say so politely and suggest they browse all listings or refine their search. Keep the reply under 80 words, plain text, no markdown.`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    res.json({ reply });
  } catch (error) {
    res.status(500).json({ message: "AI chat failed", error: error.message });
  }
});

export default router;
