export const formatDate = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

export const getInitial = (name?: string): string => {
  if (!name) return "?";
  return name.trim().charAt(0).toUpperCase() || "?";
};

export const STARS = [1, 2, 3, 4, 5] as const;
