import { notFound, permanentRedirect } from "next/navigation";
import { searchTVOnly } from "@/services/tmdb/search";

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

export default async function TVShowSlugRedirectPage({ params }: PageProps) {
  const { slug } = await params;
  const decodedQuery = decodeURIComponent(slug).replace(/-/g, " ");

  try {
    const results = await searchTVOnly(decodedQuery);
    const show = results.results?.[0];

    if (!show) {
      notFound();
    }

    const prettySlug = slugify(show.name);
    permanentRedirect(`/tv/${show.id}-${prettySlug}`);
  } catch (err) {
    // If it's a redirect exception, let Next.js handle it
    if ((err as any).digest?.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
    console.error("TV show redirect page error:", err);
    notFound();
  }
}
