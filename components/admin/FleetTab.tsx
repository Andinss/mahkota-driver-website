"use client";

import { useState, useCallback, type FormEvent } from "react";
import {
  Add01Icon,
  Calendar01Icon,
  Car01Icon,
  Delete02Icon,
  Edit02Icon,
  Settings02Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { FleetData, FleetVehicle } from "@/types/content";
import Toast, { ToastType } from "./Toast";
import ConfirmDialog from "./ConfirmDialog";
import PhotoUpload from "./PhotoUpload";
import PageHeader from "./PageHeader";
import Modal from "./Modal";
import Ico from "./Ico";

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
  isBestSeller: boolean;
}

const emptyForm: VehicleForm = {
  name: "",
  year: new Date().getFullYear(),
  capacity: 7,
  transmission: "matic",
  imageUrl: "",
  isBestSeller: false,
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

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type });
  }, []);

  function closeModal() {
    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
  }

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
    setFormError(null);
    setShowModal(true);
  }

  function handleEdit(item: FleetVehicle) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      year: item.year,
      capacity: item.capacity,
      transmission: item.transmission,
      imageUrl: item.imageUrl || "",
      isBestSeller: item.isBestSeller === true,
    });
    setFormError(null);
    setShowModal(true);
  }

  async function handleConfirmDelete() {
    if (!confirmDelete) return;
    setDeleting(true);
    const success = await persistData(
      vehicles.filter((v) => v.id !== confirmDelete.id),
    );
    setDeleting(false);
    setConfirmDelete(null);
    if (success) showToast("Armada dihapus.", "success");
  }

  async function handleSubmitForm(e: FormEvent) {
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

    const existing = editingId
      ? vehicles.find((v) => v.id === editingId)
      : undefined;

    // Sebarkan data lama agar field lain (mis. isBestSeller, harga) tidak hilang saat edit.
    const vehicle: FleetVehicle = {
      ...existing,
      id:
        editingId ||
        `fleet-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: form.name.trim(),
      year: form.year,
      capacity: form.capacity,
      transmission: form.transmission,
      imageUrl: form.imageUrl.trim() || undefined,
      isBestSeller: form.isBestSeller,
    };
    const updated = editingId
      ? vehicles.map((v) => (v.id === editingId ? vehicle : v))
      : [...vehicles, vehicle];
    const success = await persistData(updated);
    if (success) {
      showToast("Armada disimpan.", "success");
      closeModal();
    }
  }

  return (
    <div>
      <PageHeader
        title="Katalog armada"
        description="Tambah, ubah, atau hapus mobil yang tampil di halaman armada."
      >
        <span className="a-tag">
          <b>{vehicles.length}</b> kendaraan
        </span>
        <button
          type="button"
          className="a-btn a-bd"
          onClick={handleAdd}
          disabled={saving}
        >
          <Ico icon={Add01Icon} />
          Tambah armada
        </button>
      </PageHeader>

      {vehicles.length > 0 ? (
        <div className="a-grid a-g3">
          {vehicles.map((v) => (
            <article key={v.id} className="a-card a-item a-veh">
              <div className="a-veh-img">
                {v.isBestSeller && <span className="a-ey">Terlaris</span>}
                {v.imageUrl ? (
                  <img src={v.imageUrl} alt={v.name} />
                ) : (
                  <Ico icon={Car01Icon} />
                )}
              </div>
              <div className="a-veh-body">
                <h3>{v.name}</h3>
                <div className="a-specs">
                  <span className="a-tag">
                    <Ico icon={Calendar01Icon} />
                    {v.year}
                  </span>
                  <span className="a-tag">
                    <Ico icon={UserGroupIcon} />
                    {v.capacity} kursi
                  </span>
                  <span className="a-tag">
                    <Ico icon={Settings02Icon} />
                    {v.transmission === "matic" ? "Matic" : "Manual"}
                  </span>
                </div>
                <div className="a-card-foot">
                  <button
                    type="button"
                    className="a-btn a-bo a-sm"
                    onClick={() => handleEdit(v)}
                    disabled={saving}
                  >
                    <Ico icon={Edit02Icon} />
                    Edit
                  </button>
                  <span className="a-sp" />
                  <button
                    type="button"
                    className="a-icon-btn a-del"
                    onClick={() => setConfirmDelete({ id: v.id, name: v.name })}
                    disabled={saving}
                    title="Hapus armada"
                    aria-label={`Hapus ${v.name}`}
                  >
                    <Ico icon={Delete02Icon} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="a-empty a-on">
          <div className="a-ib">
            <Ico icon={Car01Icon} />
          </div>
          <h3>Belum ada armada</h3>
          <p>Tambahkan unit pertama agar muncul di katalog website.</p>
          <button type="button" className="a-btn a-bd" onClick={handleAdd}>
            <Ico icon={Add01Icon} />
            Tambah armada
          </button>
        </div>
      )}

      {showModal && (
        <Modal
          title={editingId ? "Edit armada" : "Tambah armada"}
          onClose={closeModal}
          onSubmit={handleSubmitForm}
          error={formError}
          saving={saving}
        >
          <div className="a-field">
            <label htmlFor="f-name">
              Nama kendaraan <span className="a-req">*</span>
            </label>
            <input
              id="f-name"
              className="a-input"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Contoh: Toyota Avanza"
              autoFocus
            />
          </div>
          <div className="a-row2">
            <div className="a-field">
              <label htmlFor="f-year">Tahun</label>
              <input
                id="f-year"
                className="a-input"
                type="number"
                min={2000}
                max={2030}
                value={form.year}
                onChange={(e) =>
                  setForm({ ...form, year: Number(e.target.value) })
                }
              />
            </div>
            <div className="a-field">
              <label htmlFor="f-cap">
                Kapasitas <span className="a-opt">Kursi</span>
              </label>
              <input
                id="f-cap"
                className="a-input"
                type="number"
                min={1}
                max={20}
                value={form.capacity}
                onChange={(e) =>
                  setForm({ ...form, capacity: Number(e.target.value) })
                }
              />
            </div>
          </div>
          <div className="a-field">
            <span className="a-lbl">Transmisi</span>
            <div className="a-seg a-full">
              {(["matic", "manual"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  className={form.transmission === t ? "a-on" : ""}
                  aria-pressed={form.transmission === t}
                  onClick={() => setForm({ ...form, transmission: t })}
                >
                  {t === "matic" ? "Matic" : "Manual"}
                </button>
              ))}
            </div>
          </div>
          <div className="a-field">
            <span className="a-lbl">
              Label di katalog
              <span className="a-opt">Tampil sebagai &quot;Terlaris&quot;</span>
            </span>
            <div className="a-seg a-full">
              {[
                { v: false, label: "Biasa" },
                { v: true, label: "Terlaris" },
              ].map((o) => (
                <button
                  key={o.label}
                  type="button"
                  className={form.isBestSeller === o.v ? "a-on" : ""}
                  aria-pressed={form.isBestSeller === o.v}
                  onClick={() => setForm({ ...form, isBestSeller: o.v })}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
          <PhotoUpload
            value={form.imageUrl}
            onChange={(url) => setForm({ ...form, imageUrl: url })}
            category="services"
            hint="Maksimal 5 MB"
            contain
          />
        </Modal>
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Hapus armada?"
          message={`"${confirmDelete.name}" akan dihapus dari website. Tindakan ini tidak bisa dibatalkan.`}
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
