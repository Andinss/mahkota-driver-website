"use client";

import { useState, useEffect, useCallback } from "react";
import { RegistrationData, RegistrationStep } from "@/types/content";
import Toast, { ToastType } from "./Toast";
import ConfirmDialog from "./ConfirmDialog";
import IconPicker from "./IconPicker";
import Icon from "@/components/ui/Icon";

interface RegistrationTabProps {
  data: RegistrationData;
  onSave: (data: RegistrationData) => Promise<void>;
}

interface StepForm {
  title: string;
  description: string;
  iconUrl: string;
}
const emptyStepForm: StepForm = { title: "", description: "", iconUrl: "" };

export default function RegistrationTab({
  data,
  onSave,
}: RegistrationTabProps) {
  const [steps, setSteps] = useState<RegistrationStep[]>(data.steps);
  const [estimateMinutes, setEstimateMinutes] = useState(data.estimateMinutes);
  const [formUrl, setFormUrl] = useState(data.formUrl);
  const [playStoreUrl, setPlayStoreUrl] = useState(data.playStoreUrl);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [stepForm, setStepForm] = useState<StepForm>(emptyStepForm);
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
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
    setEditingStepId(null);
    setStepForm(emptyStepForm);
    setFormError(null);
  }
  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type });
  }, []);

  async function persistData(
    updatedSteps: RegistrationStep[],
    est?: number,
    fUrl?: string,
    psUrl?: string,
  ) {
    setSaving(true);
    try {
      const payload: RegistrationData = {
        steps: updatedSteps,
        estimateMinutes: est ?? estimateMinutes,
        formUrl: fUrl ?? formUrl,
        playStoreUrl: psUrl ?? playStoreUrl,
      };
      await onSave(payload);
      setSteps(updatedSteps);
      if (est !== undefined) setEstimateMinutes(est);
      if (fUrl !== undefined) setFormUrl(fUrl);
      if (psUrl !== undefined) setPlayStoreUrl(psUrl);
      return true;
    } catch {
      showToast("Gagal menyimpan data.", "error");
      return false;
    } finally {
      setSaving(false);
    }
  }

  function handleAddStep() {
    if (steps.length >= 6) return;
    setEditingStepId(null);
    setStepForm(emptyStepForm);
    setShowModal(true);
    setFormError(null);
  }
  function handleEditStep(item: RegistrationStep) {
    setEditingStepId(item.id);
    setStepForm({
      title: item.title,
      description: item.description,
      iconUrl: item.iconUrl,
    });
    setShowModal(true);
    setFormError(null);
  }
  function handleDeleteStepClick(item: RegistrationStep) {
    if (steps.length <= 3) {
      showToast("Minimal 3 langkah.", "error");
      return;
    }
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
    if (success) showToast("Langkah dihapus.", "success");
  }

  async function handleSubmitStep(e: React.FormEvent) {
    e.preventDefault();
    if (!stepForm.title.trim()) {
      setFormError("Judul tidak boleh kosong.");
      return;
    }
    if (!stepForm.description.trim()) {
      setFormError("Deskripsi tidak boleh kosong.");
      return;
    }
    let updatedSteps: RegistrationStep[];
    if (editingStepId) {
      updatedSteps = steps.map((s) =>
        s.id === editingStepId
          ? {
              ...s,
              title: stepForm.title.trim(),
              description: stepForm.description.trim(),
              iconUrl: stepForm.iconUrl.trim() || s.iconUrl,
            }
          : s,
      );
    } else {
      const maxOrder =
        steps.length > 0 ? Math.max(...steps.map((s) => s.order)) : 0;
      updatedSteps = [
        ...steps,
        {
          id: `step-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          order: maxOrder + 1,
          title: stepForm.title.trim(),
          description: stepForm.description.trim(),
          iconUrl: stepForm.iconUrl.trim() || "/images/services/form.svg",
        },
      ];
    }
    const success = await persistData(updatedSteps);
    if (success) {
      showToast(
        editingStepId ? "Langkah diperbarui." : "Langkah ditambahkan.",
        "success",
      );
      closeModal();
    }
  }

  async function handleMoveUp(index: number) {
    if (index === 0) return;
    const newSteps = [...steps];
    [newSteps[index - 1], newSteps[index]] = [
      newSteps[index],
      newSteps[index - 1],
    ];
    const reordered = newSteps.map((s, i) => ({ ...s, order: i + 1 }));
    const success = await persistData(reordered);
    if (success) showToast("Urutan diperbarui.", "success");
  }

  async function handleMoveDown(index: number) {
    if (index === steps.length - 1) return;
    const newSteps = [...steps];
    [newSteps[index], newSteps[index + 1]] = [
      newSteps[index + 1],
      newSteps[index],
    ];
    const reordered = newSteps.map((s, i) => ({ ...s, order: i + 1 }));
    const success = await persistData(reordered);
    if (success) showToast("Urutan diperbarui.", "success");
  }

  async function handleSaveSettings() {
    if (estimateMinutes < 5 || estimateMinutes > 15) {
      showToast("Estimasi 5–15 menit.", "error");
      return;
    }
    if (!formUrl.trim()) {
      showToast("URL formulir wajib.", "error");
      return;
    }
    if (!playStoreUrl.trim()) {
      showToast("URL Play Store wajib.", "error");
      return;
    }
    const success = await persistData(
      steps,
      estimateMinutes,
      formUrl,
      playStoreUrl,
    );
    if (success) showToast("Pengaturan disimpan.", "success");
  }

  return (
    <div className="p-6 space-y-8">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">
            Langkah{" "}
            <span className="text-sm font-normal text-mu">
              ({steps.length} item, 3–6)
            </span>
          </h2>
          {steps.length < 6 && (
            <button
              type="button"
              onClick={handleAddStep}
              disabled={saving}
              className="btn bd sm"
            >
              <Icon name="add" /> Tambah Langkah
            </button>
          )}
        </div>
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="border border-ln rounded-xl p-4 bg-bg flex items-start justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-y text-navy text-xs font-bold">
                    {step.order}
                  </span>
                  <span className="font-semibold text-sm text-ink">
                    {step.title}
                  </span>
                </div>
                <p className="text-sm text-mu ml-8 line-clamp-2">
                  {step.description}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0 || saving}
                  className="p-1.5 text-mu hover:bg-surf rounded-md disabled:opacity-30"
                >
                  <Icon name="arrow_upward" className="text-[18px]" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveDown(index)}
                  disabled={index === steps.length - 1 || saving}
                  className="p-1.5 text-mu hover:bg-surf rounded-md disabled:opacity-30"
                >
                  <Icon name="arrow_downward" className="text-[18px]" />
                </button>
                <button
                  type="button"
                  onClick={() => handleEditStep(step)}
                  disabled={saving}
                  className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors disabled:opacity-50 ml-2"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteStepClick(step)}
                  disabled={saving || steps.length <= 3}
                  className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors disabled:opacity-30"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-ln" />

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-ink">Pengaturan</h2>
        <div>
          <label className="block text-sm font-medium text-ink mb-1">
            Estimasi Waktu (menit)
          </label>
          <input
            type="number"
            min={5}
            max={15}
            value={estimateMinutes}
            onChange={(e) => setEstimateMinutes(Number(e.target.value))}
            className="w-full px-3 py-2 border border-ln rounded-lg text-sm focus:ring-2 focus:ring-y outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-1">
            URL Formulir
          </label>
          <input
            type="url"
            value={formUrl}
            onChange={(e) => setFormUrl(e.target.value)}
            className="w-full px-3 py-2 border border-ln rounded-lg text-sm focus:ring-2 focus:ring-y outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-1">
            URL Play Store
          </label>
          <input
            type="url"
            value={playStoreUrl}
            onChange={(e) => setPlayStoreUrl(e.target.value)}
            className="w-full px-3 py-2 border border-ln rounded-lg text-sm focus:ring-2 focus:ring-y outline-none"
          />
        </div>
        <div className="pt-2">
          <button
            type="button"
            onClick={handleSaveSettings}
            disabled={saving}
            className="btn bd"
          >
            {saving ? "Menyimpan..." : "Simpan Pengaturan"}
          </button>
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative w-full max-w-lg bg-surf rounded-2xl shadow-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-ink">
              {editingStepId ? "Edit Langkah" : "Tambah Langkah"}
            </h3>
            {formError && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {formError}
              </div>
            )}
            <form onSubmit={handleSubmitStep} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">
                  Judul <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={stepForm.title}
                  onChange={(e) =>
                    setStepForm({ ...stepForm, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-ln rounded-lg text-sm focus:ring-2 focus:ring-y outline-none"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">
                  Deskripsi <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={stepForm.description}
                  onChange={(e) =>
                    setStepForm({ ...stepForm, description: e.target.value })
                  }
                  rows={2}
                  className="w-full px-3 py-2 border border-ln rounded-lg text-sm focus:ring-2 focus:ring-y outline-none resize-none"
                />
              </div>
              <IconPicker
                value={stepForm.iconUrl}
                onChange={(url) => setStepForm({ ...stepForm, iconUrl: url })}
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
          title="Hapus Langkah"
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
