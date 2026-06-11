'use client';

import { useState, useEffect } from 'react';

interface IconItem {
  name: string;
  url: string;
}

interface IconPickerProps {
  value: string;
  onChange: (url: string) => void;
}

export default function IconPicker({ value, onChange }: IconPickerProps) {
  const [icons, setIcons] = useState<IconItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPicker, setShowPicker] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function fetchIcons() {
      try {
        const res = await fetch('/api/admin/icons');
        if (res.ok) {
          const data = await res.json();
          setIcons(data.icons || []);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchIcons();
  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'services');

      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        onChange(data.url);
        setIcons((prev) => [...prev, { name: file.name.replace(/\.[^.]+$/, ''), url: data.url }]);
        setShowPicker(false);
      }
    } catch {
      // silently fail
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>

      {/* Current selection preview */}
      <div className="flex items-center gap-3 mb-2">
        {value && (
          <div className="h-10 w-10 rounded-md border border-gray-200 flex items-center justify-center bg-gray-50 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Selected icon" className="h-8 w-8 object-contain" />
          </div>
        )}
        <button
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          className="px-3 py-1.5 text-xs text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          {value ? 'Ganti Icon' : 'Pilih Icon'}
        </button>
        {value && (
          <span className="text-xs text-gray-400 truncate max-w-[200px]">{value}</span>
        )}
      </div>

      {/* Picker dropdown */}
      {showPicker && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3">
          {loading ? (
            <p className="text-sm text-gray-500">Memuat icon...</p>
          ) : (
            <>
              <p className="text-xs text-gray-500 mb-2">Pilih icon dari yang tersedia:</p>
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                {icons.map((icon) => (
                  <button
                    key={icon.url}
                    type="button"
                    onClick={() => { onChange(icon.url); setShowPicker(false); }}
                    className={`h-12 w-12 rounded-lg border-2 flex items-center justify-center transition-all hover:border-gold ${value === icon.url ? 'border-gold bg-gold/10' : 'border-gray-200 bg-white'}`}
                    title={icon.name}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={icon.url} alt={icon.name} className="h-7 w-7 object-contain" />
                  </button>
                ))}
              </div>

              {/* Upload new */}
              <div className="border-t border-gray-200 pt-3 mt-3">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  {uploading ? 'Mengunggah...' : 'Upload icon baru'}
                  <input
                    type="file"
                    accept=".svg,.png,.webp"
                    className="hidden"
                    onChange={handleUpload}
                    disabled={uploading}
                  />
                </label>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
