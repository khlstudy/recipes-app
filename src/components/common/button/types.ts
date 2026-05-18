import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { IconName } from "./utils";

export const BUTTON_VARIANT = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  SUCCESS: "success",
  DANGER: "danger",
  OUTLINE: "outline",
} as const;

export const BUTTON_SIZE = {
  LARGE: "large",
  MEDIUM: "medium",
  SMALL: "small",
} as const;

export type ButtonVariant =
  (typeof BUTTON_VARIANT)[keyof typeof BUTTON_VARIANT];

export type ButtonSize = (typeof BUTTON_SIZE)[keyof typeof BUTTON_SIZE];

export type TextTransform = "capitalize" | "uppercase";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  width?: string;
  textTransform?: TextTransform;
  iconName?: IconName;
  iconPosition?: "left" | "right";
  children: ReactNode;
}
