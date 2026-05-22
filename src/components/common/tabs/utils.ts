export function getNextTabIndex(
  key: string,
  currentIndex: number,
  total: number
): number | null {
  switch (key) {
    case "ArrowRight":
    case "ArrowDown":
      return (currentIndex + 1) % total;
    case "ArrowLeft":
    case "ArrowUp":
      return (currentIndex - 1 + total) % total;
    case "Home":
      return 0;
    case "End":
      return total - 1;
    default:
      return null;
  }
}
