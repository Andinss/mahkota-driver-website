"use client";

import { useState } from "react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  Analytics01Icon,
  StarSquareIcon,
  ToolsIcon,
  Car01Icon,
  TaskDone01Icon,
  Settings02Icon,
  LockIcon,
  Logout02Icon,
  Cancel01Icon,
  Menu01Icon,
} from "@hugeicons/core-free-icons";

type TabKey =
  | "statistics"
  | "testimonials"
  | "services"
  | "fleet"
  | "registration"
  | "contact";

const TABS: { key: TabKey; label: string; icon: IconSvgElement }[] = [
  { key: "statistics", label: "Statistik", icon: Analytics01Icon },
  { key: "testimonials", label: "Testimoni", icon: StarSquareIcon },
  { key: "services", label: "Layanan", icon: ToolsIcon },
  { key: "fleet", label: "Armada", icon: Car01Icon },
  { key: "registration", label: "Cara Daftar", icon: TaskDone01Icon },
  { key: "contact", label: "General", icon: Settings02Icon },
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
          className="h-10 w-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-black shadow-sm"
        >
          <span className="ms text-black">
            <HugeiconsIcon
              icon={isOpen ? Cancel01Icon : Menu01Icon}
              size="1em"
            />
          </span>
        </button>
      </div>

      {/* Overlay Mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container - Dikunci lebarnya 280px */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        style={{ width: "280px", minWidth: "280px", height: "100vh" }}
      >
        {/* Logo */}
        <div className="h-20 flex items-center gap-3 px-6 border-b border-gray-200 shrink-0">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="h-8 w-8 object-contain"
          />
          <h1 className="text-lg font-extrabold text-black tracking-tight whitespace-nowrap">
            Mahkota<span className="text-yellow-600">Drive</span>
          </h1>
        </div>

        {/* Menu - Menggunakan div, flex-col agar berjejer ke bawah */}
        <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1">
          <p className="px-3 text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            Manajemen Konten
          </p>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setIsOpen(false);
              }}
              className={`w-full flex flex-row items-center justify-start gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.key
                  ? "bg-yellow-600 text-white shadow-sm"
                  : "text-gray-500 hover:bg-gray-100 hover:text-black"
              }`}
            >
              <span
                className={`ms text-[20px] shrink-0 ${
                  activeTab === tab.key ? "text-white" : "text-gray-500"
                }`}
              >
                <HugeiconsIcon icon={tab.icon} size="1em" />
              </span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-200 flex flex-col gap-1 shrink-0">
          <button
            onClick={onOpenPassword}
            className="w-full flex flex-row items-center justify-start gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 hover:text-black transition-colors"
          >
            <span className="ms text-[20px] shrink-0">
              <HugeiconsIcon icon={LockIcon} size="1em" />
            </span>{" "}
            <span>Ubah Password</span>
          </button>
          <button
            onClick={onLogout}
            disabled={isLoggingOut}
            className="w-full flex flex-row items-center justify-start gap-3 px-3 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <span className="ms text-[20px] shrink-0">
              <HugeiconsIcon icon={Logout02Icon} size="1em" />
            </span>{" "}
            <span>{isLoggingOut ? "Keluar..." : "Keluar"}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
