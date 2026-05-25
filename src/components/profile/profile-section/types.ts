import type { ReactNode } from "react";

export interface ProfileSectionProps {
  title: string;
  iconSrc: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}
