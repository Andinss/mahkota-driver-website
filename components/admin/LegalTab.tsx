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
import { LegalData, LegalSection } from "@/types/content";
import Toast, { ToastType } from "./Toast";
import ConfirmDialog from "./ConfirmDialog";
import PageHeader from "./PageHeader";
import Modal from "./Modal";
import Ico from "./Ico";

interface LegalTabProps {
  data: LegalData;
  onSave: (data: LegalData) => Promise<void>;
  /** Judul halaman, mis. "Syarat & ketentuan". */
  title: string;
  /** Alamat halaman publik, mis. "/syarat-ketentuan". */
  href: string;
  /** Awalan id bagian baru, mis. "term" atau "priv". */
  idPrefix: string;
}

const MIN_SECTIONS = 1;

/** Tanggal hari ini (zona waktu perangkat) dalam format YYYY-MM-DD. */
function today() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Satu bagian pertama baris isi, tanpa penanda daftar, untuk pratinjau di daftar. */
function preview(body: string) {
  return body
    .split("\n")
    .map((l) => l.replace(/^-\s+/, "").trim())
    .filter(Boolean)
    .join(" · ");
}

export default function LegalTab({
  data,
  onSave,
  title,
  href,
  idPrefix,
}: LegalTabProps) {
  const [sections, setSections] = useState<LegalSection[]>(data.sections);
  const [updatedAt, setUpdatedAt] = useState(data.updatedAt);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState<{ editingId: string | null } | null>(null);
  const [form, setForm] = useState({ title: "", body: "" });
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<LegalSection | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type });
  }, []);

  async function persist(updated: LegalSection[]) {
    const date = today();
    setSaving(true);
    try {
      await onSave({ updatedAt: date, sections: updated });
      setSections(updated);
      setUpdatedAt(date);
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
    setForm({ title: "", body: "" });
    setFormError(null);
    setModal({ editingId: null });
  }

  function openEdit(item: LegalSection) {
    setForm({ title: item.title, body: item.body });
    setFormError(null);
    setModal({ editingId: item.id });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!modal) return;
    const sectionTitle = form.title.trim();
    const body = form.body.trim();
    if (!sectionTitle) {
      setFormError("Judul bagian tidak boleh kosong.");
      return;
    }
    if (!body) {
      setFormError("Isi bagian tidak boleh kosong.");
      return;
    }
    const updated = modal.editingId
      ? sections.map((s) =>
          s.id === modal.editingId ? { ...s, title: sectionTitle, body } : s,
        )
      : [
          ...sections,
          {
            id: `${idPrefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            title: sectionTitle,
            body,
          },
        ];
    if (await persist(updated)) {
      showToast("Bagian disimpan.", "success");
      closeModal();
    }
  }

  function requestDelete(item: LegalSection) {
    if (sections.length <= MIN_SECTIONS) {
      showToast(`Minimal ${MIN_SECTIONS} bagian diperlukan.`, "error");
      return;
    }
    setConfirmDelete(item);
  }

  async function handleConfirmDelete() {
    if (!confirmDelete) return;
    setDeleting(true);
    const ok = await persist(sections.filter((s) => s.id !== confirmDelete.id));
    setDeleting(false);
    setConfirmDelete(null);
    if (ok) showToast("Bagian dihapus.", "success");
  }

  async function handleMove(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    [next[index], next[target]] = [next[target], next[index]];
    if (await persist(next)) showToast("Urutan disimpan.", "success");
  }

  return (
    <div>
      <PageHeader
        title={title}
        description={`Isi halaman ${href}. Tanggal “terakhir diperbarui” di website ikut berubah otomatis setiap Anda menyimpan.`}
      >
        <span className="a-tag">Diperbarui {formatDate(updatedAt)}</span>
        <a
          href={href}
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
          Tambah bagian
        </button>
      </PageHeader>

      <div className="a-list">
        {sections.map((item, index) => (
          <div key={item.id} className="a-card a-item">
            <div className="a-txt">
              <b>{item.title}</b>
              <span>{preview(item.body)}</span>
            </div>
            <div className="a-ctl">
              <button
                type="button"
                className="a-icon-btn a-sm"
                onClick={() => handleMove(index, -1)}
                disabled={index === 0 || saving}
                title="Naikkan"
                aria-label={`Naikkan bagian ${item.title}`}
              >
                <Ico icon={ArrowUp01Icon} />
              </button>
              <button
                type="button"
                className="a-icon-btn a-sm"
                onClick={() => handleMove(index, 1)}
                disabled={index === sections.length - 1 || saving}
                title="Turunkan"
                aria-label={`Turunkan bagian ${item.title}`}
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
                  sections.length <= MIN_SECTIONS ? "a-locked" : ""
                }`.trim()}
                onClick={() => requestDelete(item)}
                disabled={saving}
                title="Hapus bagian"
                aria-label={`Hapus bagian ${item.title}`}
              >
                <Ico icon={Delete02Icon} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal
          title={modal.editingId ? "Edit bagian" : "Tambah bagian"}
          onClose={closeModal}
          onSubmit={handleSubmit}
          error={formError}
          saving={saving}
        >
          <div className="a-field">
            <label htmlFor="lg-title">
              Judul bagian <span className="a-req">*</span>
            </label>
            <input
              id="lg-title"
              className="a-input"
              type="text"
              placeholder="Contoh: 2. Syarat Pendaftaran"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              autoFocus
            />
          </div>
          <div className="a-field">
            <label htmlFor="lg-body">
              Isi <span className="a-req">*</span>
            </label>
            <textarea
              id="lg-body"
              className="a-input a-ta"
              rows={9}
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
            />
            <p className="a-hint">
              Pisahkan paragraf dengan satu baris kosong. Awali baris dengan “-
              ” untuk membuat daftar poin.
            </p>
          </div>
        </Modal>
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Hapus bagian?"
          message={`"${confirmDelete.title}" akan dihapus dari halaman ${title}. Tindakan ini tidak bisa dibatalkan.`}
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
