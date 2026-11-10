"use client";

import { useState, useEffect, useCallback } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { ServicesData, Service, Advantage } from "@/types/content";
import Toast, { ToastType } from "./Toast";
import ConfirmDialog from "./ConfirmDialog";
import HugeiconPicker from "./HugeiconPicker";
import Icon from "@/components/ui/Icon";

interface ServicesTabProps {
  data: ServicesData;
  onSave: (data: ServicesData) => Promise<void>;
}

interface ServiceForm {
  name: string;
  description: string;
  iconAlt: string;
  icon: string;
}

interface AdvantageForm {
  title: string;
  description: string;
  iconAlt: string;
  icon: string;
}

type SubTab = "layanan" | "keunggulan";
type ModalType = "service" | "advantage" | null;

const emptyServiceForm: ServiceForm = {
  name: "",
  description: "",
  iconAlt: "",
  icon: "",
};

const emptyAdvantageForm: AdvantageForm = {
  title: "",
  description: "",
  iconAlt: "",
  icon: "",
};

export default function ServicesTab({ data, onSave }: ServicesTabProps) {
  const [services, setServices] = useState<Service[]>(data.services);
  const [advantages, setAdvantages] = useState<Advantage[]>(data.advantages);
  const [saving, setSaving] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("layanan");
  const [modalType, setModalType] = useState<ModalType>(null);
  const [serviceForm, setServiceForm] = useState<ServiceForm>(emptyServiceForm);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [advantageForm, setAdvantageForm] =
    useState<AdvantageForm>(emptyAdvantageForm);
  const [editingAdvantageId, setEditingAdvantageId] = useState<string | null>(
    null,
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    type: "service" | "advantage";
    id: string;
    name: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && modalType) closeModal();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [modalType]);

  function closeModal() {
    setModalType(null);
    setEditingServiceId(null);
    setEditingAdvantageId(null);
    setServiceForm(emptyServiceForm);
    setAdvantageForm(emptyAdvantageForm);
    setFormError(null);
  }

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type });
  }, []);

  async function persistData(
    updatedServices: Service[],
    updatedAdvantages: Advantage[],
  ) {
    setSaving(true);
    try {
      await onSave({
        services: updatedServices,
        advantages: updatedAdvantages,
      });
      setServices(updatedServices);
      setAdvantages(updatedAdvantages);
      return true;
    } catch {
      showToast("Gagal menyimpan data.", "error");
      return false;
    } finally {
      setSaving(false);
    }
  }

  function handleAddService() {
    setEditingServiceId(null);
    setServiceForm(emptyServiceForm);
    setModalType("service");
    setFormError(null);
  }

  function handleEditService(item: Service) {
    setEditingServiceId(item.id);
    setServiceForm({
      name: item.name,
      description: item.description,
      iconAlt: item.iconAlt,
      icon: item.icon ?? "",
    });
    setModalType("service");
    setFormError(null);
  }

  function handleDeleteServiceClick(item: Service) {
    if (services.length <= 3) {
      showToast("Minimal 3 layanan diperlukan.", "error");
      return;
    }
    setConfirmDelete({ type: "service", id: item.id, name: item.name });
  }

  async function handleSubmitService(e: React.FormEvent) {
    e.preventDefault();
    if (!serviceForm.name.trim()) {
      setFormError("Nama layanan tidak boleh kosong.");
      return;
    }
    const service: Service = {
      id:
        editingServiceId ||
        `svc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: serviceForm.name.trim(),
      description: serviceForm.description.trim(),
      iconAlt: serviceForm.iconAlt.trim() || serviceForm.name.trim(),
      icon: serviceForm.icon.trim() || undefined,
    };
    const updated = editingServiceId
      ? services.map((s) => (s.id === editingServiceId ? service : s))
      : [...services, service];
    const success = await persistData(updated, advantages);
    if (success) {
      showToast(
        editingServiceId ? "Layanan diperbarui." : "Layanan ditambahkan.",
        "success",
      );
      closeModal();
    }
  }

  function handleAddAdvantage() {
    setEditingAdvantageId(null);
    setAdvantageForm(emptyAdvantageForm);
    setModalType("advantage");
    setFormError(null);
  }

  function handleEditAdvantage(item: Advantage) {
    setEditingAdvantageId(item.id);
    setAdvantageForm({
      title: item.title,
      description: item.description,
      iconAlt: item.iconAlt ?? "",
      icon: item.icon ?? "",
    });
    setModalType("advantage");
    setFormError(null);
  }

  function handleDeleteAdvantageClick(item: Advantage) {
    if (advantages.length <= 3) {
      showToast("Minimal 3 keunggulan diperlukan.", "error");
      return;
    }
    setConfirmDelete({ type: "advantage", id: item.id, name: item.title });
  }

  async function handleSubmitAdvantage(e: React.FormEvent) {
    e.preventDefault();
    if (!advantageForm.title.trim()) {
      setFormError("Judul keunggulan tidak boleh kosong.");
      return;
    }
    const advantage: Advantage = {
      id:
        editingAdvantageId ||
        `adv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: advantageForm.title.trim(),
      description: advantageForm.description.trim(),
      iconAlt: advantageForm.iconAlt.trim() || advantageForm.title.trim(),
      icon: advantageForm.icon.trim() || undefined,
    };
    const updated = editingAdvantageId
      ? advantages.map((a) => (a.id === editingAdvantageId ? advantage : a))
      : [...advantages, advantage];
    const success = await persistData(services, updated);
    if (success) {
      showToast(
        editingAdvantageId
          ? "Keunggulan diperbarui."
          : "Keunggulan ditambahkan.",
        "success",
      );
      closeModal();
    }
  }

  async function handleConfirmDelete() {
    if (!confirmDelete) return;
    setDeleting(true);
    let success = false;
    if (confirmDelete.type === "service") {
      success = await persistData(
        services.filter((s) => s.id !== confirmDelete.id),
        advantages,
      );
    } else {
      success = await persistData(
        services,
        advantages.filter((a) => a.id !== confirmDelete.id),
      );
    }
    setDeleting(false);
    setConfirmDelete(null);
    if (success)
      showToast(
        `${confirmDelete.type === "service" ? "Layanan" : "Keunggulan"} dihapus.`,
        "success",
      );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="border-b border-ln">
        <div className="flex -mb-px">
          <button
            type="button"
            onClick={() => setActiveSubTab("layanan")}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
              activeSubTab === "layanan"
                ? "border-y text-ink"
                : "border-transparent text-mu hover:text-ink"
            }`}
          >
            Layanan ({services.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("keunggulan")}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
              activeSubTab === "keunggulan"
                ? "border-y text-ink"
                : "border-transparent text-mu hover:text-ink"
            }`}
          >
            Keunggulan ({advantages.length})
          </button>
        </div>
      </div>

      {activeSubTab === "layanan" && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink">
              Layanan{" "}
              <span className="text-sm font-normal text-mu">
                ({services.length} item)
              </span>
            </h2>
            <button
              type="button"
              onClick={handleAddService}
              disabled={saving}
              className="btn bd sm"
            >
              <span className="ms">
                <HugeiconsIcon icon={Add01Icon} size="1em" />
              </span>{" "}
              Tambah Layanan
            </button>
          </div>
          <div className="space-y-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="border border-ln rounded-xl p-4 bg-bg flex items-start justify-between gap-4"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="h-10 w-10 rounded-lg border border-ln bg-surf flex items-center justify-center shrink-0">
                    {service.icon ? (
                      <Icon name={service.icon} className="text-[20px]" />
                    ) : (
                      <span className="text-xs text-mu">—</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="font-semibold text-sm text-ink">
                      {service.name}
                    </span>
                    {service.description && (
                      <p className="text-sm text-mu mt-1 line-clamp-2">
                        {service.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleEditService(service)}
                    disabled={saving}
                    className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors disabled:opacity-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteServiceClick(service)}
                    disabled={saving || services.length <= 3}
                    className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors disabled:opacity-30"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeSubTab === "keunggulan" && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink">
              Keunggulan{" "}
              <span className="text-sm font-normal text-mu">
                ({advantages.length} item)
              </span>
            </h2>
            <button
              type="button"
              onClick={handleAddAdvantage}
              disabled={saving}
              className="btn bd sm"
            >
              <span className="ms">
                <HugeiconsIcon icon={Add01Icon} size="1em" />
              </span>{" "}
              Tambah Keunggulan
            </button>
          </div>
          <div className="space-y-3">
            {advantages.map((advantage) => (
              <div
                key={advantage.id}
                className="border border-ln rounded-xl p-4 bg-bg flex items-start justify-between gap-4"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="h-10 w-10 rounded-lg border border-ln bg-surf flex items-center justify-center shrink-0">
                    {advantage.icon ? (
                      <Icon name={advantage.icon} className="text-[20px]" />
                    ) : (
                      <span className="text-xs text-mu">—</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="font-semibold text-sm text-ink">
                      {advantage.title}
                    </span>
                    {advantage.description && (
                      <p className="text-sm text-mu mt-1">
                        {advantage.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleEditAdvantage(advantage)}
                    disabled={saving}
                    className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors disabled:opacity-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteAdvantageClick(advantage)}
                    disabled={saving || advantages.length <= 3}
                    className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors disabled:opacity-30"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {modalType === "service" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative w-full max-w-lg bg-surf rounded-2xl shadow-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-ink">
              {editingServiceId ? "Edit Layanan" : "Tambah Layanan"}
            </h3>
            {formError && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {formError}
              </div>
            )}
            <form onSubmit={handleSubmitService} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">
                  Nama Layanan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={serviceForm.name}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-ln rounded-lg text-sm focus:ring-2 focus:ring-y outline-none"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">
                  Deskripsi
                </label>
                <textarea
                  value={serviceForm.description}
                  onChange={(e) =>
                    setServiceForm({
                      ...serviceForm,
                      description: e.target.value.slice(0, 150),
                    })
                  }
                  maxLength={150}
                  rows={2}
                  className="w-full px-3 py-2 border border-ln rounded-lg text-sm focus:ring-2 focus:ring-y outline-none resize-none"
                />
              </div>

              <HugeiconPicker
                value={serviceForm.icon}
                onChange={(key) =>
                  setServiceForm({ ...serviceForm, icon: key })
                }
                label="Icon Layanan"
                helperText="Pilih ikon bawaan Hugeicons."
              />

              <div>
                <label className="block text-sm font-medium text-ink mb-1">
                  Icon Alt Text
                </label>
                <input
                  type="text"
                  value={serviceForm.iconAlt}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, iconAlt: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-ln rounded-lg text-sm focus:ring-2 focus:ring-y outline-none"
                />
              </div>
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

      {modalType === "advantage" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative w-full max-w-lg bg-surf rounded-2xl shadow-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-ink">
              {editingAdvantageId ? "Edit Keunggulan" : "Tambah Keunggulan"}
            </h3>
            {formError && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {formError}
              </div>
            )}
            <form onSubmit={handleSubmitAdvantage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">
                  Judul <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={advantageForm.title}
                  onChange={(e) =>
                    setAdvantageForm({
                      ...advantageForm,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-ln rounded-lg text-sm focus:ring-2 focus:ring-y outline-none"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">
                  Deskripsi
                </label>
                <textarea
                  value={advantageForm.description}
                  onChange={(e) =>
                    setAdvantageForm({
                      ...advantageForm,
                      description: e.target.value.slice(0, 100),
                    })
                  }
                  maxLength={100}
                  rows={2}
                  className="w-full px-3 py-2 border border-ln rounded-lg text-sm focus:ring-2 focus:ring-y outline-none resize-none"
                />
              </div>

              <HugeiconPicker
                value={advantageForm.icon}
                onChange={(key) =>
                  setAdvantageForm({ ...advantageForm, icon: key })
                }
                label="Icon Keunggulan"
                helperText="Pilih ikon bawaan Hugeicons."
              />

              <div>
                <label className="block text-sm font-medium text-ink mb-1">
                  Icon Alt Text
                </label>
                <input
                  type="text"
                  value={advantageForm.iconAlt}
                  onChange={(e) =>
                    setAdvantageForm({
                      ...advantageForm,
                      iconAlt: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-ln rounded-lg text-sm focus:ring-2 focus:ring-y outline-none"
                />
              </div>
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
          title={`Hapus ${
            confirmDelete.type === "service" ? "Layanan" : "Keunggulan"
          }`}
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
