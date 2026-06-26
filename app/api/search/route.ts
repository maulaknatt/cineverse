import { NextResponse } from "next/server";
import { searchMulti } from "@/services/tmdb/search";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";
  const page = Number(searchParams.get("page") || 1);

  if (!query.trim()) {
    return NextResponse.json({ results: [], total_results: 0, total_pages: 0 });
  }

  try {
    const data = await searchMulti(query, page);

    // Filter out people (actors/directors) for cleaner results
    const results = data.results.filter(
      (item) => item.media_type === "movie" || item.media_type === "tv"
    );

    return NextResponse.json({ ...data, results });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Failed to search" },
      { status: 500 }
    );
  }
}
