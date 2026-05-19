import { useState } from "react";

import type { ApiState, UseApiReturn } from "./types";

const INITIAL_STATE = { data: null, loading: false, error: null };

export const useApi = <T>(): UseApiReturn<T> => {
  const [state, setState] = useState<ApiState<T>>(INITIAL_STATE);

  const execute = async (fetcher: () => Promise<T>): Promise<T | null> => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await fetcher();
      setState({ data, loading: false, error: null });
      return data;
    } catch (err) {
      const error = err instanceof Error ? err.message : "Unknown error";
      setState({ data: null, loading: false, error });
      return null;
    }
  };

  const reset = () => setState(INITIAL_STATE);

  return { ...state, execute, reset };
};
