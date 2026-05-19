import type { CSSProperties } from "react";
import { Link } from "react-router";

import { classNames } from "../../../utils/classNames";
import type { NavLinkProps } from "./types";
import styles from "./NavLink.module.scss";

const NavLink = ({ to, label, isActive, onClick, badge }: NavLinkProps) => (
  <Link
    to={to}
    onClick={onClick}
    className={classNames(
      styles.nav__link,
      isActive ? styles["nav__link--active"] : null,
      badge != null && badge > 0 ? styles["nav__link--badged"] : null
    )}
    style={
      badge != null && badge > 0
        ? ({ "--badge": `"${badge}"` } as CSSProperties)
        : undefined
    }>
    {label}
  </Link>
);

export default NavLink;
