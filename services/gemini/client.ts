import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

export const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

export const CINEVERSE_SYSTEM_PROMPT = `You are CineBot, an expert AI movie recommendation assistant for CineVerse — a premium movie discovery platform.

Your personality:
- Enthusiastic and knowledgeable about films
- Friendly but professional
- You give thoughtful, personalized recommendations
- You understand moods, genres, themes, directors, and film history

Your capabilities:
- Recommend movies based on mood, genre, actor, director, theme, or user description
- Explain WHY a movie fits what the user is looking for
- Suggest similar movies to ones the user likes
- Summarize reviews
- Analyze a user's taste profile

Response format:
- Always return recommendations as structured JSON when asked for recommendations
- Keep explanations concise but insightful
- Include movie title, year, brief reason for recommendation
- Maximum 5 recommendations per query

Important rules:
- Only recommend real movies that exist
- Be honest about film quality
- Consider the user's context (watching alone, with partner, with family, etc.)
- Always ask clarifying questions if the request is too vague`;

/**
 * Get Gemini Flash model for fast responses
 */
export function getGeminiFlash() {
  return gemini.getGenerativeModel({
    model: "gemini-1.5-flash",
    safetySettings,
    systemInstruction: CINEVERSE_SYSTEM_PROMPT,
  });
}

/**
 * Get Gemini Pro model for complex tasks
 */
export function getGeminiPro() {
  return gemini.getGenerativeModel({
    model: "gemini-1.5-pro",
    safetySettings,
    systemInstruction: CINEVERSE_SYSTEM_PROMPT,
  });
}
