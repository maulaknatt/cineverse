import { notFound, permanentRedirect } from "next/navigation";
import { searchMoviesOnly } from "@/services/tmdb/search";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export default async function MovieSlugRedirectPage({ params }: PageProps) {
  const { slug } = await params;
  const decodedQuery = decodeURIComponent(slug).replace(/-/g, " ");

  try {
    const results = await searchMoviesOnly(decodedQuery);
    const movie = results.results?.[0];

    if (!movie) {
      notFound();
    }

    const prettySlug = slugify(movie.title);
    permanentRedirect(`/movies/${movie.id}-${prettySlug}`);
  } catch (err) {
    // If it's a redirect exception, let Next.js handle it
    if ((err as any).digest?.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
    console.error("Movie redirect page error:", err);
    notFound();
  }
}
