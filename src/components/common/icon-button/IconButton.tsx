import type { IconButtonProps } from "./types.ts";
import { ICONS } from "./utils.ts";
import { classNames } from "../../../utils/classNames.ts";
import styles from "./IconButton.module.scss";

const IconButton = ({
  iconName,
  onClick,
  size = "medium",
  ...restProps
}: IconButtonProps) => {
  const iconClassName = classNames(
    styles["icon-button__icon"],
    size === "medium" ? styles["icon-button__icon--medium"] : null
  );

  return (
    <button
      className={styles["icon-button"]}
      onClick={onClick}
      type="button"
      {...restProps}>
      <img src={ICONS[iconName]} alt={iconName} className={iconClassName} />
    </button>
  );
};

export default IconButton;
