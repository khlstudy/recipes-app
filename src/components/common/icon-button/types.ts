import type { ButtonHTMLAttributes } from "react";
import type { IconName } from "./utils.ts";

export type IconSize = "small" | "medium";

export type IconButtonProps = {
  iconName: IconName;
  onClick?: () => void;
  size?: IconSize;
} & ButtonHTMLAttributes<HTMLButtonElement>;
