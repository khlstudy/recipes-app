import type { ButtonVariant } from "../button/types";

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  highlight?: string;
  confirmLabel: string;
  cancelLabel?: string;
  confirmVariant?: ButtonVariant;
  pending?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}
