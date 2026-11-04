"use client";

import { useState } from "react";
import { StatisticsData, StatisticItem } from "@/types/content";
import Toast, { ToastType } from "./Toast";

interface StatisticsTabProps {
  data: StatisticsData;
  onSave: (data: StatisticsData) => Promise<void>;
}

export default function StatisticsTab({ data, onSave }: StatisticsTabProps) {
  const [items, setItems] = useState<StatisticItem[]>(data.items);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

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
      await onSave({ items });
      setToast({ message: "Statistik berhasil disimpan.", type: "success" });
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
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-ink">Statistik</h2>
        <p className="text-mu text-sm">
          Edit 3 metrik statistik yang ditampilkan di landing page.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="border border-ln rounded-xl p-5 space-y-4 bg-bg"
            >
              <h3 className="text-sm font-bold text-ink">Metrik {index + 1}</h3>
              <div>
                <label className="block text-xs font-semibold text-mu mb-1">
                  Label
                </label>
                <input
                  type="text"
                  maxLength={30}
                  value={item.label}
                  onChange={(e) => updateItem(index, "label", e.target.value)}
                  className="w-full px-3 py-2 border border-ln rounded-lg text-sm focus:ring-2 focus:ring-y outline-none bg-surf"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-mu mb-1">
                  Nilai
                </label>
                <input
                  type="number"
                  min={0}
                  step="any"
                  value={item.value}
                  onChange={(e) =>
                    updateItem(index, "value", parseFloat(e.target.value) || 0)
                  }
                  className="w-full px-3 py-2 border border-ln rounded-lg text-sm focus:ring-2 focus:ring-y outline-none bg-surf"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-mu mb-1">
                  Suffix
                </label>
                <input
                  type="text"
                  value={item.suffix}
                  onChange={(e) => updateItem(index, "suffix", e.target.value)}
                  className="w-full px-3 py-2 border border-ln rounded-lg text-sm focus:ring-2 focus:ring-y outline-none bg-surf"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="pt-4 border-t border-ln">
          <button type="submit" disabled={saving} className="btn bd">
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
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
