"use client";

import { useEffect, useId } from "react";
import { Alert02Icon } from "@hugeicons/core-free-icons";
import Ico from "./Ico";

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = "Hapus",
  cancelLabel = "Batal",
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  const titleId = useId();
  const messageId = useId();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !loading) onCancel();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onCancel, loading]);

  return (
    <div
      className="a-overlay a-open a-confirm"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={messageId}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) onCancel();
      }}
    >
      <div className="a-modal a-sm a-dlg">
        <div className="a-badge">
          <Ico icon={Alert02Icon} />
        </div>
        <h3 id={titleId}>{title}</h3>
        <p id={messageId}>{message}</p>
        <div className="a-acts">
          <button
            type="button"
            className="a-btn a-bo a-sm"
            onClick={onCancel}
            disabled={loading}
            autoFocus
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="a-btn a-bbad a-sm"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Menghapus..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
