import type { ReactNode } from "react";

export const MODAL_SIZE = {
  SMALL: "small",
  MEDIUM: "medium",
  LARGE: "large",
} as const;

export type ModalSize = (typeof MODAL_SIZE)[keyof typeof MODAL_SIZE];

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: ModalSize;
  label: string;
  closeOnBackdrop?: boolean;
}
