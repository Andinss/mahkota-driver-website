'use client';

import { useState, useEffect, useCallback } from 'react';
import { RegistrationData, RegistrationStep } from '@/types/content';
import Toast, { ToastType } from './Toast';
import ConfirmDialog from './ConfirmDialog';
import IconPicker from './IconPicker';

interface RegistrationTabProps {
  data: RegistrationData;
  onSave: (data: RegistrationData) => Promise<void>;
}

interface StepForm { title: string; description: string; iconUrl: string; }
const emptyStepForm: StepForm = { title: '', description: '', iconUrl: '' };

export default function RegistrationTab({ data, onSave }: RegistrationTabProps) {
  const [steps, setSteps] = useState<RegistrationStep[]>(data.steps);
  const [estimateMinutes, setEstimateMinutes] = useState(data.estimateMinutes);
  const [formUrl, setFormUrl] = useState(data.formUrl);
  const [playStoreUrl, setPlayStoreUrl] = useState(data.playStoreUrl);
  const [saving, setSaving] = useState(false);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [stepForm, setStepForm] = useState<StepForm>(emptyStepForm);
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Confirm
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && showModal) closeModal();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showModal]);

  function closeModal() { setShowModal(false); setEditingStepId(null); setStepForm(emptyStepForm); setFormError(null); }
  const showToast = useCallback((message: string, type: ToastType) => { setToast({ message, type }); }, []);

  async function persistData(updatedSteps: RegistrationStep[], est?: number, fUrl?: string, psUrl?: string) {
    setSaving(true);
    try {
      const payload: RegistrationData = { steps: updatedSteps, estimateMinutes: est ?? estimateMinutes, formUrl: fUrl ?? formUrl, playStoreUrl: psUrl ?? playStoreUrl };
      await onSave(payload);
      setSteps(updatedSteps);
      if (est !== undefined) setEstimateMinutes(est);
      if (fUrl !== undefined) setFormUrl(fUrl);
      if (psUrl !== undefined) setPlayStoreUrl(psUrl);
      return true;
    } catch {
      showToast('Gagal menyimpan data.', 'error');
      return false;
    } finally {
      setSaving(false);
    }
  }

  // --- Step CRUD ---
  function handleAddStep() { if (steps.length >= 6) return; setEditingStepId(null); setStepForm(emptyStepForm); setShowModal(true); setFormError(null); }
  function handleEditStep(item: RegistrationStep) { setEditingStepId(item.id); setStepForm({ title: item.title, description: item.description, iconUrl: item.iconUrl }); setShowModal(true); setFormError(null); }
  function handleDeleteStepClick(item: RegistrationStep) {
    if (steps.length <= 3) { showToast('Minimal 3 langkah diperlukan.', 'error'); return; }
    setConfirmDelete({ id: item.id, name: item.title });
  }

  async function handleConfirmDelete() {
    if (!confirmDelete) return;
    setDeleting(true);
    const filtered = steps.filter((s) => s.id !== confirmDelete.id);
    const reordered = filtered.map((s, i) => ({ ...s, order: i + 1 }));
    const success = await persistData(reordered);
    setDeleting(false);
    setConfirmDelete(null);
    if (success) showToast('Langkah berhasil dihapus.', 'success');
  }

  async function handleSubmitStep(e: React.FormEvent) {
    e.preventDefault();
    if (!stepForm.title.trim()) { setFormError('Judul langkah tidak boleh kosong.'); return; }
    if (!stepForm.description.trim()) { setFormError('Deskripsi langkah tidak boleh kosong.'); return; }

    let updatedSteps: RegistrationStep[];
    if (editingStepId) {
      updatedSteps = steps.map((s) => s.id === editingStepId ? { ...s, title: stepForm.title.trim(), description: stepForm.description.trim(), iconUrl: stepForm.iconUrl.trim() || s.iconUrl } : s);
    } else {
      const maxOrder = steps.length > 0 ? Math.max(...steps.map((s) => s.order)) : 0;
      updatedSteps = [...steps, { id: `step-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, order: maxOrder + 1, title: stepForm.title.trim(), description: stepForm.description.trim(), iconUrl: stepForm.iconUrl.trim() || '/images/services/form.svg' }];
    }
    const success = await persistData(updatedSteps);
    if (success) { showToast(editingStepId ? 'Langkah berhasil diperbarui.' : 'Langkah berhasil ditambahkan.', 'success'); closeModal(); }
  }

  async function handleMoveUp(index: number) {
    if (index === 0) return;
    const newSteps = [...steps];
    [newSteps[index - 1], newSteps[index]] = [newSteps[index], newSteps[index - 1]];
    const reordered = newSteps.map((s, i) => ({ ...s, order: i + 1 }));
    const success = await persistData(reordered);
    if (success) showToast('Urutan berhasil diperbarui.', 'success');
  }

  async function handleMoveDown(index: number) {
    if (index === steps.length - 1) return;
    const newSteps = [...steps];
    [newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]];
    const reordered = newSteps.map((s, i) => ({ ...s, order: i + 1 }));
    const success = await persistData(reordered);
    if (success) showToast('Urutan berhasil diperbarui.', 'success');
  }

  async function handleSaveSettings() {
    if (estimateMinutes < 5 || estimateMinutes > 15) { showToast('Estimasi waktu harus 5–15 menit.', 'error'); return; }
    if (!formUrl.trim()) { showToast('URL formulir tidak boleh kosong.', 'error'); return; }
    if (!playStoreUrl.trim()) { showToast('URL Play Store tidak boleh kosong.', 'error'); return; }
    const success = await persistData(steps, estimateMinutes, formUrl, playStoreUrl);
    if (success) showToast('Pengaturan berhasil disimpan.', 'success');
  }

  return (
    <div className="p-6 space-y-8">
      {/* Steps Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Langkah Pendaftaran <span className="text-sm font-normal text-gray-500">({steps.length} item, 3–6)</span></h2>
          {steps.length < 6 && (
            <button type="button" onClick={handleAddStep} disabled={saving} className="px-4 py-2 text-sm bg-gold text-brand-black rounded-lg font-medium hover:bg-gold-light transition-colors disabled:opacity-50">+ Tambah Langkah</button>
          )}
        </div>
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={step.id} className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gold/10 text-gold text-xs font-bold">{step.order}</span>
                    <span className="font-medium text-sm text-gray-900">{step.title}</span>
                  </div>
                  <p className="text-sm text-gray-600 ml-8 line-clamp-2">{step.description}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button type="button" onClick={() => handleMoveUp(index)} disabled={index === 0 || saving} className="px-2 py-1.5 text-xs text-gray-500 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Pindah ke atas">↑</button>
                  <button type="button" onClick={() => handleMoveDown(index)} disabled={index === steps.length - 1 || saving} className="px-2 py-1.5 text-xs text-gray-500 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Pindah ke bawah">↓</button>
                  <button type="button" onClick={() => handleEditStep(step)} disabled={saving} className="px-3 py-1.5 text-xs text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors disabled:opacity-50">Edit</button>
                  <button type="button" onClick={() => handleDeleteStepClick(step)} disabled={saving || steps.length <= 3} className="px-3 py-1.5 text-xs text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">Hapus</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* Settings */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Pengaturan</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estimasi Waktu (menit)</label>
          <input type="number" min={5} max={15} value={estimateMinutes} onChange={(e) => setEstimateMinutes(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent" />
          <p className="text-xs text-gray-400 mt-1">Rentang: 5–15 menit</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL Formulir Pendaftaran</label>
          <input type="url" value={formUrl} onChange={(e) => setFormUrl(e.target.value)} placeholder="https://forms.mahkotadrive.com/daftar" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL Play Store</label>
          <input type="url" value={playStoreUrl} onChange={(e) => setPlayStoreUrl(e.target.value)} placeholder="https://play.google.com/store/apps/details?id=..." className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent" />
        </div>
        <div className="pt-2">
          <button type="button" onClick={handleSaveSettings} disabled={saving} className="px-6 py-2.5 bg-gold text-brand-black rounded-lg font-medium hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed">{saving ? 'Menyimpan...' : 'Simpan Pengaturan'}</button>
        </div>
      </section>

      {/* Step Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900">{editingStepId ? 'Edit Langkah' : 'Tambah Langkah Baru'}</h3>
            {formError && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{formError}</div>}
            <form onSubmit={handleSubmitStep} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul <span className="text-red-500">*</span></label>
                <input type="text" value={stepForm.title} onChange={(e) => setStepForm({ ...stepForm, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent" placeholder="Contoh: Isi Formulir Online" autoFocus />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi <span className="text-red-500">*</span></label>
                <textarea value={stepForm.description} onChange={(e) => setStepForm({ ...stepForm, description: e.target.value })} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent resize-none" placeholder="Deskripsi singkat langkah ini" />
              </div>
              <div>
                <IconPicker value={stepForm.iconUrl} onChange={(url) => setStepForm({ ...stepForm, iconUrl: url })} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeModal} disabled={saving} className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50">Batal</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-gold text-brand-black text-sm rounded-lg font-medium hover:bg-gold-light transition-colors disabled:opacity-50">{saving ? 'Menyimpan...' : editingStepId ? 'Perbarui' : 'Tambahkan'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {confirmDelete && (
        <ConfirmDialog
          title="Hapus Langkah"
          message={`Apakah Anda yakin ingin menghapus langkah "${confirmDelete.name}"? Tindakan ini tidak dapat dibatalkan.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDelete(null)}
          loading={deleting}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
