import type { AuthUser } from "../../../types";

export const ROLE_LABEL: Record<AuthUser["role"], string> = {
  admin: "Administrator",
  user: "Member",
} as const;

export const IDENTITY_FIELDS = [
  {
    key: "name" as const,
    label: "Name",
    type: "text",
    placeholder: "Your name",
    caption: "Letters only",
    autoComplete: "name",
  },
  {
    key: "email" as const,
    label: "Email",
    type: "email",
    placeholder: "name@domain.com",
    caption: "E.g. name@domain.com",
    autoComplete: "email",
  },
];

export const getInitials = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
