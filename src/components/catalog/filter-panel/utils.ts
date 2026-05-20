export const toggleValue = <T>(
  values: T[],
  value: T,
  mode: "toggle" | "add" = "toggle"
): T[] => {
  if (values.includes(value)) {
    return mode === "add" ? values : values.filter((v) => v !== value);
  }
  return [...values, value];
};
