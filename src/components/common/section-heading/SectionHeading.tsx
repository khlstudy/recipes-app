import Icon from "../icon/Icon";
import { classNames } from "../../../utils/classNames";
import { DEFAULT_SIZE, ICON_SIZE } from "./utils";
import type { SectionHeadingProps } from "./types";
import styles from "./SectionHeading.module.scss";

const SectionHeading = ({
  title,
  iconSrc,
  size = DEFAULT_SIZE,
  as: Tag = "h2",
  className,
}: SectionHeadingProps) => (
  <Tag
    className={classNames(
      styles["section-heading"],
      styles[`section-heading--${size}`],
      className
    )}>
    {iconSrc && (
      <Icon
        src={iconSrc}
        size={ICON_SIZE[size]}
        className={styles["section-heading__icon"]}
      />
    )}
    {title}
  </Tag>
);

export default SectionHeading;
