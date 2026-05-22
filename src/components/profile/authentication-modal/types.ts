import type { FieldValues } from "../../../types/validation";

export const AUTH_TAB = {
  LOGIN: "login",
  SIGNUP: "signup",
} as const;

export type AuthTab = (typeof AUTH_TAB)[keyof typeof AUTH_TAB];

export const AUTH_FIELD_KEYS = ["name", "email", "password"] as const;

export type AuthFieldKey = (typeof AUTH_FIELD_KEYS)[number];

export type AuthFormValues = Record<AuthFieldKey, string> & FieldValues;

export interface AuthFieldSchema {
  key: AuthFieldKey;
  label: string;
  type: "text" | "email" | "password";
  placeholder: string;
  autoComplete: string;
  caption: string;
}

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}
