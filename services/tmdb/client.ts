const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL || "https://api.themoviedb.org/3";

export async function fetchTMDB<T>(
  endpoint: string,
  params: Record<string, string | number | boolean> = {},
  options: RequestInit = {}
): Promise<T> {
  const apiKey = process.env.TMDB_API_KEY;
  const accessToken = process.env.TMDB_ACCESS_TOKEN;

  if (!apiKey && !accessToken) {
    throw new Error("TMDB credentials are not configured in environment variables");
  }

  const urlParams = new URLSearchParams();
  
  if (apiKey && !accessToken) {
    urlParams.append("api_key", apiKey);
  }

  // Add other params
  Object.entries(params).forEach(([key, value]) => {
    urlParams.append(key, String(value));
  });

  const queryString = urlParams.toString();
  const url = `${TMDB_BASE_URL}${endpoint}${queryString ? `?${queryString}` : ""}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  if (options.headers) {
    const customHeaders = new Headers(options.headers);
    customHeaders.forEach((value, key) => {
      headers[key] = value;
    });
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      next: {
        revalidate: options.next?.revalidate ?? 3600, // Default cache 1 hour
      },
    });

    if (!res.ok) {
      throw new Error(`TMDB API Error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data as T;
  } catch (error) {
    console.error(`Failed to fetch TMDB endpoint ${endpoint}:`, error);
    throw error;
  }
}
