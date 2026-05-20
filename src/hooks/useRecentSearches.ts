import { useCallback, useState } from "react";

import type { UseRecentSearchesResult } from "./types";
import { MAX_RECENT_SEARCHES, RECENT_SEARCHES_KEY } from "./utils";

function loadRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : null;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

export function useRecentSearches(): UseRecentSearchesResult {
  const [recentSearches, setRecentSearches] =
    useState<string[]>(loadRecentSearches);

  const persist = useCallback((searches: string[]) => {
    setRecentSearches(searches);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
    } catch {
      // localStorage unavailable — keep in-memory state only
    }
  }, []);

  const addRecentSearch = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const deduped = prev.filter(
        (item) => item.toLowerCase() !== trimmed.toLowerCase()
      );
      const next = [trimmed, ...deduped].slice(0, MAX_RECENT_SEARCHES);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
      } catch {
        // localStorage unavailable — keep in-memory state only
      }
      return next;
    });
  }, []);

  const clearRecentSearches = useCallback(() => persist([]), [persist]);

  return { recentSearches, addRecentSearch, clearRecentSearches };
}
