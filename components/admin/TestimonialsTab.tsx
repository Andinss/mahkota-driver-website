"use client";

import { useState, useCallback, type FormEvent } from "react";
import {
  Add01Icon,
  Delete02Icon,
  Edit02Icon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import { TestimonialsData, Testimonial } from "@/types/content";
import Toast, { ToastType } from "./Toast";
import ConfirmDialog from "./ConfirmDialog";
import PhotoUpload from "./PhotoUpload";
import PageHeader from "./PageHeader";
import Modal from "./Modal";
import Ico from "./Ico";

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

const emptyForm: TestimonialForm = {
  name: "",
  description: "",
  quote: "",
  rating: 5,
  photoUrl: "",
};

const MIN_ITEMS = 1;

function initials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("") || "?"
  );
}

export default function TestimonialsTab({
  data,
  onSave,
}: TestimonialsTabProps) {
  const [items, setItems] = useState<Testimonial[]>(data.items);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TestimonialForm>(emptyForm);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
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
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
  }

  async function persistData(updatedItems: Testimonial[]) {
    setSaving(true);
    try {
      await onSave({ items: updatedItems });
      setItems(updatedItems);
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

  function handleEdit(item: Testimonial) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: item.description || "",
      quote: item.quote,
      rating: item.rating,
      photoUrl: item.photoUrl || "",
    });
    setFormError(null);
    setShowModal(true);
  }

  function handleDeleteClick(item: Testimonial) {
    if (items.length <= MIN_ITEMS) {
      showToast(`Minimal ${MIN_ITEMS} testimoni diperlukan.`, "error");
      return;
    }
    setConfirmDelete({ id: item.id, name: item.name });
  }

  async function handleConfirmDelete() {
    if (!confirmDelete) return;
    setDeleting(true);
    const success = await persistData(
      items.filter((t) => t.id !== confirmDelete.id),
    );
    setDeleting(false);
    setConfirmDelete(null);
    if (success) showToast("Testimoni dihapus.", "success");
  }

  async function handleSubmitForm(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      setFormError("Nama tidak boleh kosong.");
      return;
    }
    if (!form.quote.trim()) {
      setFormError("Kutipan tidak boleh kosong.");
      return;
    }

    const testimonial: Testimonial = {
      id:
        editingId ||
        `testi-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
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
      showToast("Testimoni disimpan.", "success");
      closeModal();
    }
  }

  return (
    <div>
      <PageHeader
        title="Testimoni"
        description="Ulasan dari mitra driver yang tampil di beranda."
      >
        <span className="a-tag">
          <b>{items.length}</b> testimoni
        </span>
        <button
          type="button"
          className="a-btn a-bd"
          onClick={handleAdd}
          disabled={saving}
        >
          <Ico icon={Add01Icon} />
          Tambah testimoni
        </button>
      </PageHeader>

      <div className="a-grid a-g3">
        {items.map((item) => (
          <article key={item.id} className="a-card a-item a-testi">
            <div className="a-testi-top">
              <div className="a-pic">
                {item.photoUrl ? (
                  <img src={item.photoUrl} alt={`Foto ${item.name}`} />
                ) : (
                  initials(item.name)
                )}
              </div>
              <div className="a-who">
                <b>{item.name}</b>
                {item.description && <small>{item.description}</small>}
              </div>
            </div>
            <div
              className="a-rate"
              role="img"
              aria-label={`Rating ${item.rating} dari 5`}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <Ico
                  key={n}
                  icon={StarIcon}
                  className={n > item.rating ? "a-off" : ""}
                />
              ))}
            </div>
            <p className="a-quote">{item.quote}</p>
            <div className="a-card-foot">
              <button
                type="button"
                className="a-btn a-bo a-sm"
                onClick={() => handleEdit(item)}
                disabled={saving}
              >
                <Ico icon={Edit02Icon} />
                Edit
              </button>
              <span className="a-sp" />
              <button
                type="button"
                className={`a-icon-btn a-del ${
                  items.length <= MIN_ITEMS ? "a-locked" : ""
                }`.trim()}
                onClick={() => handleDeleteClick(item)}
                disabled={saving}
                title="Hapus testimoni"
                aria-label={`Hapus testimoni ${item.name}`}
              >
                <Ico icon={Delete02Icon} />
              </button>
            </div>
          </article>
        ))}
      </div>

      {showModal && (
        <Modal
          title={editingId ? "Edit testimoni" : "Tambah testimoni"}
          onClose={closeModal}
          onSubmit={handleSubmitForm}
          error={formError}
          saving={saving}
        >
          <div className="a-field">
            <label htmlFor="t-name">
              Nama <span className="a-req">*</span>
            </label>
            <input
              id="t-name"
              className="a-input"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              autoFocus
            />
          </div>
          <div className="a-field">
            <label htmlFor="t-desc">
              Keterangan <span className="a-opt">Opsional</span>
            </label>
            <input
              id="t-desc"
              className="a-input"
              type="text"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Contoh: Driver Gojek Jakarta"
            />
          </div>
          <div className="a-field">
            <label htmlFor="t-quote">
              Kutipan <span className="a-req">*</span>
            </label>
            <textarea
              id="t-quote"
              className="a-input a-ta"
              rows={4}
              value={form.quote}
              onChange={(e) => setForm({ ...form, quote: e.target.value })}
            />
          </div>
          <div className="a-field">
            <span className="a-lbl">Rating</span>
            <div className="a-stars">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={n <= form.rating ? "a-on" : ""}
                  onClick={() => setForm({ ...form, rating: n })}
                  aria-label={`${n} bintang`}
                  aria-pressed={n === form.rating}
                >
                  <Ico icon={StarIcon} />
                </button>
              ))}
            </div>
          </div>
          <PhotoUpload
            value={form.photoUrl}
            onChange={(url) => setForm({ ...form, photoUrl: url })}
            category="testimonials"
          />
        </Modal>
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Hapus testimoni?"
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
