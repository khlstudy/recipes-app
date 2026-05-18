import { useState, useCallback, useRef } from "react";

import type { UseSearchResult } from "./types";
import { DEBOUNCE_MS } from "./utils";

export function useSearch(): UseSearchResult {
  const [query, setQueryState] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setQuery = useCallback((q: string) => {
    setQueryState(q);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebouncedQuery(q);
    }, DEBOUNCE_MS);
  }, []);

  const clearQuery = useCallback(() => {
    setQueryState("");
    setDebouncedQuery("");
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return { query, setQuery, debouncedQuery, clearQuery };
}
