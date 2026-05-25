import type { FooterLink } from "./types";

export const FOOTER_LINKS: FooterLink[] = [
  { to: "/", label: "Home" },
  { to: "/catalog", label: "Catalog" },
  { to: "/smart-matcher", label: "Smart Matcher" },
  { to: "/recipe-comparison", label: "Recipe Comparison" },
  { to: "/profile", label: "Profile", authOnly: true },
];
