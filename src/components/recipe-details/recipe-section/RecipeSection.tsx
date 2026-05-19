import Icon from "../../common/icon/Icon";
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
      <h2 className={styles["recipe-section__title"]}>
        {iconSrc && (
          <Icon
            src={iconSrc}
            size={22}
            className={styles["recipe-section__icon"]}
          />
        )}
        {title}
      </h2>
      {actions && (
        <div className={styles["recipe-section__actions"]}>{actions}</div>
      )}
    </header>
    <div className={styles["recipe-section__body"]}>{children}</div>
  </section>
);

export default RecipeSection;
