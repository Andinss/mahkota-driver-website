"use client";

import { useState } from "react";
import { ContactData } from "@/types/content";
import Toast, { ToastType } from "./Toast";
import PhotoUpload from "./PhotoUpload";
import Icon from "@/components/ui/Icon";

interface ContactTabProps {
  data: ContactData;
  onSave: (data: ContactData) => Promise<void>;
}

export default function ContactTab({ data, onSave }: ContactTabProps) {
  // ... (state yang sudah ada sebelumnya)
  const [whatsappUrl, setWhatsappUrl] = useState(data.whatsappUrl);
  const [phone, setPhone] = useState(data.phone);
  const [address, setAddress] = useState(data.address);
  const [instagram, setInstagram] = useState(data.socialMedia.instagram ?? "");
  const [facebook, setFacebook] = useState(data.socialMedia.facebook ?? "");
  const [heroImageUrl, setHeroImageUrl] = useState(data.heroImageUrl ?? "");

  // STATE BARU
  const [homeAboutText, setHomeAboutText] = useState(data.homeAboutText ?? "");
  const [aboutParagraphs, setAboutParagraphs] = useState(
    data.aboutParagraphs?.join("\n\n") ?? "",
  );
  const [commitments, setCommitments] = useState(data.commitments ?? []);

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        ...data,
        whatsappUrl: whatsappUrl.trim(),
        phone: phone.trim(),
        address: address.trim(),
        socialMedia: {
          instagram: instagram.trim() || null,
          facebook: facebook.trim() || null,
        },
        heroImageUrl: heroImageUrl.trim() || undefined,
        homeAboutText: homeAboutText.trim(),
        // Pisahkan kembali berdasarkan 2 enter
        aboutParagraphs: aboutParagraphs
          .split("\n\n")
          .map((p) => p.trim())
          .filter(Boolean),
        commitments: commitments,
      });
      setToast({ message: "Data berhasil disimpan.", type: "success" });
    } catch (err) {
      setToast({ message: "Gagal menyimpan data.", type: "error" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 md:p-10 space-y-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ==== SECTION 1: TEKS BERANDA ==== */}
        <section className="space-y-4 bg-bg p-6 rounded-2xl border border-ln">
          <h2 className="text-lg font-bold text-ink">Teks Beranda</h2>
          <div>
            <label className="block text-sm font-medium text-ink mb-2">
              Paragraf "Mitra Perjalanan" (Beranda)
            </label>
            <textarea
              value={homeAboutText}
              onChange={(e) => setHomeAboutText(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-ln rounded-xl text-sm focus:ring-2 focus:ring-y outline-none resize-y"
            />
          </div>
        </section>

        {/* ==== SECTION 2: PARAGRAF HALAMAN TENTANG ==== */}
        <section className="space-y-4 bg-bg p-6 rounded-2xl border border-ln">
          <h2 className="text-lg font-bold text-ink">
            Paragraf Halaman Tentang
          </h2>
          <p className="text-xs text-mu mb-2">
            Pisahkan antar paragraf dengan <strong>2x Enter</strong>.
          </p>
          <textarea
            value={aboutParagraphs}
            onChange={(e) => setAboutParagraphs(e.target.value)}
            rows={8}
            className="w-full px-4 py-3 border border-ln rounded-xl text-sm focus:ring-2 focus:ring-y outline-none resize-y font-mono"
          />
        </section>

        {/* ==== SECTION 3: KOMITMEN ==== */}
        <section className="space-y-4 bg-bg p-6 rounded-2xl border border-ln">
          <h2 className="text-lg font-bold text-ink">Komitmen Kami</h2>
          <div className="grid gap-4">
            {commitments.map((item, idx) => (
              <div
                key={idx}
                className="p-4 bg-surf rounded-xl border border-ln space-y-3"
              >
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => {
                    const newC = [...commitments];
                    newC[idx].title = e.target.value;
                    setCommitments(newC);
                  }}
                  className="w-full px-3 py-2 border border-ln rounded-lg text-sm font-bold"
                  placeholder="Judul"
                />
                <textarea
                  value={item.description}
                  onChange={(e) => {
                    const newC = [...commitments];
                    newC[idx].description = e.target.value;
                    setCommitments(newC);
                  }}
                  rows={2}
                  className="w-full px-3 py-2 border border-ln rounded-lg text-sm"
                  placeholder="Deskripsi"
                />
              </div>
            ))}
          </div>
        </section>

        {/* ==== SECTION 4: FOTO HERO ==== */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-ink">Gambar Hero</h2>
          <PhotoUpload
            value={heroImageUrl}
            onChange={setHeroImageUrl}
            category="services"
          />
        </section>

        {/* ==== SECTION 5: KONTAK ==== */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-ink">Kontak</h2>
          <input
            type="text"
            value={whatsappUrl}
            onChange={(e) => setWhatsappUrl(e.target.value)}
            className="w-full px-3 py-2 border border-ln rounded-lg text-sm"
            placeholder="WhatsApp URL"
          />
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 border border-ln rounded-lg text-sm"
            placeholder="Telepon"
          />
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-ln rounded-lg text-sm"
            placeholder="Alamat"
          />
          <input
            type="text"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            className="w-full px-3 py-2 border border-ln rounded-lg text-sm"
            placeholder="Instagram URL"
          />
          <input
            type="text"
            value={facebook}
            onChange={(e) => setFacebook(e.target.value)}
            className="w-full px-3 py-2 border border-ln rounded-lg text-sm"
            placeholder="Facebook URL"
          />
        </section>

        <div className="pt-4 border-t border-ln">
          <button type="submit" disabled={saving} className="btn bd">
            {saving ? "Menyimpan..." : "Simpan Semua Perubahan"}
          </button>
        </div>
      </form>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
