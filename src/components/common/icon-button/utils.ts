import logoIcon from "../../../assets/images/icons/logo.svg";
import profileIcon from "../../../assets/images/icons/profile.svg";
import searchIcon from "../../../assets/images/icons/search.svg";

export const ICONS = {
  logo: logoIcon,
  profile: profileIcon,
  search: searchIcon,
} as const;

export type IconName = keyof typeof ICONS;
