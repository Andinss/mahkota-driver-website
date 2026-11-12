"use client";

import { useState } from "react";
import { ContactData, StatisticsData, StatisticItem } from "@/types/content";
import Toast, { ToastType } from "./Toast";
import PageHeader from "./PageHeader";
import SaveBar from "./SaveBar";
import SectionHead from "./SectionHead";
import { Home01Icon } from "@hugeicons/core-free-icons";

interface StatisticsTabProps {
  data: StatisticsData;
  onSave: (data: StatisticsData) => Promise<void>;
  /** Paragraf pengantar ("Mitra perjalanan") disimpan di data contact. */
  contact: ContactData;
  onSaveContact: (data: ContactData) => Promise<void>;
}

export default function StatisticsTab({
  data,
  onSave,
  contact,
  onSaveContact,
}: StatisticsTabProps) {
  const [intro, setIntro] = useState(contact.homeAboutText ?? "");
  const [savedIntro, setSavedIntro] = useState(contact.homeAboutText ?? "");
  const [items, setItems] = useState<StatisticItem[]>(data.items);
  const [saved, setSaved] = useState<StatisticItem[]>(data.items);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const statsDirty = JSON.stringify(items) !== JSON.stringify(saved);
  const introDirty = intro !== savedIntro;
  const dirty = statsDirty || introDirty;

  function updateItem(
    index: number,
    field: keyof StatisticItem,
    value: string | number,
  ) {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (statsDirty) {
        await onSave({ items });
        setSaved(items);
      }
      if (introDirty) {
        await onSaveContact({ ...contact, homeAboutText: intro.trim() });
        setSavedIntro(intro);
      }
      setToast({ message: "Perubahan disimpan.", type: "success" });
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : "Gagal menyimpan.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PageHeader
        title="Tentang & statistik"
        description="Bagian “Tentang” di beranda: paragraf pengantar dan tiga angka di sebelahnya."
      />

      <section className="a-card" style={{ marginBottom: 24 }}>
        <SectionHead
          icon={Home01Icon}
          title="Mitra perjalanan di beranda"
          description="Paragraf pengantar yang tampil di samping angka statistik."
        />
        <div className="a-field" style={{ marginBottom: 0 }}>
          <label htmlFor="g-home-t">Paragraf pengantar</label>
          <textarea
            id="g-home-t"
            className="a-input a-ta"
            rows={4}
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
          />
        </div>
      </section>

      <div className="a-grid a-g3">
        {items.map((item, index) => (
          <article key={item.id} className="a-card">
            <div className="a-stat-prev">
              <div className="a-stat-num">
                {item.value}
                <em>{item.suffix}</em>
              </div>
              <div className="a-stat-lab">{item.label}</div>
            </div>

            <div className="a-field">
              <label htmlFor={`stat-label-${index}`}>
                Label
                <span className="a-count">{item.label.length}/30</span>
              </label>
              <input
                id={`stat-label-${index}`}
                className="a-input"
                type="text"
                maxLength={30}
                value={item.label}
                onChange={(e) => updateItem(index, "label", e.target.value)}
              />
            </div>

            <div className="a-row2">
              <div className="a-field">
                <label htmlFor={`stat-value-${index}`}>Nilai</label>
                <input
                  id={`stat-value-${index}`}
                  className="a-input"
                  type="number"
                  min={0}
                  step="any"
                  value={item.value}
                  onChange={(e) =>
                    updateItem(index, "value", parseFloat(e.target.value) || 0)
                  }
                />
              </div>
              <div className="a-field">
                <label htmlFor={`stat-suffix-${index}`}>Akhiran</label>
                <input
                  id={`stat-suffix-${index}`}
                  className="a-input"
                  type="text"
                  placeholder="+"
                  value={item.suffix}
                  onChange={(e) => updateItem(index, "suffix", e.target.value)}
                />
              </div>
            </div>
          </article>
        ))}
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
