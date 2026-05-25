import SectionHeading from "../../common/section-heading/SectionHeading";
import type { ProfileSectionProps } from "./types";

import styles from "./ProfileSection.module.scss";

const ProfileSection = ({
  title,
  iconSrc,
  subtitle,
  actions,
  children,
}: ProfileSectionProps) => (
  <section className={styles["profile-section"]}>
    <header className={styles["profile-section__header"]}>
      <div className={styles["profile-section__heading"]}>
        <SectionHeading title={title} iconSrc={iconSrc} size="lg" as="h2" />
        {subtitle && (
          <p className={styles["profile-section__subtitle"]}>{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className={styles["profile-section__actions"]}>{actions}</div>
      )}
    </header>
    <div className={styles["profile-section__body"]}>{children}</div>
  </section>
);

export default ProfileSection;
