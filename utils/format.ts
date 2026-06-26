/**
 * Format movie runtime from minutes to "Xh Ym" format
 */
export function formatRuntime(minutes: number | null | undefined): string {
  if (!minutes) return "N/A";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

/**
 * Format a date string to a readable format
 */
export function formatDate(
  dateString: string | null | undefined,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      ...options,
    });
  } catch {
    return "N/A";
  }
}

/**
 * Format year from date string
 */
export function formatYear(dateString: string | null | undefined): string {
  if (!dateString) return "N/A";
  return new Date(dateString).getFullYear().toString();
}

/**
 * Format large money amounts (budget, revenue)
 */
export function formatMoney(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || amount === 0) return "N/A";
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(1)}K`;
  }
  return `$${amount}`;
}

/**
 * Format a number as currency (USD)
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || amount === 0) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format vote average to a display rating (e.g., 7.5 → "7.5")
 */
export function formatRating(rating: number | null | undefined): string {
  if (!rating) return "N/A";
  return rating.toFixed(1);
}

/**
 * Get color class for rating (red/yellow/green)
 */
export function getRatingColor(rating: number): string {
  if (rating >= 7.5) return "text-green-400";
  if (rating >= 6.0) return "text-yellow-400";
  if (rating >= 4.0) return "text-orange-400";
  return "text-red-400";
}

/**
 * Format number with K/M shorthand
 */
export function formatCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toString();
}

/**
 * Get relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks < 4) return `${diffWeeks}w ago`;
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return `${Math.floor(diffMonths / 12)}y ago`;
}

/**
 * Truncate text to a max length
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}
