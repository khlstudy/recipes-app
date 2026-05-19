import { createContext, useContext } from "react";
import type { ReactNode } from "react";

import { useComparison } from "../hooks/useComparison";
import type { UseComparisonResult } from "../hooks/types";

const ComparisonContext = createContext<UseComparisonResult | null>(null);

export const ComparisonProvider = ({ children }: { children: ReactNode }) => {
  const comparison = useComparison();
  return (
    <ComparisonContext.Provider value={comparison}>
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparisonContext = (): UseComparisonResult => {
  const ctx = useContext(ComparisonContext);
  if (!ctx)
    throw new Error(
      "useComparisonContext must be used within ComparisonProvider"
    );
  return ctx;
};
