import Icon from "../../common/icon/Icon";
import { ICONS_PATH } from "../../common/recipe-card/utils";
import { classNames } from "../../../utils/classNames";
import type { ProfileNavProps } from "./types";

import styles from "./ProfileNav.module.scss";

const ProfileNav = ({ tabs, activeTab, onSelect }: ProfileNavProps) => (
  <nav
    className={styles["profile-nav"]}
    role="tablist"
    aria-label="Profile sections"
    aria-orientation="vertical">
    {tabs.map((tab) => {
      const isActive = tab.key === activeTab;
      return (
        <button
          key={tab.key}
          type="button"
          role="tab"
          aria-selected={isActive}
          className={classNames(
            styles["profile-nav__item"],
            isActive && styles["profile-nav__item--active"]
          )}
          onClick={() => onSelect(tab.key)}>
          <span className={styles["profile-nav__icon"]}>
            <Icon src={`${ICONS_PATH}${tab.iconId}`} size={18} />
          </span>
          <span className={styles["profile-nav__text"]}>
            <span className={styles["profile-nav__label"]}>{tab.label}</span>
            <span className={styles["profile-nav__description"]}>
              {tab.description}
            </span>
          </span>
        </button>
      );
    })}
  </nav>
);

export default ProfileNav;
