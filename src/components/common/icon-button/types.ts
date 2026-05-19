import type { ButtonHTMLAttributes } from "react";

export type IconButtonVariant = "default" | "circle" | "action";
export type IconButtonActionType = "edit" | "delete";

export type IconButtonProps = {
  iconSrc: string;
  label: string;
  variant?: IconButtonVariant;
  active?: boolean;
  actionType?: IconButtonActionType;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;
