"use client";

import { useState } from "react";
import { ContactData } from "@/types/content";
import Toast, { ToastType } from "./Toast";
import PhotoUpload from "./PhotoUpload";
import HugeiconPicker from "./HugeiconPicker";

interface ContactTabProps {
  data: ContactData;
  onSave: (data: ContactData) => Promise<void>;
}

type Commitment = NonNullable<ContactData["commitments"]>[number];

export default function ContactTab({ data, onSave }: ContactTabProps) {
  const [whatsappUrl, setWhatsappUrl] = useState(data.whatsappUrl);
  const [phone, setPhone] = useState(data.phone);
  const [address, setAddress] = useState(data.address);
  const [instagram, setInstagram] = useState(data.socialMedia.instagram ?? "");
  const [facebook, setFacebook] = useState(data.socialMedia.facebook ?? "");
  const [heroImageUrl, setHeroImageUrl] = useState(data.heroImageUrl ?? "");
  const [homeAboutText, setHomeAboutText] = useState(data.homeAboutText ?? "");
  const [aboutParagraphs, setAboutParagraphs] = useState(
    data.aboutParagraphs?.join("\n\n") ?? "",
  );
  const [commitments, setCommitments] = useState<Commitment[]>(
    data.commitments ?? [],
  );

  // State untuk Hero Teks Dinamis
  const [heroHeadlines, setHeroHeadlines] = useState(
    data.heroHeadlines?.join("\n---\n") ?? "",
  );
  const [heroSubheadlines, setHeroSubheadlines] = useState(
    data.heroSubheadlines?.join("\n---\n") ?? "",
  );

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  function updateCommitment(
    index: number,
    field: "title" | "description" | "icon",
    value: string,
  ) {
    setCommitments((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  }

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
          instagram: instagram.trim(),
          facebook: facebook.trim(),
        },
        // Menyimpan Gambar Hero
        heroImageUrl: heroImageUrl.trim() || undefined,
        homeAboutText: homeAboutText.trim(),
        aboutParagraphs: aboutParagraphs
          .split("\n\n")
          .map((p) => p.trim())
          .filter(Boolean),
        commitments,
        // Menyimpan Teks Hero Dinamis
        heroHeadlines: heroHeadlines
          .split("\n---\n")
          .map((s) => s.trim())
          .filter(Boolean),
        heroSubheadlines: heroSubheadlines
          .split("\n---\n")
          .map((s) => s.trim())
          .filter(Boolean),
      });
      setToast({ message: "Data berhasil disimpan.", type: "success" });
    } catch {
      setToast({ message: "Gagal menyimpan data.", type: "error" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 md:p-10 space-y-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ==== SECTION HERO TEKS ==== */}
        <section className="space-y-4 bg-bg p-6 rounded-2xl border border-ln">
          <h2 className="text-lg font-bold text-ink">Teks Hero Section</h2>
          <p className="text-sm text-mu mb-4">
            Gunakan pemisah <code>---</code> di baris baru untuk memisahkan
            antar slide. Tekan Enter di dalam teks untuk memisahkan baris judul.
          </p>

          <div>
            <label className="block text-sm font-medium text-ink mb-2">
              Judul Utama (Headline)
            </label>
            <textarea
              value={heroHeadlines}
              onChange={(e) => setHeroHeadlines(e.target.value)}
              rows={8}
              className="w-full px-4 py-3 border border-ln rounded-xl text-sm focus:ring-2 focus:ring-y outline-none font-mono"
              placeholder="Narik Online&#10;Tanpa Beli&#10;Mobil.&#10;---&#10;Servis Gratis,..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-2">
              Sub-Judul (Deskripsi)
            </label>
            <textarea
              value={heroSubheadlines}
              onChange={(e) => setHeroSubheadlines(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 border border-ln rounded-xl text-sm focus:ring-2 focus:ring-y outline-none font-mono"
            />
          </div>
        </section>

        {/* ==== SECTION 1: TEKS BERANDA ==== */}
        <section className="space-y-4 bg-bg p-6 rounded-2xl border border-ln">
          <h2 className="text-lg font-bold text-ink">Teks Halaman Tentang</h2>
          <div>
            <label className="block text-sm font-medium text-ink mb-2">
              Paragraf &quot;Mitra Perjalanan&quot; (Beranda)
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
                  onChange={(e) =>
                    updateCommitment(idx, "title", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-ln rounded-lg text-sm font-bold"
                  placeholder="Judul"
                />
                <textarea
                  value={item.description}
                  onChange={(e) =>
                    updateCommitment(idx, "description", e.target.value)
                  }
                  rows={2}
                  className="w-full px-3 py-2 border border-ln rounded-lg text-sm"
                  placeholder="Deskripsi"
                />
                <HugeiconPicker
                  value={item.icon ?? ""}
                  onChange={(key) => updateCommitment(idx, "icon", key)}
                  label={`Icon Komitmen ${idx + 1}`}
                  helperText="Pilih ikon yang mewakili komitmen ini."
                />
              </div>
            ))}
          </div>
        </section>

        {/* ==== SECTION 4: FOTO HERO (YANG TADI HILANG) ==== */}
        <section className="space-y-4 bg-bg p-6 rounded-2xl border border-ln">
          <h2 className="text-lg font-bold text-ink">
            Gambar Hero (Halaman Tentang)
          </h2>
          <p className="text-xs text-mu mb-4">
            Gambar ini akan tampil di dalam kotak emas pada halaman /about.
          </p>
          <PhotoUpload
            value={heroImageUrl}
            onChange={setHeroImageUrl}
            category="services"
          />
        </section>

        {/* ==== SECTION 5: KONTAK ==== */}
        <section className="space-y-4 bg-bg p-6 rounded-2xl border border-ln">
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
