import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import type { ModalProps } from "./types";
import { classNames } from "../../../utils/classNames";
import IconButton from "../icon-button/IconButton";
import { MODAL_ICONS } from "./utils";

import styles from "./Modal.module.scss";

const Modal = ({
  isOpen,
  onClose,
  children,
  size = "medium",
  label,
  closeOnBackdrop = true,
}: ModalProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) dialogRef.current?.focus();
  }, [isOpen]);

  const handleBackdropClick = useCallback(() => {
    if (closeOnBackdrop) onClose();
  }, [closeOnBackdrop, onClose]);

  if (!isOpen) return null;

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  return createPortal(
    <div className={styles.modal} role="presentation">
      <div className={styles.modal__backdrop} onClick={handleBackdropClick} />

      <div
        ref={dialogRef}
        className={classNames(
          styles.modal__dialog,
          styles[`modal__dialog--${size}`]
        )}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}>
        <IconButton
          className={styles.modal__close}
          iconSrc={MODAL_ICONS.close}
          label="Close dialog"
          onClick={onClose}
        />
        {children}
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;
