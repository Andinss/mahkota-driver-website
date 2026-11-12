"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircleIcon,
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  LinkSquare02Icon,
  Menu01Icon,
} from "@hugeicons/core-free-icons";
import { AllContent } from "@/types/content";
import AdminSidebar, { type TabKey } from "@/components/admin/AdminSidebar";
import Ico from "@/components/admin/Ico";
import Modal from "@/components/admin/Modal";
import PasswordField from "@/components/admin/PasswordField";
import StatisticsTab from "@/components/admin/StatisticsTab";
import TestimonialsTab from "@/components/admin/TestimonialsTab";
import ServicesTab from "@/components/admin/ServicesTab";
import FleetTab from "@/components/admin/FleetTab";
import RegistrationTab from "@/components/admin/RegistrationTab";
import HeroTab from "@/components/admin/HeroTab";
import KontakTab from "@/components/admin/KontakTab";
import AboutPageTab from "@/components/admin/AboutPageTab";

/** Judul halaman untuk breadcrumb di topbar. Judul lengkap ada di tiap tab. */
const TAB_TITLES: Record<TabKey, string> = {
  hero: "Hero",
  statistics: "Tentang & statistik",
  services: "Layanan & keunggulan",
  fleet: "Armada",
  testimonials: "Testimoni",
  registration: "Cara bergabung",
  contact: "Kontak",
  about: "Halaman Tentang",
};

/** Kelompok menu, dipakai di breadcrumb. */
const TAB_GROUP: Record<TabKey, string> = {
  hero: "Beranda",
  statistics: "Beranda",
  services: "Beranda",
  fleet: "Beranda",
  testimonials: "Beranda",
  registration: "Beranda",
  contact: "Beranda",
  about: "Halaman lain",
};

const emptyPasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("hero");
  const [content, setContent] = useState<AllContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState(emptyPasswordForm);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch("/api/content");
        if (!res.ok) throw new Error("Gagal memuat data konten");
        setContent(await res.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      const res = await fetch("/api/admin/logout", { method: "POST" });
      if (res.ok) router.push("/admin");
      else setError("Gagal logout");
    } catch {
      setError("Gagal logout");
    } finally {
      setLoggingOut(false);
    }
  }

  async function handleSave(category: keyof AllContent, data: unknown) {
    const res = await fetch(`/api/admin/content/${category}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Gagal menyimpan");
    }
    setContent((prev) => (prev ? { ...prev, [category]: data } : prev));
  }

  function openPasswordModal() {
    setPasswordForm(emptyPasswordForm);
    setPasswordError(null);
    setPasswordSuccess(false);
    setShowPasswordModal(true);
    setMenuOpen(false);
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setPasswordError("Semua field wajib diisi.");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Password baru minimal 6 karakter.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Konfirmasi password tidak cocok.");
      return;
    }

    setPasswordSaving(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      if (res.ok) {
        setPasswordSuccess(true);
        setPasswordForm(emptyPasswordForm);
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordSuccess(false);
        }, 1500);
      } else {
        const data = await res.json();
        setPasswordError(data.error || "Gagal mengubah password.");
      }
    } catch {
      setPasswordError("Gagal terhubung ke server.");
    } finally {
      setPasswordSaving(false);
    }
  }

  if (loading)
    return (
      <div className="a-state">
        <div>
          <div className="a-spin" role="status" aria-label="Memuat" />
          <p style={{ color: "var(--mu)", fontWeight: 600 }}>
            Memuat data konten…
          </p>
        </div>
      </div>
    );

  if (error && !content)
    return (
      <div className="a-state">
        <div>
          <div className="a-badge">
            <Ico icon={AlertCircleIcon} />
          </div>
          <h2>Data konten gagal dimuat</h2>
          <p>{error}. Periksa koneksi internet Anda, lalu coba lagi.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="a-btn a-bd"
          >
            Coba lagi
          </button>
        </div>
      </div>
    );

  const counts = content
    ? {
        testimonials: content.testimonials.items.length,
        fleet: content.fleet.vehicles.length,
        registration: content.registration.steps.length,
      }
    : undefined;

  return (
    <div className="a-app">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        onOpenPassword={openPasswordModal}
        isLoggingOut={loggingOut}
        counts={counts}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <div className="a-main">
        <div className="a-topbar">
          <div className="a-crumb">
            <button
              type="button"
              className="a-icon-btn a-burger"
              onClick={() => setMenuOpen(true)}
              aria-label="Buka menu"
              aria-controls="admin-sidebar"
              aria-expanded={menuOpen}
            >
              <Ico icon={Menu01Icon} />
            </button>
            <span className="a-hide-sm">{TAB_GROUP[activeTab]}</span>
            <Ico icon={ArrowRight01Icon} className="a-hide-sm" />
            <b>{TAB_TITLES[activeTab]}</b>
          </div>

          <div className="a-tb-r">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="a-btn a-bo a-sm"
            >
              <Ico icon={LinkSquare02Icon} />
              <span>Lihat website</span>
            </a>
            <div
              className="a-avatar"
              title="Administrator"
              aria-label="Akun administrator"
            >
              A
            </div>
          </div>
        </div>

        <div className="a-scroll">
          <div className="a-content">
            {error && (
              <div className="a-alert a-bad" role="alert">
                <Ico icon={AlertCircleIcon} />
                <span>{error}</span>
              </div>
            )}

            {content && activeTab === "hero" && (
              <HeroTab
                data={content.contact}
                onSave={(d) => handleSave("contact", d)}
              />
            )}
            {content && activeTab === "statistics" && (
              <StatisticsTab
                data={content.statistics}
                onSave={(d) => handleSave("statistics", d)}
                contact={content.contact}
                onSaveContact={(d) => handleSave("contact", d)}
              />
            )}
            {content && activeTab === "services" && (
              <ServicesTab
                data={content.services}
                onSave={(d) => handleSave("services", d)}
              />
            )}
            {content && activeTab === "fleet" && (
              <FleetTab
                data={content.fleet}
                onSave={(d) => handleSave("fleet", d)}
              />
            )}
            {content && activeTab === "testimonials" && (
              <TestimonialsTab
                data={content.testimonials}
                onSave={(d) => handleSave("testimonials", d)}
              />
            )}
            {content && activeTab === "registration" && (
              <RegistrationTab
                data={content.registration}
                onSave={(d) => handleSave("registration", d)}
              />
            )}
            {content && activeTab === "contact" && (
              <KontakTab
                data={content.contact}
                onSave={(d) => handleSave("contact", d)}
              />
            )}
            {content && activeTab === "about" && (
              <AboutPageTab
                data={content.contact}
                onSave={(d) => handleSave("contact", d)}
              />
            )}
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <Modal
          title="Ubah password"
          size="sm"
          onClose={() => setShowPasswordModal(false)}
          onSubmit={handleChangePassword}
          error={passwordError}
          saving={passwordSaving}
          submitLabel="Simpan password"
        >
          {passwordSuccess && (
            <div className="a-alert a-ok" role="status">
              <Ico icon={CheckmarkCircle02Icon} />
              <span>Password berhasil diubah.</span>
            </div>
          )}
          <PasswordField
            id="current-password"
            label="Password lama"
            value={passwordForm.currentPassword}
            onChange={(v) =>
              setPasswordForm({ ...passwordForm, currentPassword: v })
            }
            autoComplete="current-password"
          />
          <PasswordField
            id="new-password"
            label="Password baru"
            value={passwordForm.newPassword}
            onChange={(v) =>
              setPasswordForm({ ...passwordForm, newPassword: v })
            }
            autoComplete="new-password"
            hint="Minimal 6 karakter."
          />
          <PasswordField
            id="confirm-password"
            label="Ulangi password baru"
            value={passwordForm.confirmPassword}
            onChange={(v) =>
              setPasswordForm({ ...passwordForm, confirmPassword: v })
            }
            autoComplete="new-password"
          />
        </Modal>
      )}
    </div>
  );
}
