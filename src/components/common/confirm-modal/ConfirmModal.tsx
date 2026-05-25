import Modal from "../modal/Modal";
import Button from "../button/Button";

import type { ConfirmModalProps } from "./types";

import styles from "./ConfirmModal.module.scss";

const ConfirmModal = ({
  isOpen,
  title,
  description,
  highlight,
  confirmLabel,
  cancelLabel = "Cancel",
  confirmVariant = "danger",
  pending = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) => (
  <Modal isOpen={isOpen} onClose={onClose} size="small" label={title}>
    <div className={styles["confirm-modal"]}>
      <h2 className={styles["confirm-modal__title"]}>{title}</h2>
      {description && (
        <p className={styles["confirm-modal__description"]}>{description}</p>
      )}
      {highlight && (
        <p className={styles["confirm-modal__highlight"]}>{highlight}</p>
      )}
      <div className={styles["confirm-modal__actions"]}>
        <Button
          type="button"
          variant="outline"
          size="medium"
          onClick={onClose}
          disabled={pending}>
          {cancelLabel}
        </Button>
        <Button
          type="button"
          variant={confirmVariant}
          size="medium"
          onClick={onConfirm}
          disabled={pending}>
          {pending ? "Working..." : confirmLabel}
        </Button>
      </div>
    </div>
  </Modal>
);

export default ConfirmModal;
