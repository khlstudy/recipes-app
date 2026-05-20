import { createContext, useCallback, useContext, useRef } from "react";
import type { ReactNode } from "react";

import type { SearchFocusContextValue } from "./types";

const SearchFocusContext = createContext<SearchFocusContextValue | null>(null);

export const SearchFocusProvider = ({ children }: { children: ReactNode }) => {
  const focusRef = useRef<(() => void) | null>(null);

  const registerSearch = useCallback((focus: (() => void) | null) => {
    focusRef.current = focus;
  }, []);

  const focusSearch = useCallback(() => {
    focusRef.current?.();
  }, []);

  return (
    <SearchFocusContext.Provider value={{ registerSearch, focusSearch }}>
      {children}
    </SearchFocusContext.Provider>
  );
};

export const useSearchFocusContext = (): SearchFocusContextValue => {
  const ctx = useContext(SearchFocusContext);
  if (!ctx)
    throw new Error(
      "useSearchFocusContext must be used within SearchFocusProvider"
    );
  return ctx;
};
