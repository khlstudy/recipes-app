import type { ButtonProps } from "./types";
import { classNames } from "../../../utils/classNames";
import { ICONS } from "./utils";
import styles from "./Button.module.scss";

const Button = ({
  variant = "primary",
  size = "medium",
  width,
  textTransform = "capitalize",
  iconName,
  iconPosition = "left",
  children,
  className,
  ...restProps
}: ButtonProps) => {
  const buttonClassName = classNames(
    styles.button,
    styles[`button--${variant}`],
    styles[`button--${size}`],
    textTransform ? styles[`button--${textTransform}`] : null,
    className
  );

  const iconElement = iconName && (
    <img src={ICONS[iconName]} alt={iconName} className={styles.button__icon} />
  );

  return (
    <button
      className={buttonClassName}
      style={{ maxWidth: width }}
      {...restProps}>
      {iconPosition === "left" && iconElement}
      {children}
      {iconPosition === "right" && iconElement}
    </button>
  );
};

export default Button;
