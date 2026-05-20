import type { ReactNode } from "react";

export interface FilterGroupProps {
  title: string;
  iconSrc?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}
