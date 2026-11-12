"use client";

import { useState } from "react";
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
  "draw",
] as const;

export type AdminIconKey = (typeof ADMIN_ICON_KEYS)[number];

/** Nama ikon dalam bahasa Indonesia untuk tooltip dan pembaca layar. */
const ICON_LABELS: Record<AdminIconKey, string> = {
  calendar_day: "Kalender harian",
  calendar_week: "Kalender mingguan",
  calendar_month: "Kalender bulanan",
  today: "Hari ini",
  assignment: "Formulir",
  directions_car: "Mobil",
  tools: "Peralatan",
  build: "Kunci pas",
  headset: "Headset",
  support_agent: "Layanan pelanggan",
  wallet: "Dompet",
  payments: "Uang",
  sell: "Label harga",
  star: "Bintang",
  person: "Orang",
  groups: "Kelompok",
  location_on: "Lokasi",
  call: "Telepon",
  chat: "Obrolan",
  image: "Gambar",
  lock: "Gembok",
  settings: "Pengaturan",
  check_circle: "Centang",
  warning: "Peringatan",
  arrow_forward: "Panah kanan",
  arrow_back: "Panah kiri",
  north_east: "Panah serong",
  bar_chart: "Grafik",
  home_repair_service: "Peralatan servis",
  reviews: "Ulasan",
  tune: "Penyesuaian",
  upload: "Unggah",
  share: "Bagikan",
  open_in_new: "Buka tautan",
  logout: "Keluar",
  draw: "Pena",
};

/** Kunci yang memakai ikon yang sama dengan kunci lain; disembunyikan dari grid. */
const ALIAS: Partial<Record<string, AdminIconKey>> = {
  today: "calendar_month",
  home_repair_service: "tools",
};

const PICKER_KEYS = ADMIN_ICON_KEYS.filter((key) => !(key in ALIAS));

interface HugeiconPickerProps {
  value: string;
  onChange: (key: string) => void;
  label?: string;
  helperText?: string;
}

export default function HugeiconPicker({
  value,
  onChange,
  label = "Ikon",
  helperText,
}: HugeiconPickerProps) {
  const [open, setOpen] = useState(false);
  const activeKey = ALIAS[value] ?? value;

  return (
    <div className="a-picker">
      <span className="a-lbl">
        {label} <span className="a-opt">Opsional</span>
      </span>

      <div className="a-picker-row">
        <span className={`a-cur ${value ? "" : "a-none"}`.trim()}>
          {value ? <Icon name={value} className="text-[22px]" /> : "Kosong"}
        </span>
        <button
          type="button"
          className="a-btn a-bo a-sm"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          {value ? "Ganti ikon" : "Pilih ikon"}
        </button>
        {value && (
          <button
            type="button"
            className="a-link-bad"
            onClick={() => onChange("")}
          >
            Hapus
          </button>
        )}
      </div>

      {helperText && <p className="a-hint">{helperText}</p>}

      {open && (
        <div className="a-picker-grid">
          {PICKER_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              className={activeKey === key ? "a-on" : undefined}
              onClick={() => {
                onChange(key);
                setOpen(false);
              }}
              title={ICON_LABELS[key]}
              aria-label={ICON_LABELS[key]}
              aria-pressed={activeKey === key}
            >
              <Icon name={key} className="text-[21px]" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
