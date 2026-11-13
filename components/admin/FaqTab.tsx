"use client";

import { useCallback, useState, type FormEvent } from "react";
import {
  Add01Icon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  Delete02Icon,
  Edit02Icon,
  LinkSquare02Icon,
} from "@hugeicons/core-free-icons";
import { FaqData, FaqItem } from "@/types/content";
import Toast, { ToastType } from "./Toast";
import ConfirmDialog from "./ConfirmDialog";
import PageHeader from "./PageHeader";
import Modal from "./Modal";
import Ico from "./Ico";

interface FaqTabProps {
  data: FaqData;
  onSave: (data: FaqData) => Promise<void>;
}

const MIN_ITEMS = 1;

export default function FaqTab({ data, onSave }: FaqTabProps) {
  const [items, setItems] = useState<FaqItem[]>(data.items);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState<{ editingId: string | null } | null>(null);
  const [form, setForm] = useState({ question: "", answer: "" });
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<FaqItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type });
  }, []);

  async function persist(updated: FaqItem[]) {
    setSaving(true);
    try {
      await onSave({ items: updated });
      setItems(updated);
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

  function closeModal() {
    setModal(null);
    setFormError(null);
  }

  function openAdd() {
    setForm({ question: "", answer: "" });
    setFormError(null);
    setModal({ editingId: null });
  }

  function openEdit(item: FaqItem) {
    setForm({ question: item.question, answer: item.answer });
    setFormError(null);
    setModal({ editingId: item.id });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!modal) return;
    const question = form.question.trim();
    const answer = form.answer.trim();
    if (!question) {
      setFormError("Pertanyaan tidak boleh kosong.");
      return;
    }
    if (!answer) {
      setFormError("Jawaban tidak boleh kosong.");
      return;
    }
    const updated = modal.editingId
      ? items.map((i) =>
          i.id === modal.editingId ? { ...i, question, answer } : i,
        )
      : [
          ...items,
          {
            id: `faq-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            question,
            answer,
          },
        ];
    if (await persist(updated)) {
      showToast("Pertanyaan disimpan.", "success");
      closeModal();
    }
  }

  function requestDelete(item: FaqItem) {
    if (items.length <= MIN_ITEMS) {
      showToast(`Minimal ${MIN_ITEMS} pertanyaan diperlukan.`, "error");
      return;
    }
    setConfirmDelete(item);
  }

  async function handleConfirmDelete() {
    if (!confirmDelete) return;
    setDeleting(true);
    const ok = await persist(items.filter((i) => i.id !== confirmDelete.id));
    setDeleting(false);
    setConfirmDelete(null);
    if (ok) showToast("Pertanyaan dihapus.", "success");
  }

  async function handleMove(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    if (await persist(next)) showToast("Urutan disimpan.", "success");
  }

  return (
    <div>
      <PageHeader
        title="FAQ"
        description="Pertanyaan umum di halaman /faq. Urutan di sini sama dengan urutan di website."
      >
        <a
          href="/faq"
          target="_blank"
          rel="noopener noreferrer"
          className="a-btn a-bo"
        >
          <Ico icon={LinkSquare02Icon} />
          Lihat halaman
        </a>
        <button
          type="button"
          className="a-btn a-bd"
          onClick={openAdd}
          disabled={saving}
        >
          <Ico icon={Add01Icon} />
          Tambah pertanyaan
        </button>
      </PageHeader>

      <div className="a-list">
        {items.map((item, index) => (
          <div key={item.id} className="a-card a-item">
            <span className="a-idx">{index + 1}</span>
            <div className="a-txt">
              <b>{item.question}</b>
              <span>{item.answer}</span>
            </div>
            <div className="a-ctl">
              <button
                type="button"
                className="a-icon-btn a-sm"
                onClick={() => handleMove(index, -1)}
                disabled={index === 0 || saving}
                title="Naikkan"
                aria-label={`Naikkan pertanyaan ${index + 1}`}
              >
                <Ico icon={ArrowUp01Icon} />
              </button>
              <button
                type="button"
                className="a-icon-btn a-sm"
                onClick={() => handleMove(index, 1)}
                disabled={index === items.length - 1 || saving}
                title="Turunkan"
                aria-label={`Turunkan pertanyaan ${index + 1}`}
              >
                <Ico icon={ArrowDown01Icon} />
              </button>
              <span className="a-sep" />
              <button
                type="button"
                className="a-btn a-bo a-sm"
                onClick={() => openEdit(item)}
                disabled={saving}
              >
                <Ico icon={Edit02Icon} />
                Edit
              </button>
              <button
                type="button"
                className={`a-icon-btn a-del ${
                  items.length <= MIN_ITEMS ? "a-locked" : ""
                }`.trim()}
                onClick={() => requestDelete(item)}
                disabled={saving}
                title="Hapus pertanyaan"
                aria-label={`Hapus pertanyaan ${index + 1}`}
              >
                <Ico icon={Delete02Icon} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal
          title={modal.editingId ? "Edit pertanyaan" : "Tambah pertanyaan"}
          onClose={closeModal}
          onSubmit={handleSubmit}
          error={formError}
          saving={saving}
        >
          <div className="a-field">
            <label htmlFor="faq-q">
              Pertanyaan <span className="a-req">*</span>
            </label>
            <input
              id="faq-q"
              className="a-input"
              type="text"
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              autoFocus
            />
          </div>
          <div className="a-field">
            <label htmlFor="faq-a">
              Jawaban <span className="a-req">*</span>
            </label>
            <textarea
              id="faq-a"
              className="a-input a-ta"
              rows={6}
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
            />
          </div>
        </Modal>
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Hapus pertanyaan?"
          message={`"${confirmDelete.question}" akan dihapus dari halaman FAQ. Tindakan ini tidak bisa dibatalkan.`}
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
