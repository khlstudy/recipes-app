import cancelIcon from "../../../assets/images/icons/cancel.svg";

export const CHIP_REMOVE_ICON = cancelIcon;

export const MAX_CHIP_SUGGESTIONS = 8;

export const matchChipSuggestions = (
  suggestions: string[],
  selected: string[],
  query: string
): string[] => {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const taken = new Set(selected.map((value) => value.toLowerCase()));
  return suggestions
    .filter(
      (value) =>
        !taken.has(value.toLowerCase()) && value.toLowerCase().includes(q)
    )
    .slice(0, MAX_CHIP_SUGGESTIONS);
};
