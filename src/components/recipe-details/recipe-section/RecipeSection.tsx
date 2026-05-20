import SectionHeading from "../../common/section-heading/SectionHeading";
import { classNames } from "../../../utils/classNames";
import type { RecipeSectionProps } from "./types";
import styles from "./RecipeSection.module.scss";

const RecipeSection = ({
  title,
  iconSrc,
  children,
  actions,
  className,
}: RecipeSectionProps) => (
  <section className={classNames(styles["recipe-section"], className)}>
    <header className={styles["recipe-section__header"]}>
      <SectionHeading title={title} iconSrc={iconSrc} size="lg" as="h2" />
      {actions && (
        <div className={styles["recipe-section__actions"]}>{actions}</div>
      )}
    </header>
    <div className={styles["recipe-section__body"]}>{children}</div>
  </section>
);

export default RecipeSection;
