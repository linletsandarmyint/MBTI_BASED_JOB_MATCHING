import React from "react";
import Modal from "./Modal";
import Button from "./Button";

export default function ConfirmDialog({ open, title = "Confirm", message, onConfirm, onClose, confirmLabel = "Delete", cancelLabel = "Cancel" }) {
  if (!open) return null;

  return (
    <Modal title={title} onClose={onClose} className="w-full max-w-md p-6">
      <div className="text-sm text-gray-700 mb-6">{message}</div>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" size="md" onClick={onClose}>
          {cancelLabel}
        </Button>
        <Button variant="danger" size="md" onClick={() => { onConfirm && onConfirm(); }}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
