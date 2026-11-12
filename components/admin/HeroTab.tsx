"use client";

import { useState, type FormEvent } from "react";
import { Add01Icon, Delete02Icon, Megaphone01Icon } from "@hugeicons/core-free-icons";
import { ContactData } from "@/types/content";
import Toast, { ToastType } from "./Toast";
import PageHeader from "./PageHeader";
import SectionHead from "./SectionHead";
import SaveBar from "./SaveBar";
import Ico from "./Ico";

interface HeroTabProps {
  /** Hero disimpan di data `contact` (heroHeadlines + heroSubheadlines). */
  data: ContactData;
  onSave: (data: ContactData) => Promise<void>;
}

/** Satu slide = satu judul + satu sub-judul (di data berupa dua array paralel). */
interface Slide {
  id: number;
  headline: string;
  sub: string;
}

function toSlides(data: ContactData): Slide[] {
  const heads = data.heroHeadlines ?? [];
  const subs = data.heroSubheadlines ?? [];
  const count = Math.max(heads.length, subs.length);
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    headline: heads[i] ?? "",
    sub: subs[i] ?? "",
  }));
}

const snap = (slides: Slide[]) =>
  JSON.stringify(slides.map(({ headline, sub }) => ({ headline, sub })));

export default function HeroTab({ data, onSave }: HeroTabProps) {
  const [slides, setSlides] = useState<Slide[]>(() => toSlides(data));
  const [baseline, setBaseline] = useState(() => snap(toSlides(data)));
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const dirty = snap(slides) !== baseline;

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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Slide yang benar-benar kosong dibuang. Hero di website memakai array apa adanya,
    // jadi slide tanpa judul, atau tanpa slide sama sekali, akan merusak tampilan.
    const filled = slides.filter((s) => s.headline.trim() || s.sub.trim());
    if (filled.length === 0) {
      setToast({
        message: "Minimal 1 slide hero dengan judul diperlukan.",
        type: "error",
      });
      return;
    }
    const missing = filled.findIndex((s) => !s.headline.trim());
    if (missing !== -1) {
      setToast({
        message: `Slide ${missing + 1} belum punya judul.`,
        type: "error",
      });
      return;
    }

    setSaving(true);
    try {
      await onSave({
        ...data,
        heroHeadlines: filled.map((s) => s.headline.trim()),
        heroSubheadlines: filled.map((s) => s.sub.trim()),
      });
      const cleaned = filled.map((s) => ({
        ...s,
        headline: s.headline.trim(),
        sub: s.sub.trim(),
      }));
      setSlides(cleaned);
      setBaseline(snap(cleaned));
      setToast({ message: "Hero disimpan.", type: "success" });
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
        title="Hero"
        description="Bagian paling atas beranda. Slide berganti otomatis di website."
      />

      <section className="a-card">
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
                  onClick={() =>
                    setSlides((prev) => prev.filter((x) => x.id !== s.id))
                  }
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
                      onChange={(e) => updateSlide(s.id, "sub", e.target.value)}
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

      <SaveBar dirty={dirty} saving={saving} />

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
