"use client";

import { useState, useRef } from "react";
import { Image01Icon } from "@hugeicons/core-free-icons";
import Ico from "./Ico";

interface PhotoUploadProps {
  value: string;
  onChange: (url: string) => void;
  category?: string;
  label?: string;
  hint?: string;
  /** Tampilkan gambar utuh (untuk foto mobil tanpa latar). */
  contain?: boolean;
  /** Pratinjau berbentuk persegi panjang. */
  wide?: boolean;
}

export default function PhotoUpload({
  value,
  onChange,
  category = "testimonials",
  label = "Foto",
  hint = "Opsional, maksimal 5 MB",
  contain = false,
  wide = false,
}: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran foto maksimal 5 MB.");
      e.target.value = "";
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        onChange(data.url);
      } else {
        setError("Foto gagal diunggah. Coba lagi.");
      }
    } catch {
      setError("Foto gagal diunggah. Periksa koneksi Anda.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="a-field">
      <span className="a-lbl">
        {label} <span className="a-opt">{hint}</span>
      </span>
      <button
        type="button"
        className={`a-drop ${wide ? "a-wide" : ""}`.trim()}
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        <span className={`a-thumb ${contain ? "a-contain" : ""}`.trim()}>
          {value ? (
            <img src={value} alt="Pratinjau foto" />
          ) : (
            <Ico icon={Image01Icon} />
          )}
        </span>
        <span>
          <b>
            {uploading ? "Mengunggah..." : value ? "Ganti foto" : "Unggah foto"}
          </b>
          <span
            className="a-s"
            style={error ? { color: "var(--bad)" } : undefined}
          >
            {error ?? "JPG, PNG, atau WebP."}
          </span>
        </span>
      </button>
      {value && (
        <button
          type="button"
          className="a-link-bad"
          style={{ marginTop: 6 }}
          onClick={() => onChange("")}
        >
          Hapus foto
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={handleUpload}
        disabled={uploading}
      />
    </div>
  );
}
