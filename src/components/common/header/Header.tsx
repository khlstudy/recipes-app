import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";

import NavLink from "../nav-link/NavLink";
import Search from "../search/Search";
import IconButton from "../icon-button/IconButton";
import Button from "../button/Button";
import { HEADER_ICONS } from "../icon-button/utils";
import { useComparisonContext } from "../../../context/ComparisonContext";
import { useAuthContext } from "../../../context/AuthContext";
import { useSearchFocusContext } from "../../../context/SearchFocusContext";
import { useFetch } from "../../../hooks/useFetch";
import { useRecentSearches } from "../../../hooks/useRecentSearches";
import { ENDPOINTS } from "../../../api/endpoints";
import { RECIPES_CHANGED_EVENT } from "../../../api/handlers/recipesHandler";
import { buildSearchSuggestions, getTrendingSearches } from "./utils";

import type { NavLinkProps } from "../nav-link/types";
import type { Recipe } from "../../../types";
import type { PaginatedResponse } from "../../../api/types";

import styles from "./Header.module.scss";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentSearch =
    location.pathname === "/catalog" ? (searchParams.get("search") ?? "") : "";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { comparisonList } = useComparisonContext();
  const { isAuthenticated, openAuthModal } = useAuthContext();
  const { registerSearch } = useSearchFocusContext();
  const { recentSearches, addRecentSearch, clearRecentSearches } =
    useRecentSearches();

  const searchInputRef = useRef<HTMLInputElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    registerSearch(() => {
      searchInputRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      searchInputRef.current?.focus();
    });
    return () => registerSearch(null);
  }, [registerSearch]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !navRef.current?.contains(target) &&
        !burgerRef.current?.contains(target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const { data: recipesRes, refetch: refetchRecipes } = useFetch<
    PaginatedResponse<Recipe>
  >(ENDPOINTS.RECIPES);

  useEffect(() => {
    const handle = () => refetchRecipes();
    window.addEventListener(RECIPES_CHANGED_EVENT, handle);
    return () => window.removeEventListener(RECIPES_CHANGED_EVENT, handle);
  }, [refetchRecipes]);

  const recipes = recipesRes?.data ?? [];
  const searchSuggestions = buildSearchSuggestions(recipes);
  const trendingSearches = getTrendingSearches(recipes);

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
      badge: comparisonList.length || undefined,
    },
  ];

  const handleLogoClick = () => {
    setTimeout(() => window.location.reload(), 0);
  };

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate("/profile");
    } else {
      openAuthModal();
    }
  };

  const handleSearch = (query: string, type?: string) => {
    const trimmed = query.trim();
    if (!trimmed) {
      navigate("/catalog");
      return;
    }
    const params = new URLSearchParams({ search: trimmed });
    if (type) params.set("searchType", type);
    navigate(`/catalog?${params.toString()}`);
  };

  return (
    <header className={styles.header}>
      <div className={styles.header__container}>
        <Link to="/" onClick={handleLogoClick} className={styles.header__logo}>
          <IconButton iconSrc={HEADER_ICONS.logo} label="Logo" />
          <span className={styles.header__logoText}>Recipes app</span>
        </Link>

        <nav
          ref={navRef}
          className={`${styles.header__nav} ${isMenuOpen ? styles["header__nav--open"] : ""}`}>
          {navLinks.map(({ to, label, isActive, badge }) => (
            <NavLink
              key={to}
              to={to}
              label={label}
              isActive={isActive}
              onClick={handleNavClick}
              badge={badge}
            />
          ))}
        </nav>

        <button
          ref={burgerRef}
          className={styles.header__burger}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}>
          <span />
          <span />
          <span />
        </button>

        <div className={styles.header__search}>
          <Search
            onSearch={handleSearch}
            onCommitSearch={addRecentSearch}
            suggestions={searchSuggestions}
            inputRef={searchInputRef}
            initialValue={currentSearch}
            recentSearches={recentSearches}
            trendingSearches={trendingSearches}
            onClearRecent={clearRecentSearches}
          />
        </div>

        <div
          className={`${styles.header__profile} ${
            location.pathname.startsWith("/profile")
              ? styles["header__profile--active"]
              : ""
          }`}>
          <Button
            iconName="profile"
            iconPosition="left"
            variant="outline"
            width="100px"
            onClick={handleProfileClick}>
            {isAuthenticated ? "Profile" : "Sign In"}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
