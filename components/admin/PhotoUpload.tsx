"use client";

import { useState, useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Image01Icon, Upload01Icon } from "@hugeicons/core-free-icons";

interface PhotoUploadProps {
  value: string;
  onChange: (url: string) => void;
  category?: string;
}

export default function PhotoUpload({
  value,
  onChange,
  category = "testimonials",
}: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Maksimal 5MB.");
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
        setError("Gagal mengunggah.");
      }
    } catch {
      setError("Gagal mengunggah.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-ink mb-2">
        Foto <span className="text-mu font-normal">(maks 5MB)</span>
      </label>
      <div className="flex items-center gap-4">
        {value ? (
          <div className="h-20 w-20 rounded-xl border border-ln overflow-hidden shrink-0 bg-bg">
            <img
              src={value}
              alt="Preview"
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="h-20 w-20 rounded-xl border-2 border-dashed border-ln shrink-0 flex items-center justify-center bg-bg text-mu">
            <span className="ms text-3xl">
              <HugeiconsIcon icon={Image01Icon} size="1em" />
            </span>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 text-xs font-semibold text-ink border border-ln rounded-lg hover:border-y hover:bg-y/10 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <span className="ms text-[16px]">
              <HugeiconsIcon icon={Upload01Icon} size="1em" />
            </span>{" "}
            {uploading ? "Mengunggah..." : value ? "Ganti Foto" : "Upload Foto"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-xs text-red-500 hover:text-red-700 font-medium text-left px-1"
            >
              Hapus foto
            </button>
          )}
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleUpload}
          disabled={uploading}
        />
      </div>
    </div>
  );
}
