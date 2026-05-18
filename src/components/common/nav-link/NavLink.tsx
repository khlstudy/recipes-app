import { Link } from "react-router";

import { classNames } from "../../../utils/classNames";
import type { NavLinkProps } from "./types";
import styles from "./NavLink.module.scss";

const NavLink = ({ to, label, isActive, onClick }: NavLinkProps) => (
  <Link
    to={to}
    onClick={onClick}
    className={classNames(
      styles.nav__link,
      isActive ? styles["nav__link--active"] : null
    )}>
    {label}
  </Link>
);

export default NavLink;
