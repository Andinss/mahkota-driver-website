"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import Icon from "@/components/ui/Icon";

/**
 * Curated list of Hugeicons keys that admins can pick for dynamic content
 * (services, advantages, registration steps, commitments).
 * Values map 1:1 to `ICON_MAP` in components/ui/Icon.tsx.
 */
export const ADMIN_ICON_KEYS = [
  "calendar_day",
  "calendar_week",
  "calendar_month",
  "today",
  "assignment",
  "directions_car",
  "tools",
  "build",
  "headset",
  "support_agent",
  "wallet",
  "payments",
  "sell",
  "star",
  "person",
  "groups",
  "location_on",
  "call",
  "chat",
  "image",
  "lock",
  "settings",
  "check_circle",
  "warning",
  "arrow_forward",
  "arrow_back",
  "north_east",
  "bar_chart",
  "home_repair_service",
  "reviews",
  "tune",
  "upload",
  "share",
  "open_in_new",
  "logout",
] as const;

export type AdminIconKey = (typeof ADMIN_ICON_KEYS)[number];

interface HugeiconPickerProps {
  value: string;
  onChange: (key: string) => void;
  label?: string;
  helperText?: string;
}

export default function HugeiconPicker({
  value,
  onChange,
  label = "Icon Hugeicons",
  helperText = "Pilih ikon bawaan. Kosongkan jika ingin pakai gambar upload.",
}: HugeiconPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <label className="block text-sm font-medium text-ink mb-2">
        {label} <span className="text-mu font-normal">(opsional)</span>
      </label>

      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg border border-ln flex items-center justify-center bg-bg shrink-0">
          {value ? (
            <Icon name={value} className="text-[22px]" />
          ) : (
            <span className="text-xs text-mu">—</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="px-4 py-2 text-xs font-semibold text-ink border border-ln rounded-lg hover:border-y transition-colors"
        >
          {value ? "Ganti Icon" : "Pilih Icon"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs text-red-500 hover:text-red-700 font-medium"
          >
            Hapus
          </button>
        )}
      </div>

      <p className="mt-1 text-xs text-mu">{helperText}</p>

      {open && (
        <div className="mt-3 border border-ln rounded-xl p-3 bg-bg">
          <div className="grid grid-cols-8 sm:grid-cols-10 gap-2 max-h-56 overflow-y-auto pr-1">
            {ADMIN_ICON_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  onChange(key);
                  setOpen(false);
                }}
                className={`h-10 w-10 rounded-lg border-2 flex items-center justify-center transition-all hover:border-y ${
                  value === key ? "border-y bg-y/10" : "border-ln bg-surf"
                }`}
                title={key}
                aria-label={key}
                aria-pressed={value === key}
              >
                <Icon name={key} className="text-[20px]" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
