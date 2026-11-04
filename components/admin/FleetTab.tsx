"use client";

import { useState, useEffect, useCallback } from "react";
import { FleetData, FleetVehicle } from "@/types/content";
import Toast, { ToastType } from "./Toast";
import ConfirmDialog from "./ConfirmDialog";
import PhotoUpload from "./PhotoUpload";
import Icon from "@/components/ui/Icon";

interface FleetTabProps {
  data: FleetData;
  onSave: (data: FleetData) => Promise<void>;
}

interface VehicleForm {
  name: string;
  year: number;
  capacity: number;
  transmission: "manual" | "matic";
  imageUrl: string;
}

const currentYear = new Date().getFullYear();
const emptyForm: VehicleForm = {
  name: "",
  year: currentYear,
  capacity: 7,
  transmission: "matic",
  imageUrl: "",
};

export default function FleetTab({ data, onSave }: FleetTabProps) {
  const [vehicles, setVehicles] = useState<FleetVehicle[]>(data.vehicles);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<VehicleForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
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

  async function persistData(updatedVehicles: FleetVehicle[]) {
    setSaving(true);
    try {
      await onSave({ vehicles: updatedVehicles });
      setVehicles(updatedVehicles);
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
  function handleEdit(item: FleetVehicle) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      year: item.year,
      capacity: item.capacity,
      transmission: item.transmission,
      imageUrl: item.imageUrl || "",
    });
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
    if (success) showToast("Kendaraan berhasil dihapus.", "success");
  }

  async function handleSubmitForm(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      setFormError("Nama kendaraan tidak boleh kosong.");
      return;
    }
    if (form.year < 2000 || form.year > 2030) {
      setFormError("Tahun harus antara 2000–2030.");
      return;
    }
    if (form.capacity < 1 || form.capacity > 20) {
      setFormError("Kapasitas harus 1–20.");
      return;
    }

    const vehicle: FleetVehicle = {
      id:
        editingId ||
        `fleet-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
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
      showToast(
        editingId
          ? "Kendaraan berhasil diperbarui."
          : "Kendaraan berhasil ditambahkan.",
        "success",
      );
      closeModal();
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-ink">
          Katalog Armada{" "}
          <span className="text-sm font-normal text-mu">
            ({vehicles.length} kendaraan)
          </span>
        </h2>
        <button
          type="button"
          onClick={handleAdd}
          disabled={saving}
          className="btn bd sm"
        >
          <Icon name="add" /> Tambah Armada
        </button>
      </div>

      <div className="space-y-3">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="border border-ln rounded-xl p-4 bg-bg flex items-center gap-4"
          >
            <div className="h-14 w-20 rounded-lg overflow-hidden bg-surf shrink-0 flex items-center justify-center border border-ln">
              {vehicle.imageUrl ? (
                <img
                  src={vehicle.imageUrl}
                  alt={vehicle.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Icon name="directions_car" className="text-3xl text-mu" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-sm text-ink">
                {vehicle.name}
              </span>
              <div className="flex items-center gap-3 mt-1 text-xs text-mu">
                <span>Tahun {vehicle.year}</span>
                <span>•</span>
                <span>{vehicle.capacity} Kursi</span>
                <span>•</span>
                <span className="capitalize">{vehicle.transmission}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleEdit(vehicle)}
                disabled={saving}
                className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors disabled:opacity-50"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDeleteClick(vehicle)}
                disabled={saving}
                className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
        {vehicles.length === 0 && (
          <div className="text-center py-8 text-mu text-sm">
            Belum ada armada.
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
              {editingId ? "Edit Kendaraan" : "Tambah Kendaraan"}
            </h3>
            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {formError}
              </div>
            )}
            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">
                  Nama Kendaraan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-ln rounded-lg text-sm focus:ring-2 focus:ring-y focus:border-y outline-none"
                  placeholder="Contoh: Toyota Avanza"
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">
                    Tahun
                  </label>
                  <input
                    type="number"
                    min={2000}
                    max={2030}
                    value={form.year}
                    onChange={(e) =>
                      setForm({ ...form, year: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-ln rounded-lg text-sm focus:ring-2 focus:ring-y outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">
                    Kapasitas
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={form.capacity}
                    onChange={(e) =>
                      setForm({ ...form, capacity: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-ln rounded-lg text-sm focus:ring-2 focus:ring-y outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">
                    Transmisi
                  </label>
                  <select
                    value={form.transmission}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        transmission: e.target.value as "manual" | "matic",
                      })
                    }
                    className="w-full px-3 py-2 border border-ln rounded-lg text-sm focus:ring-2 focus:ring-y outline-none bg-surf"
                  >
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
              <div className="flex justify-end gap-3 pt-4">
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
          title="Hapus Kendaraan"
          message={`Hapus "${confirmDelete.name}"?`}
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
