import type { SuggestionItem } from "./types";

export const DEFAULT_MAX_VISIBLE = 5;

export const normalizeSuggestion = (
  suggestion: string | SuggestionItem
): SuggestionItem =>
  typeof suggestion === "string" ? { value: suggestion } : suggestion;

export const getSuggestionKey = ({ value, type }: SuggestionItem): string =>
  `${type ?? ""}:${value}`;
