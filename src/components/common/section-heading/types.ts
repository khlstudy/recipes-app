export type SectionHeadingSize = "sm" | "lg";

export interface SectionHeadingProps {
  title: string;
  iconSrc?: string;
  size?: SectionHeadingSize;
  as?: "h2" | "h3" | "span";
  className?: string;
}
