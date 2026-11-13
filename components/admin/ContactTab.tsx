"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  Add01Icon,
  Call02Icon,
  Delete02Icon,
  Facebook01Icon,
  File01Icon,
  Home01Icon,
  InstagramIcon,
  Location01Icon,
  Megaphone01Icon,
  SparklesIcon,
  WhatsappIcon,
} from "@hugeicons/core-free-icons";
import { ContactData } from "@/types/content";
import Toast, { ToastType } from "./Toast";
import PhotoUpload from "./PhotoUpload";
import HugeiconPicker from "./HugeiconPicker";
import PageHeader from "./PageHeader";
import SaveBar from "./SaveBar";
import Ico from "./Ico";

interface ContactTabProps {
  data: ContactData;
  onSave: (data: ContactData) => Promise<void>;
}

type Commitment = NonNullable<ContactData["commitments"]>[number];

/** Satu slide hero = satu judul + satu sub-judul (di data disimpan sebagai dua array paralel). */
interface Slide {
  id: number;
  headline: string;
  sub: string;
}

const SECTIONS: { id: string; label: string }[] = [
  { id: "contact-hero", label: "Teks hero" },
  { id: "contact-home", label: "Beranda" },
  { id: "contact-about", label: "Halaman Tentang" },
  { id: "contact-com", label: "Komitmen" },
  { id: "contact-kontak", label: "Kontak" },
];

function SectionHead({
  icon,
  title,
  description,
}: {
  icon: IconSvgElement;
  title: string;
  description: string;
}) {
  return (
    <div className="a-sec-h">
      <div className="a-ib a-soft">
        <Ico icon={icon} />
      </div>
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function ContactTab({ data, onSave }: ContactTabProps) {
  const [slides, setSlides] = useState<Slide[]>(() => {
    const heads = data.heroHeadlines ?? [];
    const subs = data.heroSubheadlines ?? [];
    const count = Math.max(heads.length, subs.length);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      headline: heads[i] ?? "",
      sub: subs[i] ?? "",
    }));
  });
  const [homeAboutText, setHomeAboutText] = useState(data.homeAboutText ?? "");
  const [aboutParagraphs, setAboutParagraphs] = useState(
    data.aboutParagraphs?.join("\n\n") ?? "",
  );
  const [heroImageUrl, setHeroImageUrl] = useState(data.heroImageUrl ?? "");
  const [commitments, setCommitments] = useState<Commitment[]>(
    data.commitments ?? [],
  );
  const [whatsappUrl, setWhatsappUrl] = useState(data.whatsappUrl);
  const [phone, setPhone] = useState(data.phone);
  const [address, setAddress] = useState(data.address);
  const [instagram, setInstagram] = useState(data.socialMedia.instagram ?? "");
  const [facebook, setFacebook] = useState(data.socialMedia.facebook ?? "");

  const snapshot = JSON.stringify({
    slides: slides.map(({ headline, sub }) => ({ headline, sub })),
    homeAboutText,
    aboutParagraphs,
    heroImageUrl,
    commitments,
    whatsappUrl,
    phone,
    address,
    instagram,
    facebook,
  });
  const [baseline, setBaseline] = useState(snapshot);
  const dirty = snapshot !== baseline;

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);

  // Scroll-spy: tandai bagian yang sedang terlihat di area gulir admin.
  useEffect(() => {
    const first = document.getElementById(SECTIONS[0].id);
    const scroller = first?.closest<HTMLElement>(".a-scroll");
    if (!scroller) return;
    function onScroll() {
      const top = scroller!.getBoundingClientRect().top + 140;
      let current = SECTIONS[0].id;
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= top) current = s.id;
      }
      setActiveSection(current);
    }
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, []);

  function goTo(id: string) {
    setActiveSection(id);
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function updateSlide(id: number, field: "headline" | "sub", value: string) {
    setSlides((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    );
  }

  function addSlide() {
    setSlides((prev) => [
      ...prev,
      {
        id: prev.reduce((max, s) => Math.max(max, s.id), -1) + 1,
        headline: "",
        sub: "",
      },
    ]);
  }

  function removeSlide(id: number) {
    setSlides((prev) => prev.filter((s) => s.id !== id));
  }

  function updateCommitment(
    index: number,
    field: "title" | "description" | "icon",
    value: string,
  ) {
    setCommitments((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Slide yang benar-benar kosong dibuang. Hero di website memakai array apa adanya,
    // jadi slide tanpa judul atau tanpa slide sama sekali akan merusak tampilan.
    const filled = slides.filter((s) => s.headline.trim() || s.sub.trim());
    if (filled.length === 0) {
      setToast({
        message: "Minimal 1 slide hero dengan judul diperlukan.",
        type: "error",
      });
      goTo("contact-hero");
      return;
    }
    const missing = filled.findIndex((s) => !s.headline.trim());
    if (missing !== -1) {
      setToast({
        message: `Slide ${missing + 1} belum punya judul.`,
        type: "error",
      });
      goTo("contact-hero");
      return;
    }

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
        heroImageUrl: heroImageUrl.trim() || undefined,
        homeAboutText: homeAboutText.trim(),
        aboutParagraphs: aboutParagraphs
          .split("\n\n")
          .map((p) => p.trim())
          .filter(Boolean),
        commitments,
        heroHeadlines: filled.map((s) => s.headline.trim()),
        heroSubheadlines: filled.map((s) => s.sub.trim()),
      });
      // Tampilkan slide yang sudah dirapikan, lalu anggap kondisi ini sebagai yang tersimpan.
      const cleaned = filled.map((s) => ({
        ...s,
        headline: s.headline.trim(),
        sub: s.sub.trim(),
      }));
      setSlides(cleaned);
      setBaseline(
        JSON.stringify({
          slides: cleaned.map(({ headline, sub }) => ({ headline, sub })),
          homeAboutText,
          aboutParagraphs,
          heroImageUrl,
          commitments,
          whatsappUrl,
          phone,
          address,
          instagram,
          facebook,
        }),
      );
      setToast({ message: "Perubahan disimpan.", type: "success" });
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : "Gagal menyimpan data.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PageHeader
        title="General & kontak"
        description="Teks beranda, halaman Tentang, dan informasi kontak perusahaan."
      />

      <nav className="a-anchors" aria-label="Bagian halaman">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            className={activeSection === s.id ? "a-on" : ""}
            onClick={() => goTo(s.id)}
          >
            {s.label}
          </button>
        ))}
      </nav>

      <div className="a-gen">
        {/* ===== Hero ===== */}
        <section className="a-card" id="contact-hero">
          <SectionHead
            icon={Megaphone01Icon}
            title="Teks hero beranda"
            description="Tiap slide punya judul dan sub-judul sendiri. Tekan Enter di judul untuk memisah baris."
          />
          <div className="a-slides">
            {slides.map((s, i) => (
              <div key={s.id} className="a-slide">
                <div className="a-slide-h">
                  <b>
                    <span>{i + 1}</span>Slide {i + 1}
                  </b>
                  <button
                    type="button"
                    className="a-icon-btn a-sm a-del"
                    onClick={() => removeSlide(s.id)}
                    title="Hapus slide"
                    aria-label={`Hapus slide ${i + 1}`}
                  >
                    <Ico icon={Delete02Icon} />
                  </button>
                </div>
                <div className="a-slide-b">
                  <div>
                    <div className="a-field">
                      <label htmlFor={`hl-${s.id}`}>Judul</label>
                      <textarea
                        id={`hl-${s.id}`}
                        className="a-input a-ta"
                        rows={3}
                        value={s.headline}
                        onChange={(e) =>
                          updateSlide(s.id, "headline", e.target.value)
                        }
                        placeholder="Tulis judul, Enter untuk baris baru"
                      />
                    </div>
                    <div className="a-field">
                      <label htmlFor={`sh-${s.id}`}>Sub-judul</label>
                      <textarea
                        id={`sh-${s.id}`}
                        className="a-input a-ta"
                        rows={2}
                        value={s.sub}
                        onChange={(e) =>
                          updateSlide(s.id, "sub", e.target.value)
                        }
                        placeholder="Satu atau dua kalimat pendukung"
                      />
                    </div>
                  </div>
                  <div className="a-hp" aria-label="Pratinjau slide">
                    <span className="a-k">Pratinjau</span>
                    <h4 style={{ whiteSpace: "pre-line" }}>
                      {s.headline || "Judul slide"}
                    </h4>
                    <p>{s.sub}</p>
                  </div>
                </div>
              </div>
            ))}
            <button type="button" className="a-add-slide" onClick={addSlide}>
              <Ico icon={Add01Icon} />
              Tambah slide
            </button>
          </div>
        </section>

        {/* ===== Beranda ===== */}
        <section className="a-card" id="contact-home">
          <SectionHead
            icon={Home01Icon}
            title="Mitra perjalanan di beranda"
            description="Paragraf pengantar yang tampil di bagian tentang pada beranda."
          />
          <div className="a-field">
            <label htmlFor="g-home-t">Paragraf pengantar</label>
            <textarea
              id="g-home-t"
              className="a-input a-ta"
              rows={4}
              value={homeAboutText}
              onChange={(e) => setHomeAboutText(e.target.value)}
            />
          </div>
        </section>

        {/* ===== Halaman Tentang ===== */}
        <section className="a-card" id="contact-about">
          <SectionHead
            icon={File01Icon}
            title="Halaman Tentang"
            description="Isi cerita perusahaan dan gambar yang tampil di kotak emas pada halaman /about."
          />
          <div className="a-field">
            <label htmlFor="g-about-t">
              Paragraf
              <span className="a-opt">
                Pisahkan paragraf dengan satu baris kosong
              </span>
            </label>
            <textarea
              id="g-about-t"
              className="a-input a-ta"
              rows={9}
              value={aboutParagraphs}
              onChange={(e) => setAboutParagraphs(e.target.value)}
            />
          </div>
          <PhotoUpload
            value={heroImageUrl}
            onChange={setHeroImageUrl}
            category="services"
            label="Gambar hero"
            hint="Maksimal 5 MB"
            contain
            wide
          />
        </section>

        {/* ===== Komitmen ===== */}
        <section className="a-card" id="contact-com">
          <SectionHead
            icon={SparklesIcon}
            title="Komitmen kami"
            description="Janji utama beserta ikonnya."
          />
          {commitments.length === 0 ? (
            <p className="a-hint">Belum ada komitmen.</p>
          ) : (
            <div className="a-grid a-g3">
              {commitments.map((item, idx) => (
                <div key={idx} className="a-com">
                  <div className="a-field">
                    <label htmlFor={`com-t-${idx}`}>Judul</label>
                    <input
                      id={`com-t-${idx}`}
                      className="a-input"
                      type="text"
                      value={item.title}
                      onChange={(e) =>
                        updateCommitment(idx, "title", e.target.value)
                      }
                    />
                  </div>
                  <div className="a-field">
                    <label htmlFor={`com-d-${idx}`}>Deskripsi</label>
                    <textarea
                      id={`com-d-${idx}`}
                      className="a-input a-ta"
                      rows={3}
                      value={item.description}
                      onChange={(e) =>
                        updateCommitment(idx, "description", e.target.value)
                      }
                    />
                  </div>
                  <HugeiconPicker
                    value={item.icon ?? ""}
                    onChange={(key) => updateCommitment(idx, "icon", key)}
                    label="Ikon"
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ===== Kontak ===== */}
        <section className="a-card" id="contact-kontak">
          <SectionHead
            icon={Call02Icon}
            title="Kontak & media sosial"
            description="Dipakai di footer, tombol WhatsApp, dan data bisnis untuk mesin pencari."
          />
          <div className="a-row2">
            <div className="a-field">
              <label htmlFor="k-wa">Tautan WhatsApp</label>
              <div className="a-has-ic">
                <Ico icon={WhatsappIcon} />
                <input
                  id="k-wa"
                  className="a-input"
                  type="text"
                  value={whatsappUrl}
                  onChange={(e) => setWhatsappUrl(e.target.value)}
                />
              </div>
            </div>
            <div className="a-field">
              <label htmlFor="k-tel">Telepon</label>
              <div className="a-has-ic">
                <Ico icon={Call02Icon} />
                <input
                  id="k-tel"
                  className="a-input"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="a-field">
            <label htmlFor="k-addr">Alamat</label>
            <div className="a-has-ic a-ta">
              <Ico icon={Location01Icon} />
              <textarea
                id="k-addr"
                className="a-input"
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
          <div className="a-row2">
            <div className="a-field">
              <label htmlFor="k-ig">Instagram</label>
              <div className="a-has-ic">
                <Ico icon={InstagramIcon} />
                <input
                  id="k-ig"
                  className="a-input"
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                />
              </div>
            </div>
            <div className="a-field">
              <label htmlFor="k-fb">Facebook</label>
              <div className="a-has-ic">
                <Ico icon={Facebook01Icon} />
                <input
                  id="k-fb"
                  className="a-input"
                  type="text"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      <SaveBar dirty={dirty} saving={saving} label="Simpan semua perubahan" />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </form>
  );
}
