'use client';

import { useState, useRef } from 'react';

interface PhotoUploadProps {
  value: string;
  onChange: (url: string) => void;
  category?: string;
}

export default function PhotoUpload({ value, onChange, category = 'testimonials' }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file maksimal 5MB.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);

      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });

      if (res.ok) {
        const data = await res.json();
        onChange(data.url);
      } else {
        const data = await res.json().catch(() => null);
        setError(data?.error || 'Gagal mengunggah foto.');
      }
    } catch {
      setError('Gagal mengunggah foto.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  function handleRemove() {
    onChange('');
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Foto <span className="text-gray-400 font-normal">(opsional, maks 5MB)</span>
      </label>

      <div className="flex items-center gap-3">
        {/* Preview — using native img to avoid next/image optimization issues with dynamic uploads */}
        {value && (
          <div className="h-14 w-14 rounded-full border border-gray-200 overflow-hidden shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Preview" className="h-14 w-14 object-cover" />
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="px-3 py-1.5 text-xs text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {uploading ? 'Mengunggah...' : value ? 'Ganti Foto' : 'Upload Foto'}
            </button>
            {value && (
              <button
                type="button"
                onClick={handleRemove}
                className="px-3 py-1.5 text-xs text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
              >
                Hapus
              </button>
            )}
          </div>
          {value && <span className="text-xs text-gray-400 truncate max-w-[200px]">{value}</span>}
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
