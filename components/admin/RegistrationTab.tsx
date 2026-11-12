"use client";

import { useState, useCallback, type FormEvent } from "react";
import {
  Add01Icon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  Delete02Icon,
  Edit02Icon,
  Link01Icon,
  MinusSignIcon,
} from "@hugeicons/core-free-icons";
import { RegistrationData, RegistrationStep } from "@/types/content";
import Toast, { ToastType } from "./Toast";
import ConfirmDialog from "./ConfirmDialog";
import HugeiconPicker from "./HugeiconPicker";
import PageHeader from "./PageHeader";
import Modal from "./Modal";
import Ico from "./Ico";
import Icon from "@/components/ui/Icon";

interface RegistrationTabProps {
  data: RegistrationData;
  onSave: (data: RegistrationData) => Promise<void>;
}

interface StepForm {
  title: string;
  description: string;
  icon: string;
}

const emptyStepForm: StepForm = { title: "", description: "", icon: "" };

const MIN_STEPS = 3;
const MAX_STEPS = 6;
const MIN_MINUTES = 5;
const MAX_MINUTES = 15;

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

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type });
  }, []);

  function closeModal() {
    setShowModal(false);
    setEditingStepId(null);
    setStepForm(emptyStepForm);
    setFormError(null);
  }

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
    if (steps.length >= MAX_STEPS) return;
    setEditingStepId(null);
    setStepForm(emptyStepForm);
    setFormError(null);
    setShowModal(true);
  }

  function handleEditStep(item: RegistrationStep) {
    setEditingStepId(item.id);
    setStepForm({
      title: item.title,
      description: item.description,
      icon: item.icon ?? "",
    });
    setFormError(null);
    setShowModal(true);
  }

  function handleDeleteStepClick(item: RegistrationStep) {
    if (steps.length <= MIN_STEPS) {
      showToast(`Minimal ${MIN_STEPS} langkah diperlukan.`, "error");
      return;
    }
    setConfirmDelete({ id: item.id, name: item.title });
  }

  async function handleConfirmDelete() {
    if (!confirmDelete) return;
    setDeleting(true);
    const reordered = steps
      .filter((s) => s.id !== confirmDelete.id)
      .map((s, i) => ({ ...s, order: i + 1 }));
    const success = await persistData(reordered);
    setDeleting(false);
    setConfirmDelete(null);
    if (success) showToast("Langkah dihapus.", "success");
  }

  async function handleSubmitStep(e: FormEvent) {
    e.preventDefault();
    if (!stepForm.title.trim()) {
      setFormError("Judul tidak boleh kosong.");
      return;
    }
    if (!stepForm.description.trim()) {
      setFormError("Deskripsi tidak boleh kosong.");
      return;
    }
    const icon = stepForm.icon.trim() || undefined;

    let updatedSteps: RegistrationStep[];
    if (editingStepId) {
      updatedSteps = steps.map((s) =>
        s.id === editingStepId
          ? {
              ...s,
              title: stepForm.title.trim(),
              description: stepForm.description.trim(),
              icon,
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
          icon,
        },
      ];
    }
    const success = await persistData(updatedSteps);
    if (success) {
      showToast("Langkah disimpan.", "success");
      closeModal();
    }
  }

  async function handleMove(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= steps.length) return;
    const next = [...steps];
    [next[index], next[target]] = [next[target], next[index]];
    const reordered = next.map((s, i) => ({ ...s, order: i + 1 }));
    const success = await persistData(reordered);
    if (success) showToast("Urutan disimpan.", "success");
  }

  function stepMinutes(delta: number) {
    setEstimateMinutes((m) =>
      Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, m + delta)),
    );
  }

  async function handleSaveSettings(e: FormEvent) {
    e.preventDefault();
    if (estimateMinutes < MIN_MINUTES || estimateMinutes > MAX_MINUTES) {
      showToast(`Estimasi harus ${MIN_MINUTES}–${MAX_MINUTES} menit.`, "error");
      return;
    }
    if (!formUrl.trim()) {
      showToast("Tautan formulir wajib diisi.", "error");
      return;
    }
    if (!playStoreUrl.trim()) {
      showToast("Tautan Play Store wajib diisi.", "error");
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
    <div>
      <PageHeader
        title="Cara bergabung"
        description="Atur langkah pendaftaran dan tautan yang dipakai calon mitra."
      />

      <div className="a-reg">
        <div>
          <div className="a-sub-head">
            <div className="a-ph-r">
              <h2 style={{ fontSize: "1.3rem" }}>Langkah pendaftaran</h2>
              <span className="a-tag">
                <b>{steps.length}</b> dari maks. {MAX_STEPS}
              </span>
            </div>
            {steps.length < MAX_STEPS && (
              <button
                type="button"
                className="a-btn a-bd"
                onClick={handleAddStep}
                disabled={saving}
              >
                <Ico icon={Add01Icon} />
                Tambah langkah
              </button>
            )}
          </div>

          <div className="a-steps">
            {steps.map((step, index) => (
              <div key={step.id} className="a-step">
                <span className="a-no">{index + 1}</span>
                <div className="a-card a-item">
                  <div className="a-ib a-soft">
                    {step.icon ? (
                      <Icon name={step.icon} />
                    ) : (
                      <span aria-hidden="true">—</span>
                    )}
                  </div>
                  <div className="a-txt">
                    <b>{step.title}</b>
                    <span>{step.description}</span>
                  </div>
                  <div className="a-ctl">
                    <button
                      type="button"
                      className="a-icon-btn a-sm"
                      onClick={() => handleMove(index, -1)}
                      disabled={index === 0 || saving}
                      title="Naikkan"
                      aria-label={`Naikkan langkah ${step.title}`}
                    >
                      <Ico icon={ArrowUp01Icon} />
                    </button>
                    <button
                      type="button"
                      className="a-icon-btn a-sm"
                      onClick={() => handleMove(index, 1)}
                      disabled={index === steps.length - 1 || saving}
                      title="Turunkan"
                      aria-label={`Turunkan langkah ${step.title}`}
                    >
                      <Ico icon={ArrowDown01Icon} />
                    </button>
                    <span className="a-sep" />
                    <button
                      type="button"
                      className="a-btn a-bo a-sm"
                      onClick={() => handleEditStep(step)}
                      disabled={saving}
                    >
                      <Ico icon={Edit02Icon} />
                      Edit
                    </button>
                    <button
                      type="button"
                      className={`a-icon-btn a-del ${
                        steps.length <= MIN_STEPS ? "a-locked" : ""
                      }`.trim()}
                      onClick={() => handleDeleteStepClick(step)}
                      disabled={saving}
                      title="Hapus langkah"
                      aria-label={`Hapus langkah ${step.title}`}
                    >
                      <Ico icon={Delete02Icon} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form className="a-card a-reg-side" onSubmit={handleSaveSettings}>
          <h2>Pengaturan pendaftaran</h2>
          <p>Dipakai di bagian &quot;Cara bergabung&quot; dan tombol unduh aplikasi.</p>

          <div className="a-field">
            <span className="a-lbl">
              Perkiraan waktu daftar
              <span className="a-opt">
                {MIN_MINUTES} sampai {MAX_MINUTES} menit
              </span>
            </span>
            <div className="a-stepper">
              <button
                type="button"
                onClick={() => stepMinutes(-1)}
                disabled={estimateMinutes <= MIN_MINUTES}
                aria-label="Kurangi satu menit"
              >
                <Ico icon={MinusSignIcon} />
              </button>
              <output aria-live="polite">
                <span>{estimateMinutes}</span> <small>menit</small>
              </output>
              <button
                type="button"
                onClick={() => stepMinutes(1)}
                disabled={estimateMinutes >= MAX_MINUTES}
                aria-label="Tambah satu menit"
              >
                <Ico icon={Add01Icon} />
              </button>
            </div>
          </div>

          <div className="a-field">
            <label htmlFor="r-form">Tautan formulir</label>
            <div className="a-has-ic">
              <Ico icon={Link01Icon} />
              <input
                id="r-form"
                className="a-input"
                type="url"
                value={formUrl}
                onChange={(e) => setFormUrl(e.target.value)}
              />
            </div>
          </div>

          <div className="a-field">
            <label htmlFor="r-play">Tautan Play Store</label>
            <div className="a-has-ic">
              <Ico icon={Link01Icon} />
              <input
                id="r-play"
                className="a-input"
                type="url"
                value={playStoreUrl}
                onChange={(e) => setPlayStoreUrl(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="a-btn a-bd a-block"
            disabled={saving}
          >
            {saving ? "Menyimpan..." : "Simpan pengaturan"}
          </button>
        </form>
      </div>

      {showModal && (
        <Modal
          title={editingStepId ? "Edit langkah" : "Tambah langkah"}
          onClose={closeModal}
          onSubmit={handleSubmitStep}
          error={formError}
          saving={saving}
        >
          <div className="a-field">
            <label htmlFor="p-title">
              Judul <span className="a-req">*</span>
            </label>
            <input
              id="p-title"
              className="a-input"
              type="text"
              value={stepForm.title}
              onChange={(e) =>
                setStepForm({ ...stepForm, title: e.target.value })
              }
              autoFocus
            />
          </div>
          <div className="a-field">
            <label htmlFor="p-desc">
              Deskripsi <span className="a-req">*</span>
            </label>
            <textarea
              id="p-desc"
              className="a-input a-ta"
              rows={3}
              value={stepForm.description}
              onChange={(e) =>
                setStepForm({ ...stepForm, description: e.target.value })
              }
            />
          </div>
          <HugeiconPicker
            value={stepForm.icon}
            onChange={(key) => setStepForm({ ...stepForm, icon: key })}
            label="Ikon"
          />
        </Modal>
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Hapus langkah?"
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
