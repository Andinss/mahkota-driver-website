"use client";

import { useState, type FormEvent } from "react";
import { File01Icon, SparklesIcon } from "@hugeicons/core-free-icons";
import { ContactData } from "@/types/content";
import Toast, { ToastType } from "./Toast";
import PhotoUpload from "./PhotoUpload";
import HugeiconPicker from "./HugeiconPicker";
import PageHeader from "./PageHeader";
import SectionHead from "./SectionHead";
import SaveBar from "./SaveBar";

interface AboutPageTabProps {
  data: ContactData;
  onSave: (data: ContactData) => Promise<void>;
}

type Commitment = NonNullable<ContactData["commitments"]>[number];

export default function AboutPageTab({ data, onSave }: AboutPageTabProps) {
  const initial = {
    aboutParagraphs: data.aboutParagraphs?.join("\n\n") ?? "",
    heroImageUrl: data.heroImageUrl ?? "",
    commitments: (data.commitments ?? []) as Commitment[],
  };
  const [aboutParagraphs, setAboutParagraphs] = useState(
    initial.aboutParagraphs,
  );
  const [heroImageUrl, setHeroImageUrl] = useState(initial.heroImageUrl);
  const [commitments, setCommitments] = useState<Commitment[]>(
    initial.commitments,
  );
  const [baseline, setBaseline] = useState(JSON.stringify(initial));
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const dirty =
    JSON.stringify({ aboutParagraphs, heroImageUrl, commitments }) !== baseline;

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
    setSaving(true);
    try {
      await onSave({
        ...data,
        aboutParagraphs: aboutParagraphs
          .split("\n\n")
          .map((p) => p.trim())
          .filter(Boolean),
        heroImageUrl: heroImageUrl.trim() || undefined,
        commitments,
      });
      setBaseline(
        JSON.stringify({ aboutParagraphs, heroImageUrl, commitments }),
      );
      setToast({ message: "Halaman Tentang disimpan.", type: "success" });
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
        title="Halaman Tentang"
        description="Isi halaman /about: cerita perusahaan, gambar, dan komitmen."
      />

      <div className="a-gen">
        <section className="a-card">
          <SectionHead
            icon={File01Icon}
            title="Cerita perusahaan"
            description="Paragraf dan gambar yang tampil di kotak emas pada halaman /about."
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

        <section className="a-card">
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
      </div>

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
