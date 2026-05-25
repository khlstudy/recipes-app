import { createContext, useCallback, useContext, useState } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";

import Toast from "../components/common/toast/Toast";
import { TOAST_TONE } from "../components/common/toast/types";
import type { ToastInput, ToastItem } from "../components/common/toast/types";

import type { ToastContextValue } from "./types";
import styles from "../components/common/toast/ToastContainer.module.scss";

const DEFAULT_DURATION = 6000;

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((input: ToastInput): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const item: ToastItem = {
      id,
      title: input.title,
      description: input.description,
      tone: input.tone ?? TOAST_TONE.SUCCESS,
      duration: input.duration ?? DEFAULT_DURATION,
      action: input.action,
    };
    setToasts((prev) => [...prev, item]);
    return id;
  }, []);

  const toastRoot =
    typeof document !== "undefined"
      ? document.getElementById("toast-root")
      : null;

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      {toastRoot &&
        createPortal(
          <div className={styles["toast-container"]} aria-live="polite">
            {toasts.map((toast) => (
              <Toast key={toast.id} toast={toast} onDismiss={dismissToast} />
            ))}
          </div>,
          toastRoot
        )}
    </ToastContext.Provider>
  );
};

export const useToastContext = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx)
    throw new Error("useToastContext must be used within ToastProvider");
  return ctx;
};
