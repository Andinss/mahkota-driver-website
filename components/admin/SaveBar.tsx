interface SaveBarProps {
  /** Ada perubahan yang belum disimpan. */
  dirty: boolean;
  saving: boolean;
  label?: string;
}

/**
 * Bar simpan yang menempel di bawah halaman.
 * Harus berada di dalam <form> karena tombolnya bertipe submit.
 */
export default function SaveBar({
  dirty,
  saving,
  label = "Simpan perubahan",
}: SaveBarProps) {
  return (
    <div className={`a-savebar ${dirty ? "a-dirty" : ""}`.trim()}>
      <div className="a-sb-state" role="status">
        <span className="a-dot" />
        <span>
          {dirty
            ? "Ada perubahan yang belum disimpan"
            : "Semua perubahan sudah tersimpan"}
        </span>
      </div>
      <button type="submit" className="a-btn a-bd" disabled={saving}>
        {saving ? "Menyimpan..." : label}
      </button>
    </div>
  );
}
