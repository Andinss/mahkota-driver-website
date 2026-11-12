"use client";

import { useState, useCallback, type FormEvent } from "react";
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  Edit02Icon,
} from "@hugeicons/core-free-icons";
import { RegistrationData, RegistrationStep } from "@/types/content";
import Toast, { ToastType } from "./Toast";
import PageHeader from "./PageHeader";
import Modal from "./Modal";
import Ico from "./Ico";

interface RegistrationTabProps {
  data: RegistrationData;
  onSave: (data: RegistrationData) => Promise<void>;
}

interface StepForm {
  title: string;
  description: string;
}

export default function RegistrationTab({
  data,
  onSave,
}: RegistrationTabProps) {
  const [steps, setSteps] = useState<RegistrationStep[]>(data.steps);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<RegistrationStep | null>(null);
  const [form, setForm] = useState<StepForm>({ title: "", description: "" });
  const [formError, setFormError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type });
  }, []);

  async function persist(updated: RegistrationStep[]) {
    setSaving(true);
    try {
      // `...data` menjaga field lain (mis. estimateMinutes) tetap utuh.
      await onSave({ ...data, steps: updated });
      setSteps(updated);
      return true;
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Gagal menyimpan data.",
        "error",
      );
      return false;
    } finally {
      setSaving(false);
    }
  }

  function openEdit(step: RegistrationStep) {
    setEditing(step);
    setForm({ title: step.title, description: step.description });
    setFormError(null);
  }

  function closeModal() {
    setEditing(null);
    setFormError(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    if (!form.title.trim()) {
      setFormError("Judul tidak boleh kosong.");
      return;
    }
    if (!form.description.trim()) {
      setFormError("Deskripsi tidak boleh kosong.");
      return;
    }
    const updated = steps.map((s) =>
      s.id === editing.id
        ? {
            ...s,
            title: form.title.trim(),
            description: form.description.trim(),
          }
        : s,
    );
    if (await persist(updated)) {
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
    if (await persist(reordered)) showToast("Urutan disimpan.", "success");
  }

  return (
    <div>
      <PageHeader
        title="Cara bergabung"
        description="Ubah judul dan penjelasan tiap langkah pendaftaran, atau geser urutannya."
      >
        <span className="a-tag">
          <b>{steps.length}</b> langkah
        </span>
      </PageHeader>

      <div className="a-steps">
        {steps.map((step, index) => (
          <div key={step.id} className="a-step">
            <span className="a-no">{index + 1}</span>
            <div className="a-card a-item">
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
                  onClick={() => openEdit(step)}
                  disabled={saving}
                >
                  <Ico icon={Edit02Icon} />
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <Modal
          title="Edit langkah"
          onClose={closeModal}
          onSubmit={handleSubmit}
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
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
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
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
        </Modal>
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
