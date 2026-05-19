import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import Button from "../../common/button/Button";
import type { ComparisonFloatButtonProps } from "./types";
import { navigateToComparison } from "./utils";
import styles from "./ComparisonFloatButton.module.scss";

const ComparisonFloatButton = ({ count }: ComparisonFloatButtonProps) => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [displayCount, setDisplayCount] = useState(count);

  useEffect(() => {
    if (count > 0) {
      setDisplayCount(count);
      setVisible(false);
      const t = setTimeout(() => setVisible(true), 16);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
      const t = setTimeout(() => setDisplayCount(0), 350);
      return () => clearTimeout(t);
    }
  }, [count]);

  if (displayCount === 0) return null;

  return (
    <div
      className={`${styles["comparison-float"]} ${visible ? styles["comparison-float--visible"] : styles["comparison-float--hidden"]}`}>
      <div className={styles["comparison-float__btn-wrapper"]}>
        <Button
          variant="secondary"
          size="medium"
          onClick={() => navigateToComparison(navigate)}>
          Compare
          <span className={styles["comparison-float__badge"]}>
            {displayCount}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default ComparisonFloatButton;
