'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { FleetData, FleetVehicle } from '@/types/content';
import Toast, { ToastType } from './Toast';
import ConfirmDialog from './ConfirmDialog';
import PhotoUpload from './PhotoUpload';

interface FleetTabProps {
  data: FleetData;
  onSave: (data: FleetData) => Promise<void>;
}

interface VehicleForm {
  name: string;
  year: number;
  capacity: number;
  transmission: 'manual' | 'matic';
  imageUrl: string;
}

const currentYear = new Date().getFullYear();
const emptyForm: VehicleForm = { name: '', year: currentYear, capacity: 7, transmission: 'matic', imageUrl: '' };

export default function FleetTab({ data, onSave }: FleetTabProps) {
  const [vehicles, setVehicles] = useState<FleetVehicle[]>(data.vehicles);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<VehicleForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

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

  function closeModal() { setShowModal(false); setEditingId(null); setForm(emptyForm); setFormError(null); }
  const showToast = useCallback((message: string, type: ToastType) => { setToast({ message, type }); }, []);

  async function persistData(updatedVehicles: FleetVehicle[]) {
    setSaving(true);
    try {
      await onSave({ vehicles: updatedVehicles });
      setVehicles(updatedVehicles);
      return true;
    } catch {
      showToast('Gagal menyimpan data.', 'error');
      return false;
    } finally {
      setSaving(false);
    }
  }

  function handleAdd() { setEditingId(null); setForm(emptyForm); setShowModal(true); setFormError(null); }

  function handleEdit(item: FleetVehicle) {
    setEditingId(item.id);
    setForm({ name: item.name, year: item.year, capacity: item.capacity, transmission: item.transmission, imageUrl: item.imageUrl || '' });
    setShowModal(true);
    setFormError(null);
  }

  function handleDeleteClick(item: FleetVehicle) {
    setConfirmDelete({ id: item.id, name: item.name });
  }

  async function handleConfirmDelete() {
    if (!confirmDelete) return;
    setDeleting(true);
    const updated = vehicles.filter((v) => v.id !== confirmDelete.id);
    const success = await persistData(updated);
    setDeleting(false);
    setConfirmDelete(null);
    if (success) showToast('Kendaraan berhasil dihapus.', 'success');
  }

  async function handleSubmitForm(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setFormError('Nama kendaraan tidak boleh kosong.'); return; }
    if (form.year < 2000 || form.year > 2030) { setFormError('Tahun harus antara 2000–2030.'); return; }
    if (form.capacity < 1 || form.capacity > 20) { setFormError('Kapasitas harus 1–20.'); return; }

    const vehicle: FleetVehicle = {
      id: editingId || `fleet-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: form.name.trim(),
      year: form.year,
      capacity: form.capacity,
      transmission: form.transmission,
      imageUrl: form.imageUrl.trim() || undefined,
    };

    const updated = editingId
      ? vehicles.map((v) => (v.id === editingId ? vehicle : v))
      : [...vehicles, vehicle];

    const success = await persistData(updated);
    if (success) {
      showToast(editingId ? 'Kendaraan berhasil diperbarui.' : 'Kendaraan berhasil ditambahkan.', 'success');
      closeModal();
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Katalog Armada <span className="text-sm font-normal text-gray-500">({vehicles.length} kendaraan)</span>
        </h2>
        <button type="button" onClick={handleAdd} disabled={saving} className="px-4 py-2 text-sm bg-gold text-brand-black rounded-lg font-medium hover:bg-gold-light transition-colors disabled:opacity-50">
          + Tambah Kendaraan
        </button>
      </div>

      {/* Vehicle List */}
      <div className="space-y-3">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="flex items-center gap-4">
              {/* Thumbnail */}
              <div className="h-12 w-16 rounded-md overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
                {vehicle.imageUrl ? (
                  <Image src={vehicle.imageUrl} alt={vehicle.name} width={64} height={48} className="h-12 w-16 object-cover" />
                ) : (
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-medium text-sm text-gray-900">{vehicle.name}</span>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <span>Tahun {vehicle.year}</span>
                  <span>•</span>
                  <span>{vehicle.capacity} penumpang</span>
                  <span>•</span>
                  <span className="capitalize">{vehicle.transmission}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button type="button" onClick={() => handleEdit(vehicle)} disabled={saving} className="px-3 py-1.5 text-xs text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors disabled:opacity-50">Edit</button>
                <button type="button" onClick={() => handleDeleteClick(vehicle)} disabled={saving} className="px-3 py-1.5 text-xs text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">Hapus</button>
              </div>
            </div>
          </div>
        ))}
        {vehicles.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">Belum ada kendaraan.</div>
        )}
      </div>

      {/* Form Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900">{editingId ? 'Edit Kendaraan' : 'Tambah Kendaraan Baru'}</h3>
            {formError && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{formError}</div>}
            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama/Tipe Kendaraan <span className="text-red-500">*</span></label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent" placeholder="Contoh: Toyota Avanza" autoFocus />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
                  <input type="number" min={2000} max={2030} value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kapasitas</label>
                  <input type="number" min={1} max={20} value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transmisi</label>
                  <select value={form.transmission} onChange={(e) => setForm({ ...form, transmission: e.target.value as 'manual' | 'matic' })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent">
                    <option value="matic">Matic</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>
              </div>
              <div>
                <PhotoUpload
                  value={form.imageUrl}
                  onChange={(url) => setForm({ ...form, imageUrl: url })}
                  category="services"
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

      {/* Confirm Delete */}
      {confirmDelete && (
        <ConfirmDialog
          title="Hapus Kendaraan"
          message={`Apakah Anda yakin ingin menghapus "${confirmDelete.name}"? Tindakan ini tidak dapat dibatalkan.`}
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
