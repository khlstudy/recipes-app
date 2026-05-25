import { useEffect } from "react";

import IconButton from "../icon-button/IconButton";
import { MODAL_ICONS } from "../modal/utils";
import { classNames } from "../../../utils/classNames";

import type { ToastProps } from "./types";

import styles from "./Toast.module.scss";

const Toast = ({ toast, onDismiss }: ToastProps) => {
  useEffect(() => {
    if (toast.duration <= 0) return;
    const timer = window.setTimeout(() => onDismiss(toast.id), toast.duration);
    return () => window.clearTimeout(timer);
  }, [toast.duration, toast.id, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={classNames(styles.toast, styles[`toast--${toast.tone}`])}>
      <div className={styles.toast__body}>
        <p className={styles.toast__title}>{toast.title}</p>
        {toast.description && (
          <p className={styles.toast__description}>{toast.description}</p>
        )}
        {toast.action && (
          <button
            type="button"
            className={styles.toast__action}
            onClick={() => {
              toast.action?.onClick();
              onDismiss(toast.id);
            }}>
            {toast.action.label}
          </button>
        )}
      </div>
      <IconButton
        className={styles.toast__close}
        iconSrc={MODAL_ICONS.close}
        label="Dismiss notification"
        onClick={() => onDismiss(toast.id)}
      />
    </div>
  );
};

export default Toast;
