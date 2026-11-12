"use client";

import { useEffect } from "react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  Analytics01Icon,
  Call02Icon,
  Car01Icon,
  File01Icon,
  KeyIcon,
  Logout02Icon,
  Megaphone01Icon,
  StarSquareIcon,
  TaskDone01Icon,
  ToolsIcon,
} from "@hugeicons/core-free-icons";
import Ico from "./Ico";

export type TabKey =
  | "hero"
  | "statistics"
  | "services"
  | "fleet"
  | "testimonials"
  | "registration"
  | "contact"
  | "about";

interface TabDef {
  key: TabKey;
  label: string;
  icon: IconSvgElement;
}

/** Urutan menu mengikuti urutan section di beranda, dari atas ke bawah. */
const GROUPS: { label: string; tabs: TabDef[] }[] = [
  {
    label: "Beranda",
    tabs: [
      { key: "hero", label: "Hero", icon: Megaphone01Icon },
      { key: "statistics", label: "Tentang & statistik", icon: Analytics01Icon },
      { key: "services", label: "Layanan & keunggulan", icon: ToolsIcon },
      { key: "fleet", label: "Armada", icon: Car01Icon },
      { key: "testimonials", label: "Testimoni", icon: StarSquareIcon },
      { key: "registration", label: "Cara bergabung", icon: TaskDone01Icon },
      { key: "contact", label: "Kontak", icon: Call02Icon },
    ],
  },
  {
    label: "Halaman lain",
    tabs: [{ key: "about", label: "Halaman Tentang", icon: File01Icon }],
  },
];

interface SidebarProps {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
  onLogout: () => void;
  onOpenPassword: () => void;
  isLoggingOut: boolean;
  /** Jumlah item per menu, ditampilkan sebagai lencana kecil. */
  counts?: Partial<Record<TabKey, number>>;
  /** Drawer menu di layar kecil. */
  open: boolean;
  onClose: () => void;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  onLogout,
  onOpenPassword,
  isLoggingOut,
  counts,
  open,
  onClose,
}: SidebarProps) {
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <>
      <div
        className={`a-scrim ${open ? "a-on" : ""}`.trim()}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        id="admin-sidebar"
        className={`a-side ${open ? "a-open" : ""}`.trim()}
        aria-label="Menu admin"
      >
        <div className="a-brand">
          <img src="/images/logo.png" alt="" />
          <div>
            <b>
              Mahkota<span>Drive</span>
            </b>
            <span className="a-ey">Panel admin</span>
          </div>
        </div>

        <nav className="a-nav" aria-label="Tab navigasi admin">
          {GROUPS.map((group) => (
            <div key={group.label}>
              <div className="a-nav-label">{group.label}</div>
              {group.tabs.map((tab) => {
                const active = activeTab === tab.key;
                const count = counts?.[tab.key];
                return (
                  <button
                    key={tab.key}
                    type="button"
                    className={`a-nav-item ${active ? "a-on" : ""}`.trim()}
                    aria-current={active ? "page" : undefined}
                    onClick={() => {
                      setActiveTab(tab.key);
                      onClose();
                    }}
                  >
                    <Ico icon={tab.icon} />
                    {tab.label}
                    {count !== undefined && (
                      <span className="a-n">{count}</span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="a-side-foot">
          <button type="button" className="a-nav-item" onClick={onOpenPassword}>
            <Ico icon={KeyIcon} />
            Ubah password
          </button>
          <button
            type="button"
            className="a-nav-item a-out"
            onClick={onLogout}
            disabled={isLoggingOut}
          >
            <Ico icon={Logout02Icon} />
            {isLoggingOut ? "Keluar..." : "Keluar"}
          </button>
        </div>
      </aside>
    </>
  );
}
