"use client";

import { useRef, useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

interface SaveBarProps {
  /** Ada perubahan yang belum disimpan. */
  dirty: boolean;
  saving: boolean;
  label?: string;
}

/**
 * Bar simpan yang menempel di bawah halaman.
 * Harus berada di dalam <form>. Menekan tombol membuka dialog konfirmasi;
 * setelah dikonfirmasi, form dikirim seperti biasa (onSubmit milik form).
 */
export default function SaveBar({
  dirty,
  saving,
  label = "Simpan perubahan",
}: SaveBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const [confirming, setConfirming] = useState(false);

  function confirmSave() {
    setConfirming(false);
    barRef.current?.closest("form")?.requestSubmit();
  }

  return (
    <>
      <div
        ref={barRef}
        className={`a-savebar ${dirty ? "a-dirty" : ""}`.trim()}
      >
        <div className="a-sb-state" role="status">
          <span className="a-dot" />
          <span>
            {dirty
              ? "Ada perubahan yang belum disimpan"
              : "Semua perubahan sudah tersimpan"}
          </span>
        </div>
        <button
          type="button"
          className="a-btn a-bd"
          disabled={saving}
          onClick={() => setConfirming(true)}
        >
          {saving ? "Menyimpan..." : label}
        </button>
      </div>

      {confirming && (
        <ConfirmDialog
          tone="primary"
          title="Simpan perubahan?"
          message={
            dirty
              ? "Perubahan akan langsung tampil di website."
              : "Belum ada perubahan baru. Simpan tetap akan memperbarui website dengan data saat ini."
          }
          confirmLabel="Simpan"
          onConfirm={confirmSave}
          onCancel={() => setConfirming(false)}
        />
      )}
    </>
  );
}
