import { Link } from "react-router";

import IconButton from "../icon-button/IconButton";
import { HEADER_ICONS } from "../icon-button/utils";
import { useAuthContext } from "../../../context/AuthContext";
import { FOOTER_LINKS } from "./utils";

import styles from "./Footer.module.scss";

const Footer = () => {
  const { isAuthenticated } = useAuthContext();
  const year = new Date().getFullYear();
  const links = FOOTER_LINKS.filter(
    (link) => !link.authOnly || isAuthenticated
  );

  return (
    <footer className={styles.footer}>
      <div className={styles.footer__container}>
        <div className={styles.footer__brand}>
          <Link
            to="/"
            onClick={() => setTimeout(() => window.location.reload(), 0)}
            className={styles.footer__logo}>
            <IconButton iconSrc={HEADER_ICONS.logo} label="Logo" />
            <span className={styles.footer__logoText}>Recipes app</span>
          </Link>
          <p className={styles.footer__tagline}>
            Discover recipes, save favorites, and cook with what you have.
          </p>
        </div>

        <nav className={styles.footer__nav} aria-label="Footer navigation">
          <h2 className={styles.footer__heading}>Explore</h2>
          <ul className={styles.footer__links}>
            {links.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className={styles.footer__link}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className={styles.footer__bottom}>
        <p className={styles.footer__copy}>© {year} Recipes app</p>
      </div>
    </footer>
  );
};

export default Footer;
