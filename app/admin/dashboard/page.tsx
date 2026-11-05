"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AllContent } from "@/types/content";
import AdminSidebar from "@/components/admin/AdminSidebar";
import StatisticsTab from "@/components/admin/StatisticsTab";
import TestimonialsTab from "@/components/admin/TestimonialsTab";
import ServicesTab from "@/components/admin/ServicesTab";
import FleetTab from "@/components/admin/FleetTab";
import RegistrationTab from "@/components/admin/RegistrationTab";
import ContactTab from "@/components/admin/ContactTab";
import Icon from "@/components/ui/Icon";

type TabKey =
  | "statistics"
  | "testimonials"
  | "services"
  | "fleet"
  | "registration"
  | "contact";

const TAB_TITLES: Record<TabKey, { title: string; desc: string }> = {
  statistics: {
    title: "Statistik",
    desc: "Kelola angka metrik yang tampil di beranda.",
  },
  testimonials: {
    title: "Testimoni",
    desc: "Kelola ulasan dari mitra driver.",
  },
  services: {
    title: "Layanan & Keunggulan",
    desc: "Atur skema sewa dan alasan memilih Mahkota Drive.",
  },
  fleet: {
    title: "Katalog Armada",
    desc: "Tambah, edit, dan hapus daftar mobil Anda.",
  },
  registration: {
    title: "Cara Bergabung",
    desc: "Atur langkah pendaftaran dan tautan formulir.",
  },
  contact: {
    title: "General & Kontak",
    desc: "Ubah teks tentang, kontak, dan media sosial.",
  },
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("statistics");
  const [content, setContent] = useState<AllContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
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

  async function handleSave(category: TabKey, data: unknown) {
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
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
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
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-ln border-t-y"></div>
          <p className="text-mu font-medium">Memuat data...</p>
        </div>
      </div>
    );

  if (error && !content)
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <p className="text-red-500 mb-4 font-medium">{error}</p>
          <button onClick={() => window.location.reload()} className="btn bd">
            Coba Lagi
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-bg flex font-body">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        onOpenPassword={() => setShowPasswordModal(true)}
        isLoggingOut={loggingOut}
      />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-surf border-b border-ln flex items-center justify-between px-6 lg:px-10 shrink-0 sticky top-0 z-30">
          <div className="pl-12 md:pl-0">
            <h1 className="text-xl md:text-2xl font-extrabold text-ink tracking-tight">
              {TAB_TITLES[activeTab].title}
            </h1>
            <p className="text-xs md:text-sm text-mu font-medium mt-0.5">
              {TAB_TITLES[activeTab].desc}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-2 text-sm font-semibold text-mu hover:text-ink transition-colors bg-bg px-4 py-2 rounded-full"
            >
              <Icon name="open_in_new" className="text-[18px]" /> Lihat Website
            </a>
            <div className="h-9 w-9 rounded-full bg-y text-navy flex items-center justify-center font-bold text-sm shadow-sm ml-2">
              A
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10">
          <div className="max-w-5xl mx-auto">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div className="bg-surf rounded-[32px] shadow-sm border border-ln overflow-hidden min-h-[500px]">
              {content && activeTab === "statistics" && (
                <StatisticsTab
                  data={content.statistics}
                  onSave={(d) => handleSave("statistics", d)}
                />
              )}
              {content && activeTab === "testimonials" && (
                <TestimonialsTab
                  data={content.testimonials}
                  onSave={(d) => handleSave("testimonials", d)}
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
              {content && activeTab === "registration" && (
                <RegistrationTab
                  data={content.registration}
                  onSave={(d) => handleSave("registration", d)}
                />
              )}
              {content && activeTab === "contact" && (
                <ContactTab
                  data={content.contact}
                  onSave={(d) => handleSave("contact", d)}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modal Password */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowPasswordModal(false)}
          />
          <div className="relative w-full max-w-md bg-surf rounded-[32px] shadow-2xl p-8 border border-ln">
            <h3 className="text-xl font-extrabold text-ink mb-6">
              Ubah Password
            </h3>
            {passwordError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm">
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-xl text-sm">
                Password berhasil diubah!
              </div>
            )}
            <form onSubmit={handleChangePassword} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">
                  Password Lama
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-ln rounded-xl text-sm focus:ring-2 focus:ring-y outline-none bg-bg transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">
                  Password Baru
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-ln rounded-xl text-sm focus:ring-2 focus:ring-y outline-none bg-bg transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-2">
                  Konfirmasi Password
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-ln rounded-xl text-sm focus:ring-2 focus:ring-y outline-none bg-bg transition-all"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="btn bo"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={passwordSaving}
                  className="btn bd"
                >
                  {passwordSaving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
