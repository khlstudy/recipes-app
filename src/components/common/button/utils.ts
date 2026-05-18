import logoIcon from "../../../assets/images/icons/logo.svg";
import profileIcon from "../../../assets/images/icons/profile.svg";

export const ICONS = {
  logo: logoIcon,
  profile: profileIcon,
} as const;

export type IconName = keyof typeof ICONS;
