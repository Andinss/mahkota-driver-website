'use client';

import { useState, useEffect, useCallback } from 'react';
import { TestimonialsData, Testimonial } from '@/types/content';
import Toast, { ToastType } from './Toast';
import ConfirmDialog from './ConfirmDialog';
import PhotoUpload from './PhotoUpload';

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

const emptyForm: TestimonialForm = { name: '', description: '', quote: '', rating: 5, photoUrl: '' };

export default function TestimonialsTab({ data, onSave }: TestimonialsTabProps) {
  const [items, setItems] = useState<Testimonial[]>(data.items);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TestimonialForm>(emptyForm);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Confirm dialog state
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Close modal on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && showModal) closeModal();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
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
      showToast('Gagal menyimpan data.', 'error');
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
    setForm({ name: item.name, description: item.description || '', quote: item.quote, rating: item.rating, photoUrl: item.photoUrl || '' });
    setShowModal(true);
    setFormError(null);
  }

  function handleDeleteClick(item: Testimonial) {
    if (items.length <= 3) {
      showToast('Minimal 3 testimoni diperlukan.', 'error');
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
    if (success) showToast('Testimoni berhasil dihapus.', 'success');
  }

  async function handleSubmitForm(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setFormError('Nama tidak boleh kosong.'); return; }
    if (!form.quote.trim()) { setFormError('Kutipan tidak boleh kosong.'); return; }

    const testimonial: Testimonial = {
      id: editingId || `testi-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
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
      showToast(editingId ? 'Testimoni berhasil diperbarui.' : 'Testimoni berhasil ditambahkan.', 'success');
      closeModal();
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Testimoni <span className="text-sm font-normal text-gray-500">({items.length} item, minimal 3)</span>
        </h2>
        <button type="button" onClick={handleAdd} disabled={saving} className="px-4 py-2 text-sm bg-gold text-brand-black rounded-lg font-medium hover:bg-gold-light transition-colors disabled:opacity-50">
          + Tambah Testimoni
        </button>
      </div>

      {/* Items List */}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="flex items-center gap-4">
              {/* Thumbnail */}
              <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
                {item.photoUrl ? (
                  <img src={item.photoUrl} alt={item.name} className="h-10 w-10 object-cover" />
                ) : (
                  <span className="text-xs font-bold text-gray-500">
                    {item.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm text-gray-900">{item.name}</span>
                  <span className="text-xs text-gold">{'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}</span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-1">{item.quote}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button type="button" onClick={() => handleEdit(item)} disabled={saving} className="px-3 py-1.5 text-xs text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors disabled:opacity-50">Edit</button>
                <button type="button" onClick={() => handleDeleteClick(item)} disabled={saving || items.length <= 3} className="px-3 py-1.5 text-xs text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">Hapus</button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">Belum ada testimoni.</div>
        )}
      </div>

      {/* Form Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900">{editingId ? 'Edit Testimoni' : 'Tambah Testimoni Baru'}</h3>
            {formError && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{formError}</div>}
            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama <span className="text-red-500">*</span></label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent" placeholder="Nama driver" autoFocus />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi <span className="text-gray-400 font-normal">(opsional)</span></label>
                <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent" placeholder="Contoh: Driver Gojek Jakarta" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kutipan <span className="text-red-500">*</span></label>
                <textarea value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent resize-none" placeholder="Kutipan testimoni dari mitra driver" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent">
                    {[5, 4, 3, 2, 1].map((r) => (<option key={r} value={r}>{'★'.repeat(r)}{'☆'.repeat(5 - r)} ({r})</option>))}
                  </select>
                </div>
              </div>
              <div>
                <PhotoUpload
                  value={form.photoUrl}
                  onChange={(url) => setForm({ ...form, photoUrl: url })}
                  category="testimonials"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeModal} disabled={saving} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50">Batal</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-gold text-brand-black text-sm rounded-lg font-medium hover:bg-gold-light transition-colors disabled:opacity-50">
                  {saving ? 'Menyimpan...' : editingId ? 'Perbarui' : 'Tambahkan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      {confirmDelete && (
        <ConfirmDialog
          title="Hapus Testimoni"
          message={`Apakah Anda yakin ingin menghapus testimoni dari "${confirmDelete.name}"? Tindakan ini tidak dapat dibatalkan.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDelete(null)}
          loading={deleting}
        />
      )}

      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
