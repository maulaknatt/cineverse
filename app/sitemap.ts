import { MetadataRoute } from "next";
import { getTrendingMovies } from "@/services/tmdb/movies";
import { getTrendingTV } from "@/services/tmdb/tv";

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cineverse.vercel.app";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/movies`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tv`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/trending`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/movies?sort=popularity.desc`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/movies?sort=vote_average.desc`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/genres`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/ai`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/community`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.6,
    },
  ];

  let movieRoutes: MetadataRoute.Sitemap = [];
  let tvRoutes: MetadataRoute.Sitemap = [];

  try {
    const trendingMovies = await getTrendingMovies("week");
    movieRoutes = (trendingMovies.results || []).slice(0, 30).map((movie) => {
      const slug = slugify(movie.title);
      return {
        url: `${baseUrl}/movies/${movie.id}-${slug}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      };
    });
  } catch (err) {
    console.error("Failed to fetch trending movies for sitemap:", err);
  }

  try {
    const trendingTV = await getTrendingTV("week");
    tvRoutes = (trendingTV.results || []).slice(0, 30).map((show) => {
      const slug = slugify(show.name);
      return {
        url: `${baseUrl}/tv/${show.id}-${slug}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      };
    });
  } catch (err) {
    console.error("Failed to fetch trending TV for sitemap:", err);
  }

  return [...staticRoutes, ...movieRoutes, ...tvRoutes];
}
