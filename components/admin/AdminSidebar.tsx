"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";

type TabKey =
  | "statistics"
  | "testimonials"
  | "services"
  | "fleet"
  | "registration"
  | "contact";

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: "statistics", label: "Statistik", icon: "bar_chart" },
  { key: "testimonials", label: "Testimoni", icon: "reviews" },
  { key: "services", label: "Layanan", icon: "home_repair_service" },
  { key: "fleet", label: "Armada", icon: "directions_car" },
  { key: "registration", label: "Cara Daftar", icon: "assignment" },
  { key: "contact", label: "General", icon: "settings" },
];

interface SidebarProps {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
  onLogout: () => void;
  onOpenPassword: () => void;
  isLoggingOut: boolean;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  onLogout,
  onOpenPassword,
  isLoggingOut,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Tombol Hamburger untuk Mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="h-10 w-10 bg-surf border border-ln rounded-xl flex items-center justify-center text-ink shadow-sm"
        >
          <Icon name={isOpen ? "close" : "menu"} />
        </button>
      </div>

      {/* Overlay Mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 w-64 h-screen bg-surf border-r border-ln flex flex-col transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="h-20 flex items-center gap-3 px-6 border-b border-ln shrink-0">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="h-8 w-8 object-contain"
          />
          <h1 className="text-lg font-extrabold text-ink tracking-tight">
            Mahkota<span className="text-yt">Drive</span>
          </h1>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          <p className="px-3 text-xs font-bold text-mu uppercase tracking-wider mb-3">
            Manajemen Konten
          </p>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.key
                  ? "bg-y text-navy shadow-sm"
                  : "text-mu hover:bg-bg hover:text-ink"
              }`}
            >
              <Icon
                name={tab.icon}
                className={`text-[20px] ${activeTab === tab.key ? "text-navy" : "text-mu"}`}
              />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-ln space-y-1 shrink-0">
          <button
            onClick={onOpenPassword}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-mu hover:bg-bg hover:text-ink transition-colors"
          >
            <Icon name="lock" className="text-[20px]" /> Ubah Password
          </button>
          <button
            onClick={onLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <Icon name="logout" className="text-[20px]" />{" "}
            {isLoggingOut ? "Keluar..." : "Keluar"}
          </button>
        </div>
      </aside>
    </>
  );
}
