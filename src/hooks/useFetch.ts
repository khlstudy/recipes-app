import { useState, useEffect, useCallback, useRef } from "react";

import { apiClient, type RequestOptions } from "../api/client";
import type { UseFetchResult } from "./types";

export function useFetch<T>(
  path: string | null,
  options?: RequestOptions
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!!path);
  const [error, setError] = useState<string | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const execute = useCallback(
    async (p: string, opts?: RequestOptions): Promise<T> => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiClient<T>(p, opts ?? optionsRef.current ?? {});
        setData(result);
        return result;
      } catch (e: unknown) {
        const msg =
          e !== null && typeof e === "object" && "message" in e
            ? String((e as { message: unknown }).message)
            : "Request failed";
        setError(msg);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const refetch = useCallback(() => {
    if (path) execute(path, optionsRef.current);
  }, [path, execute]);

  useEffect(() => {
    if (path) execute(path, optionsRef.current);
  }, [path]);

  return { data, loading, error, refetch, execute };
}
