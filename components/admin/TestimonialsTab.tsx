"use client";

import { useState, useEffect, useCallback } from "react";
import { TestimonialsData, Testimonial } from "@/types/content";
import Toast, { ToastType } from "./Toast";
import ConfirmDialog from "./ConfirmDialog";
import PhotoUpload from "./PhotoUpload";
import Icon from "@/components/ui/Icon";

interface TestimonialsTabProps {
  data: TestimonialsData;
  onSave: (data: TestimonialsData) => Promise<void>;
}

interface TestimonialForm {
  name: string;
  description: string;
  quote: string;
  rating: number;
  photoUrl: string;
}

const emptyForm: TestimonialForm = {
  name: "",
  description: "",
  quote: "",
  rating: 5,
  photoUrl: "",
};

export default function TestimonialsTab({
  data,
  onSave,
}: TestimonialsTabProps) {
  const [items, setItems] = useState<Testimonial[]>(data.items);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TestimonialForm>(emptyForm);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && showModal) closeModal();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showModal]);

  function closeModal() {
    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
  }
  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type });
  }, []);

  async function persistData(updatedItems: Testimonial[]) {
    setSaving(true);
    try {
      await onSave({ items: updatedItems });
      setItems(updatedItems);
      return true;
    } catch {
      showToast("Gagal menyimpan data.", "error");
      return false;
    } finally {
      setSaving(false);
    }
  }

  function handleAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
    setFormError(null);
  }
  function handleEdit(item: Testimonial) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: item.description || "",
      quote: item.quote,
      rating: item.rating,
      photoUrl: item.photoUrl || "",
    });
    setShowModal(true);
    setFormError(null);
  }
  function handleDeleteClick(item: Testimonial) {
    if (items.length <= 1) {
      showToast("Minimal 1 testimoni diperlukan.", "error");
      return;
    }
    setConfirmDelete({ id: item.id, name: item.name });
  }

  async function handleConfirmDelete() {
    if (!confirmDelete) return;
    setDeleting(true);
    const updatedItems = items.filter((t) => t.id !== confirmDelete.id);
    const success = await persistData(updatedItems);
    setDeleting(false);
    setConfirmDelete(null);
    if (success) showToast("Testimoni berhasil dihapus.", "success");
  }

  async function handleSubmitForm(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      setFormError("Nama tidak boleh kosong.");
      return;
    }
    if (!form.quote.trim()) {
      setFormError("Kutipan tidak boleh kosong.");
      return;
    }

    const testimonial: Testimonial = {
      id:
        editingId ||
        `testi-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      quote: form.quote.trim(),
      rating: form.rating,
      photoUrl: form.photoUrl.trim() || null,
    };
    const updatedItems = editingId
      ? items.map((item) => (item.id === editingId ? testimonial : item))
      : [...items, testimonial];
    const success = await persistData(updatedItems);
    if (success) {
      showToast(
        editingId ? "Testimoni diperbarui." : "Testimoni ditambahkan.",
        "success",
      );
      closeModal();
    }
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-ink">
          Testimoni{" "}
          <span className="text-sm font-normal text-mu">
            ({items.length} item)
          </span>
        </h2>
        <button
          type="button"
          onClick={handleAdd}
          disabled={saving}
          className="btn bd sm"
        >
          <Icon name="add" /> Tambah
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="border border-ln rounded-xl p-4 bg-bg flex items-center gap-4"
          >
            <div className="h-12 w-12 rounded-full overflow-hidden bg-surf shrink-0 border border-ln flex items-center justify-center">
              {item.photoUrl ? (
                <img
                  src={item.photoUrl}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Icon name="person" className="text-mu text-2xl" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm text-ink">
                  {item.name}
                </span>
                <span className="text-xs text-yt">
                  {"★".repeat(item.rating)}
                </span>
              </div>
              <p className="text-sm text-mu line-clamp-1">{item.quote}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleEdit(item)}
                disabled={saving}
                className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors disabled:opacity-50"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDeleteClick(item)}
                disabled={saving}
                className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-8 text-mu text-sm">
            Belum ada testimoni.
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative w-full max-w-lg bg-surf rounded-2xl shadow-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-ink">
              {editingId ? "Edit Testimoni" : "Tambah Testimoni"}
            </h3>
            {formError && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {formError}
              </div>
            )}
            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">
                  Nama <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-ln rounded-lg text-sm focus:ring-2 focus:ring-y outline-none"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">
                  Keterangan{" "}
                  <span className="text-mu font-normal">(opsional)</span>
                </label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-ln rounded-lg text-sm focus:ring-2 focus:ring-y outline-none"
                  placeholder="Contoh: Driver Gojek Jakarta"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">
                  Kutipan <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.quote}
                  onChange={(e) => setForm({ ...form, quote: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-ln rounded-lg text-sm focus:ring-2 focus:ring-y outline-none resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">
                    Rating
                  </label>
                  <select
                    value={form.rating}
                    onChange={(e) =>
                      setForm({ ...form, rating: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-ln rounded-lg text-sm focus:ring-2 focus:ring-y outline-none bg-surf"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>
                        {"★".repeat(r)}
                        {"☆".repeat(5 - r)} ({r})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <PhotoUpload
                value={form.photoUrl}
                onChange={(url) => setForm({ ...form, photoUrl: url })}
                category="testimonials"
              />
              <div className="flex justify-end gap-3 pt-4 border-t border-ln">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn bo sm"
                >
                  Batal
                </button>
                <button type="submit" disabled={saving} className="btn bd sm">
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {confirmDelete && (
        <ConfirmDialog
          title="Hapus Testimoni"
          message={`Hapus testimoni dari "${confirmDelete.name}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDelete(null)}
          loading={deleting}
        />
      )}
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
