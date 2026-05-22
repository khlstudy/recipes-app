import { useRef, type KeyboardEvent } from "react";

import type { TabsProps } from "./types";
import { classNames } from "../../../utils/classNames";
import { getNextTabIndex } from "./utils";

import styles from "./Tabs.module.scss";

const Tabs = ({ items, activeKey, onChange, label }: TabsProps) => {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number
  ) => {
    const nextIndex = getNextTabIndex(event.key, currentIndex, items.length);
    if (nextIndex === null) return;

    event.preventDefault();
    onChange(items[nextIndex].key);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <div className={styles.tabs} role="tablist" aria-label={label}>
      {items.map((item, index) => {
        const isActive = item.key === activeKey;

        return (
          <button
            key={item.key}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            type="button"
            role="tab"
            id={`tab-${item.key}`}
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            className={classNames(
              styles.tabs__tab,
              isActive && styles["tabs__tab--active"]
            )}
            onClick={() => onChange(item.key)}
            onKeyDown={(event) => handleKeyDown(event, index)}>
            {item.label}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
