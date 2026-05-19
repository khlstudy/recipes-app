import type { ReactNode } from "react";

export interface RecipeSectionProps {
  title: string;
  iconSrc?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}
