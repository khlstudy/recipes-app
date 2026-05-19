import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";

import NavLink from "../nav-link/NavLink";
import Search from "../search/Search";
import IconButton from "../icon-button/IconButton";
import Button from "../button/Button";
import { HEADER_ICONS } from "../icon-button/utils";

import type { NavLinkProps } from "../nav-link/types";

import styles from "./Header.module.scss";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks: NavLinkProps[] = [
    { to: "/", label: "Home", isActive: location.pathname === "/" },
    {
      to: "/catalog",
      label: "Catalog",
      isActive: location.pathname === "/catalog",
    },
    {
      to: "/smart-matcher",
      label: "Smart Matcher",
      isActive: location.pathname === "/smart-matcher",
    },
    {
      to: "/recipe-comparison",
      label: "Recipe Comparison",
      isActive: location.pathname === "/recipe-comparison",
    },
  ];

  const handleLogoClick = () => {
    setTimeout(() => window.location.reload(), 0);
  };

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.header__container}>
        <Link to="/" onClick={handleLogoClick} className={styles.header__logo}>
          <IconButton iconSrc={HEADER_ICONS.logo} label="Logo" />
          <span className={styles.header__logoText}>Recipes app</span>
        </Link>

        <nav
          className={`${styles.header__nav} ${isMenuOpen ? styles["header__nav--open"] : ""}`}>
          {navLinks.map(({ to, label, isActive }) => (
            <NavLink
              key={to}
              to={to}
              label={label}
              isActive={isActive}
              onClick={handleNavClick}
            />
          ))}
        </nav>

        <button
          className={styles.header__burger}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}>
          <span />
          <span />
          <span />
        </button>

        <div className={styles.header__search}>
          <Search onSearch={() => navigate("/catalog")} />
        </div>

        <div className={styles.header__profile}>
          <Button
            iconName="profile"
            iconPosition="left"
            variant="outline"
            width="100px"
            onClick={() => navigate("/profile")}>
            Profile
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
