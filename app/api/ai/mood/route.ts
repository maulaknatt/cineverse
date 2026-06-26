import { NextRequest, NextResponse } from "next/server";
import { getGeminiFlash } from "@/services/gemini/client";

export async function POST(req: NextRequest) {
  try {
    const { mood, additionalContext = "" } = await req.json();

    if (!mood) {
      return NextResponse.json({ error: "Mood is required" }, { status: 400 });
    }

    const model = getGeminiFlash();

    const prompt = `
The user is feeling: ${mood}
${additionalContext ? `Additional context: ${additionalContext}` : ""}

Based on this mood, recommend exactly 5 movies. 
Return your response as a JSON array with this structure:
[
  {
    "title": "Movie Title",
    "year": 2023,
    "reason": "Brief reason why this fits the mood (1-2 sentences)",
    "genre": "Primary genre",
    "tmdb_search_query": "Movie Title 2023"
  }
]

Only return valid JSON, no other text.
    `.trim();

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Could not parse AI response as JSON");
    }

    const recommendations = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error("AI Mood Recommendation error:", error);
    return NextResponse.json(
      { error: "Failed to get mood recommendations" },
      { status: 500 }
    );
  }
}
