import { NextRequest, NextResponse } from "next/server";
import { getGeminiFlash } from "@/services/gemini/client";

export async function POST(req: NextRequest) {
  try {
    const { title, overview, genres } = await req.json();

    if (!title || !overview) {
      return NextResponse.json(
        { error: "Title and overview are required" },
        { status: 400 }
      );
    }

    const model = getGeminiFlash();

    const prompt = `
Based on the movie/TV show titled "${title}" with this overview: "${overview}" and genres: "${genres || "N/A"}".
Recommend exactly 3 similar movies/series.
For each recommendation, provide:
1. Title
2. Year (integer)
3. Genre
4. Reason: A brief explanation (1-2 sentences) of why it is similar and why the user would like it.
5. tmdb_search_query: The exact search query to find this movie (e.g. "Inception 2010").

Return your response as a JSON array with this structure:
[
  {
    "title": "Movie/Series Title",
    "year": 2023,
    "genre": "Sci-Fi",
    "reason": "Reason for recommendation",
    "tmdb_search_query": "Movie/Series Title 2023"
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
    console.error("AI Similar Recommendation error:", error);
    return NextResponse.json(
      { error: "Failed to get AI similar recommendations" },
      { status: 500 }
    );
  }
}
