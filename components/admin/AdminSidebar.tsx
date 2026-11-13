"use client";

import { useEffect, useState } from "react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  Analytics01Icon,
  ArrowDown01Icon,
  Call02Icon,
  Car01Icon,
  File01Icon,
  Files01Icon,
  Home01Icon,
  HelpCircleIcon,
  LegalDocument01Icon,
  SecurityCheckIcon,
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
  | "about"
  | "faq"
  | "terms"
  | "privacy";

interface TabDef {
  key: TabKey;
  label: string;
  icon: IconSvgElement;
}

/** Urutan menu mengikuti urutan section di beranda, dari atas ke bawah. */
const GROUPS: { label: string; icon: IconSvgElement; tabs: TabDef[] }[] = [
  {
    label: "Beranda",
    icon: Home01Icon,
    tabs: [
      { key: "hero", label: "Hero", icon: Megaphone01Icon },
      {
        key: "statistics",
        label: "Tentang & statistik",
        icon: Analytics01Icon,
      },
      { key: "services", label: "Layanan & keunggulan", icon: ToolsIcon },
      { key: "fleet", label: "Armada", icon: Car01Icon },
      { key: "testimonials", label: "Testimoni", icon: StarSquareIcon },
      { key: "registration", label: "Cara bergabung", icon: TaskDone01Icon },
      { key: "contact", label: "Kontak", icon: Call02Icon },
    ],
  },
  {
    label: "Halaman lain",
    icon: Files01Icon,
    tabs: [
      { key: "about", label: "Halaman Tentang", icon: File01Icon },
      { key: "faq", label: "FAQ", icon: HelpCircleIcon },
      { key: "terms", label: "Syarat & ketentuan", icon: LegalDocument01Icon },
      { key: "privacy", label: "Kebijakan privasi", icon: SecurityCheckIcon },
    ],
  },
];

function groupOf(tab: TabKey) {
  return GROUPS.find((g) => g.tabs.some((t) => t.key === tab))?.label ?? null;
}

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
  // Header grup membuka/menutup grupnya sendiri. Grup lama baru tertutup
  // saat sebuah menu di grup lain dipilih (lihat onClick menu di bawah).
  const [openGroups, setOpenGroups] = useState<string[]>(() => {
    const g = groupOf(activeTab);
    return g ? [g] : [];
  });

  function toggleGroup(label: string) {
    setOpenGroups((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    );
  }

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
            <span className="a-ey">PANEL ADMIN</span>
          </div>
        </div>

        <nav className="a-nav" aria-label="Tab navigasi admin">
          {GROUPS.map((group, gi) => {
            const isOpen = openGroups.includes(group.label);
            const panelId = `nav-group-${gi}`;
            const hasActive = group.tabs.some((t) => t.key === activeTab);
            return (
              <div key={group.label} className="a-nav-group">
                <button
                  type="button"
                  className={`a-nav-toggle ${hasActive ? "a-has-active" : ""}`.trim()}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleGroup(group.label)}
                >
                  <span className="a-gi">
                    <Ico icon={group.icon} />
                  </span>
                  <span className="a-gl">{group.label}</span>
                  <Ico icon={ArrowDown01Icon} className="a-chev" />
                </button>
                <div
                  id={panelId}
                  className={`a-nav-panel ${isOpen ? "a-open" : ""}`.trim()}
                  inert={!isOpen}
                >
                  <div className="a-nav-inner">
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
                            setOpenGroups([group.label]);
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
                </div>
              </div>
            );
          })}
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
