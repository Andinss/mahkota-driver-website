"use client";

import { useState, useEffect } from "react";
import Icon from "@/components/ui/Icon";

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
        const res = await fetch("/api/admin/icons");
        if (res.ok) {
          const data = await res.json();
          setIcons(data.icons || []);
        }
      } catch {
        /* ignore */
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
      formData.append("file", file);
      formData.append("category", "services");
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        onChange(data.url);
        setIcons((prev) => [
          ...prev,
          { name: file.name.replace(/\.[^.]+$/, ""), url: data.url },
        ]);
        setShowPicker(false);
      }
    } catch {
      /* ignore */
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-ink mb-2">Icon</label>
      <div className="flex items-center gap-3 mb-2">
        {value && (
          <div className="h-10 w-10 rounded-lg border border-ln flex items-center justify-center bg-bg overflow-hidden shrink-0">
            <img
              src={value}
              alt="Selected"
              className="h-7 w-7 object-contain"
            />
          </div>
        )}
        <button
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          className="px-4 py-2 text-xs font-semibold text-ink border border-ln rounded-lg hover:border-y transition-colors"
        >
          {value ? "Ganti Icon" : "Pilih Icon"}
        </button>
      </div>

      {showPicker && (
        <div className="border border-ln rounded-xl p-4 bg-bg space-y-3">
          {loading ? (
            <p className="text-sm text-mu">Memuat icon...</p>
          ) : (
            <>
              <p className="text-xs text-mu mb-2">
                Pilih icon dari yang tersedia:
              </p>
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-48 overflow-y-auto pr-1">
                {icons.map((icon) => (
                  <button
                    key={icon.url}
                    type="button"
                    onClick={() => {
                      onChange(icon.url);
                      setShowPicker(false);
                    }}
                    className={`h-10 w-10 rounded-lg border-2 flex items-center justify-center transition-all hover:border-y ${value === icon.url ? "border-y bg-y/10" : "border-ln bg-surf"}`}
                    title={icon.name}
                  >
                    <img
                      src={icon.url}
                      alt={icon.name}
                      className="h-6 w-6 object-contain"
                    />
                  </button>
                ))}
              </div>
              <div className="border-t border-ln pt-3 mt-3">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-blue-600 hover:text-blue-800">
                  <Icon name="upload" className="text-[18px]" />
                  {uploading ? "Mengunggah..." : "Upload icon baru"}
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
