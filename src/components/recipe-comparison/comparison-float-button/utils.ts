import type { NavigateFunction } from "react-router";

export const navigateToComparison = (navigate: NavigateFunction) => {
  navigate("/recipe-comparison");
};
