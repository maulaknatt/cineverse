"use client";

import { useEffect, useRef, useState } from "react";

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
}

/**
 * Infinite scroll using IntersectionObserver
 * Returns a ref to attach to the sentinel element
 */
export function useInfiniteScroll(
  callback: () => void,
  hasNextPage: boolean,
  options: UseInfiniteScrollOptions = {}
) {
  const { threshold = 0.1, rootMargin = "0px 0px 200px 0px" } = options;
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!sentinelRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          setIsLoading(true);
          callback();
          // Reset loading after a short delay to prevent double-firing
          setTimeout(() => setIsLoading(false), 500);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(sentinelRef.current);

    return () => {
      observer.disconnect();
    };
  }, [callback, hasNextPage, isLoading, threshold, rootMargin]);

  return { sentinelRef, isLoading };
}
