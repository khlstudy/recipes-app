import type { IconButtonProps } from "./types";
import { classNames } from "../../../utils/classNames";
import Icon from "../icon/Icon";
import styles from "./IconButton.module.scss";

const IconButton = ({
  iconSrc,
  label,
  variant = "default",
  active = false,
  actionType,
  className,
  ...restProps
}: IconButtonProps) => {
  const buttonClassName = classNames(
    styles["icon-button"],
    styles[`icon-button--${variant}`],
    active ? styles[`icon-button--${variant}--active`] : null,
    actionType ? styles[`icon-button--action--${actionType}`] : null,
    className ?? null
  );

  return (
    <button
      className={buttonClassName}
      type="button"
      aria-label={label}
      {...restProps}>
      <Icon src={iconSrc} className={styles["icon-button__icon"]} />
    </button>
  );
};

export default IconButton;
