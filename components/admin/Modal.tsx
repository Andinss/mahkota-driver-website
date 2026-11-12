"use client";

import { useEffect, useId, type FormEvent, type ReactNode } from "react";
import { Alert02Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import Ico from "./Ico";

interface ModalProps {
  title: string;
  onClose: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  /** Pesan galat di atas isi form. */
  error?: string | null;
  saving?: boolean;
  submitLabel?: string;
  size?: "md" | "sm";
}

/**
 * Modal berbentuk form untuk tambah/edit data.
 * Menutup dengan Esc, klik latar, atau tombol Batal. Tidak bisa ditutup saat menyimpan.
 */
export default function Modal({
  title,
  onClose,
  onSubmit,
  children,
  error,
  saving = false,
  submitLabel = "Simpan",
  size = "md",
}: ModalProps) {
  const titleId = useId();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !saving) onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, saving]);

  return (
    <div
      className="a-overlay a-open"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !saving) onClose();
      }}
    >
      <form
        className={`a-modal ${size === "sm" ? "a-sm" : ""}`.trim()}
        onSubmit={onSubmit}
        noValidate
      >
        <div className="a-mh">
          <h3 id={titleId}>{title}</h3>
          <button
            type="button"
            className="a-icon-btn"
            onClick={onClose}
            disabled={saving}
            aria-label="Tutup"
          >
            <Ico icon={Cancel01Icon} />
          </button>
        </div>
        <div className="a-mb">
          {error && (
            <div className="a-alert a-bad" role="alert">
              <Ico icon={Alert02Icon} />
              <span>{error}</span>
            </div>
          )}
          {children}
        </div>
        <div className="a-mf">
          <button
            type="button"
            className="a-btn a-bo a-sm"
            onClick={onClose}
            disabled={saving}
          >
            Batal
          </button>
          <button type="submit" className="a-btn a-bd a-sm" disabled={saving}>
            {saving ? "Menyimpan..." : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
