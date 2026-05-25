export const TOAST_TONE = {
  SUCCESS: "success",
  INFO: "info",
  ERROR: "error",
} as const;

export type ToastTone = (typeof TOAST_TONE)[keyof typeof TOAST_TONE];

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastInput {
  title: string;
  description?: string;
  tone?: ToastTone;
  duration?: number;
  action?: ToastAction;
}

export interface ToastItem extends ToastInput {
  id: string;
  tone: ToastTone;
  duration: number;
}

export interface ToastProps {
  toast: ToastItem;
  onDismiss: (_id: string) => void;
}
