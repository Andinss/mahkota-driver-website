'use client';

import { useState } from 'react';
import { StatisticsData, StatisticItem } from '@/types/content';
import Toast, { ToastType } from './Toast';

interface StatisticsTabProps {
  data: StatisticsData;
  onSave: (data: StatisticsData) => Promise<void>;
}

export default function StatisticsTab({ data, onSave }: StatisticsTabProps) {
  const [items, setItems] = useState<StatisticItem[]>(data.items);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  function updateItem(index: number, field: keyof StatisticItem, value: string | number) {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    setErrors((prev) => {
      const key = `${index}-${field}`;
      if (prev[key]) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return prev;
    });
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    items.forEach((item, index) => {
      if (!item.label || item.label.length < 1 || item.label.length > 30) {
        newErrors[`${index}-label`] = 'Label harus 1–30 karakter';
      }
      if (item.value < 0 || isNaN(item.value)) {
        newErrors[`${index}-value`] = 'Nilai harus ≥ 0';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      await onSave({ items });
      setToast({ message: 'Statistik berhasil disimpan.', type: 'success' });
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : 'Gagal menyimpan data.', type: 'error' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-2">Statistik</h2>
      <p className="text-gray-500 text-sm mb-6">
        Edit 3 metrik statistik yang ditampilkan di landing page.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Metrik {index + 1}</h3>
              <div>
                <label htmlFor={`label-${item.id}`} className="block text-sm font-medium text-gray-600 mb-1">Label</label>
                <input
                  id={`label-${item.id}`}
                  type="text"
                  maxLength={30}
                  value={item.label}
                  onChange={(e) => updateItem(index, 'label', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent ${errors[`${index}-label`] ? 'border-red-400' : 'border-gray-300'}`}
                  placeholder="Contoh: Mitra Driver"
                />
                {errors[`${index}-label`] && <p className="mt-1 text-xs text-red-600">{errors[`${index}-label`]}</p>}
              </div>
              <div>
                <label htmlFor={`value-${item.id}`} className="block text-sm font-medium text-gray-600 mb-1">Nilai</label>
                <input
                  id={`value-${item.id}`}
                  type="number"
                  min={0}
                  step="any"
                  value={item.value}
                  onChange={(e) => updateItem(index, 'value', parseFloat(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent ${errors[`${index}-value`] ? 'border-red-400' : 'border-gray-300'}`}
                  placeholder="0"
                />
                {errors[`${index}-value`] && <p className="mt-1 text-xs text-red-600">{errors[`${index}-value`]}</p>}
              </div>
              <div>
                <label htmlFor={`suffix-${item.id}`} className="block text-sm font-medium text-gray-600 mb-1">Suffix</label>
                <input
                  id={`suffix-${item.id}`}
                  type="text"
                  value={item.suffix}
                  onChange={(e) => updateItem(index, 'suffix', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                  placeholder="Contoh: +, /5"
                />
              </div>
            </div>
          ))}
        </div>

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
