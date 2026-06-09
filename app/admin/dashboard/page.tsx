'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AllContent } from '@/types/content';
import StatisticsTab from '@/components/admin/StatisticsTab';
import TestimonialsTab from '@/components/admin/TestimonialsTab';
import ServicesTab from '@/components/admin/ServicesTab';
import FleetTab from '@/components/admin/FleetTab';
import RegistrationTab from '@/components/admin/RegistrationTab';
import ContactTab from '@/components/admin/ContactTab';

type TabKey = 'statistics' | 'testimonials' | 'services' | 'fleet' | 'registration' | 'contact';

interface TabConfig {
  key: TabKey;
  label: string;
}

const TABS: TabConfig[] = [
  { key: 'statistics', label: 'Statistik' },
  { key: 'testimonials', label: 'Testimoni' },
  { key: 'services', label: 'Layanan' },
  { key: 'fleet', label: 'Armada' },
  { key: 'registration', label: 'Cara Daftar' },
  { key: 'contact', label: 'General' },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>('statistics');
  const [content, setContent] = useState<AllContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch('/api/content');
        if (!res.ok) {
          throw new Error('Gagal memuat data konten');
        }
        const data: AllContent = await res.json();
        setContent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      const res = await fetch('/api/admin/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/admin');
      } else {
        setError('Gagal logout');
        setLoggingOut(false);
      }
    } catch {
      setError('Gagal logout');
      setLoggingOut(false);
    }
  }

  async function handleSave(category: TabKey, data: unknown) {
    try {
      const res = await fetch(`/api/admin/content/${category}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Gagal menyimpan');
      }

      // Update local state with saved data
      setContent((prev) => {
        if (!prev) return prev;
        return { ...prev, [category]: data };
      });
    } catch (err) {
      throw err;
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setPasswordError('Semua field wajib diisi.');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Password baru minimal 6 karakter.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Konfirmasi password tidak cocok.');
      return;
    }

    setPasswordSaving(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      if (res.ok) {
        setPasswordSuccess(true);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordSuccess(false);
        }, 1500);
      } else {
        const data = await res.json();
        setPasswordError(data.error || 'Gagal mengubah password.');
      }
    } catch {
      setPasswordError('Gagal terhubung ke server.');
    } finally {
      setPasswordSaving(false);
    }
  }
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-gray-600 font-body">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error && !content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 font-body mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gold text-brand-black rounded font-medium hover:bg-gold-light transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-body">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="Mahkota Drive"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <h1 className="text-lg font-heading font-bold text-gold md:text-xl">
                Mahkota Drive <span className="text-gray-500 font-body text-sm font-normal">— Website Administrator</span>
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                title="Ubah Password"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </button>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
                {loggingOut ? 'Keluar...' : 'Keluar'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white border-b border-gray-200" aria-label="Tab navigasi admin">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto -mb-px">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`whitespace-nowrap py-3 px-4 border-b-2 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'border-gold text-gold'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                aria-selected={activeTab === tab.key}
                role="tab"
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Error Banner */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      )}

      {/* Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {content && activeTab === 'statistics' && (
            <StatisticsTab
              data={content.statistics}
              onSave={(data) => handleSave('statistics', data)}
            />
          )}
          {content && activeTab === 'testimonials' && (
            <TestimonialsTab
              data={content.testimonials}
              onSave={(data) => handleSave('testimonials', data)}
            />
          )}
          {content && activeTab === 'services' && (
            <ServicesTab
              data={content.services}
              onSave={(data) => handleSave('services', data)}
            />
          )}
          {content && activeTab === 'fleet' && (
            <FleetTab
              data={content.fleet}
              onSave={(data) => handleSave('fleet', data)}
            />
          )}
          {content && activeTab === 'registration' && (
            <RegistrationTab
              data={content.registration}
              onSave={(data) => handleSave('registration', data)}
            />
          )}
          {content && activeTab === 'contact' && (
            <ContactTab
              data={content.contact}
              onSave={(data) => handleSave('contact', data)}
            />
          )}
        </div>
      </main>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setShowPasswordModal(false); setPasswordError(null); setPasswordSuccess(false); }} />
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Ubah Password</h3>
            {passwordError && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{passwordError}</div>}
            {passwordSuccess && <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">Password berhasil diubah!</div>}
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password Lama</label>
                <input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent" autoFocus />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
                <input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent" placeholder="Minimal 6 karakter" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password Baru</label>
                <input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowPasswordModal(false); setPasswordError(null); setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); }} disabled={passwordSaving} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50">Batal</button>
                <button type="submit" disabled={passwordSaving} className="px-4 py-2 bg-gold text-brand-black text-sm rounded-lg font-medium hover:bg-gold-light transition-colors disabled:opacity-50">
                  {passwordSaving ? 'Menyimpan...' : 'Ubah Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
