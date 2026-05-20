import { useState } from "react";

import SectionHeading from "../../common/section-heading/SectionHeading";
import { classNames } from "../../../utils/classNames";
import type { FilterGroupProps } from "./types";
import styles from "./FilterGroup.module.scss";

const FilterGroup = ({
  title,
  iconSrc,
  children,
  defaultOpen = true,
}: FilterGroupProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className={styles["filter-group"]}>
      <button
        type="button"
        className={styles["filter-group__toggle"]}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}>
        <SectionHeading title={title} iconSrc={iconSrc} size="sm" as="span" />
        <span
          className={classNames(
            styles["filter-group__chevron"],
            isOpen && styles["filter-group__chevron--open"]
          )}
        />
      </button>

      {isOpen && <div className={styles["filter-group__body"]}>{children}</div>}
    </section>
  );
};

export default FilterGroup;
