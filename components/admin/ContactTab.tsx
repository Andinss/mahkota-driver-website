'use client';

import { useState } from 'react';
import { ContactData } from '@/types/content';
import Toast, { ToastType } from './Toast';
import PhotoUpload from './PhotoUpload';

interface ContactTabProps {
  data: ContactData;
  onSave: (data: ContactData) => Promise<void>;
}

type SubTab = 'profil' | 'kontak';

export default function ContactTab({ data, onSave }: ContactTabProps) {
  const [whatsappUrl, setWhatsappUrl] = useState(data.whatsappUrl);
  const [phone, setPhone] = useState(data.phone);
  const [address, setAddress] = useState(data.address);
  const [instagram, setInstagram] = useState(data.socialMedia.instagram ?? '');
  const [facebook, setFacebook] = useState(data.socialMedia.facebook ?? '');
  const [heroDescription, setHeroDescription] = useState(data.heroDescription ?? '');
  const [heroImageUrl, setHeroImageUrl] = useState(data.heroImageUrl ?? '');
  const [appMockupUrl, setAppMockupUrl] = useState(data.appMockupUrl ?? '');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('profil');

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!whatsappUrl.trim()) newErrors.whatsappUrl = 'URL WhatsApp wajib diisi';
    if (!phone.trim()) newErrors.phone = 'Nomor telepon wajib diisi';
    if (!address.trim()) newErrors.address = 'Alamat wajib diisi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const contactData: ContactData = {
        whatsappUrl: whatsappUrl.trim(),
        phone: phone.trim(),
        address: address.trim(),
        socialMedia: {
          instagram: instagram.trim() || null,
          facebook: facebook.trim() || null,
        },
        heroDescription: heroDescription.trim() || undefined,
        heroImageUrl: heroImageUrl.trim() || undefined,
        appMockupUrl: appMockupUrl.trim() || undefined,
      };
      await onSave(contactData);
      setToast({ message: 'Data berhasil disimpan.', type: 'success' });
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : 'Gagal menyimpan data.', type: 'error' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Sub-Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex -mb-px">
          <button
            type="button"
            onClick={() => setActiveSubTab('profil')}
            className={`py-2.5 px-4 text-sm font-medium border-b-2 transition-colors ${activeSubTab === 'profil' ? 'border-gold text-gold' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            role="tab"
            aria-selected={activeSubTab === 'profil'}
          >
            Profil & Media
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('kontak')}
            className={`py-2.5 px-4 text-sm font-medium border-b-2 transition-colors ${activeSubTab === 'kontak' ? 'border-gold text-gold' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            role="tab"
            aria-selected={activeSubTab === 'kontak'}
          >
            Kontak & Sosial Media
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ===== Profil & Media Sub-Tab ===== */}
        {activeSubTab === 'profil' && (
          <div className="space-y-6">
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Deskripsi Bisnis (Hero)</h2>
              <div>
                <label htmlFor="heroDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi Mahkota Drive
                </label>
                <textarea
                  id="heroDescription"
                  value={heroDescription}
                  onChange={(e) => setHeroDescription(e.target.value)}
                  rows={6}
                  placeholder="Deskripsi bisnis yang ditampilkan di halaman utama..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent resize-y"
                />
                <p className="text-xs text-gray-400 mt-1">Ditampilkan di section Hero halaman utama. Kosongkan untuk menggunakan teks default.</p>
              </div>
            </section>

            <hr className="border-gray-200" />

            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Gambar</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <PhotoUpload
                    value={heroImageUrl}
                    onChange={(url) => setHeroImageUrl(url)}
                    category="services"
                  />
                  <p className="text-xs text-gray-400 mt-2">Gambar utama di section Hero (disarankan 1200×800px)</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mockup Aplikasi
                  </label>
                  <PhotoUpload
                    value={appMockupUrl}
                    onChange={(url) => setAppMockupUrl(url)}
                    category="services"
                  />
                  <p className="text-xs text-gray-400 mt-2">Screenshot/mockup aplikasi di section Unduh (disarankan 400×800px)</p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ===== Kontak & Sosial Media Sub-Tab ===== */}
        {activeSubTab === 'kontak' && (
          <div className="space-y-6">
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Informasi Kontak</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="whatsappUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    URL WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="whatsappUrl"
                    type="text"
                    value={whatsappUrl}
                    onChange={(e) => setWhatsappUrl(e.target.value)}
                    placeholder="https://wa.me/628xxxxxxxxxx"
                    className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent ${errors.whatsappUrl ? 'border-red-400' : 'border-gray-300'}`}
                  />
                  {errors.whatsappUrl && <p className="mt-1 text-xs text-red-500">{errors.whatsappUrl}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor Telepon <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phone"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent ${errors.phone ? 'border-red-400' : 'border-gray-300'}`}
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  placeholder="Alamat lengkap bisnis"
                  className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent resize-y ${errors.address ? 'border-red-400' : 'border-gray-300'}`}
                />
                {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
              </div>
            </section>

            <hr className="border-gray-200" />

            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Media Sosial</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="instagram" className="block text-sm text-gray-600 mb-1">Instagram</label>
                  <input
                    id="instagram"
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="https://instagram.com/mahkotadrive"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="facebook" className="block text-sm text-gray-600 mb-1">Facebook</label>
                  <input
                    id="facebook"
                    type="text"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    placeholder="https://facebook.com/mahkotadrive"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                  />
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Save Button — always visible */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-gold text-brand-black rounded-lg font-medium hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
