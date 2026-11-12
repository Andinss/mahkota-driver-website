"use client";

import { useState, useCallback, type FormEvent } from "react";
import {
  Add01Icon,
  Delete02Icon,
  Edit02Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { ServicesData, Service, Advantage } from "@/types/content";
import Toast, { ToastType } from "./Toast";
import ConfirmDialog from "./ConfirmDialog";
import HugeiconPicker from "./HugeiconPicker";
import PageHeader from "./PageHeader";
import Modal from "./Modal";
import Ico from "./Ico";
import Icon from "@/components/ui/Icon";

interface ServicesTabProps {
  data: ServicesData;
  onSave: (data: ServicesData) => Promise<void>;
}

/** Layanan memakai `name`, keunggulan memakai `title`; form disatukan. */
interface ItemForm {
  name: string;
  description: string;
  iconAlt: string;
  icon: string;
}

const emptyForm: ItemForm = { name: "", description: "", iconAlt: "", icon: "" };

type Kind = "service" | "advantage";
type SubTab = "layanan" | "keunggulan";

const MIN_ITEMS = 3;

const KIND: Record<
  Kind,
  { noun: string; Noun: string; nameLabel: string; max: number }
> = {
  service: {
    noun: "layanan",
    Noun: "Layanan",
    nameLabel: "Nama layanan",
    max: 150,
  },
  advantage: {
    noun: "keunggulan",
    Noun: "Keunggulan",
    nameLabel: "Judul keunggulan",
    max: 100,
  },
};

export default function ServicesTab({ data, onSave }: ServicesTabProps) {
  const [services, setServices] = useState<Service[]>(data.services);
  const [advantages, setAdvantages] = useState<Advantage[]>(data.advantages);
  const [saving, setSaving] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("layanan");
  const [modal, setModal] = useState<{
    kind: Kind;
    editingId: string | null;
  } | null>(null);
  const [form, setForm] = useState<ItemForm>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    kind: Kind;
    id: string;
    name: string;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type });
  }, []);

  function closeModal() {
    setModal(null);
    setForm(emptyForm);
    setFormError(null);
  }

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

  function openAdd(kind: Kind) {
    setForm(emptyForm);
    setFormError(null);
    setModal({ kind, editingId: null });
  }

  function openEditService(item: Service) {
    setForm({
      name: item.name,
      description: item.description,
      iconAlt: item.iconAlt,
      icon: item.icon ?? "",
    });
    setFormError(null);
    setModal({ kind: "service", editingId: item.id });
  }

  function openEditAdvantage(item: Advantage) {
    setForm({
      name: item.title,
      description: item.description,
      iconAlt: item.iconAlt ?? "",
      icon: item.icon ?? "",
    });
    setFormError(null);
    setModal({ kind: "advantage", editingId: item.id });
  }

  function handleDeleteClick(kind: Kind, id: string, name: string) {
    const count = kind === "service" ? services.length : advantages.length;
    if (count <= MIN_ITEMS) {
      showToast(
        `Minimal ${MIN_ITEMS} ${KIND[kind].noun} diperlukan.`,
        "error",
      );
      return;
    }
    setConfirmDelete({ kind, id, name });
  }

  async function handleConfirmDelete() {
    if (!confirmDelete) return;
    setDeleting(true);
    const success =
      confirmDelete.kind === "service"
        ? await persistData(
            services.filter((s) => s.id !== confirmDelete.id),
            advantages,
          )
        : await persistData(
            services,
            advantages.filter((a) => a.id !== confirmDelete.id),
          );
    setDeleting(false);
    const kind = confirmDelete.kind;
    setConfirmDelete(null);
    if (success) showToast(`${KIND[kind].Noun} dihapus.`, "success");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!modal) return;
    const { kind, editingId } = modal;
    const name = form.name.trim();
    if (!name) {
      setFormError(`${KIND[kind].nameLabel} tidak boleh kosong.`);
      return;
    }
    const description = form.description.trim();
    const iconAlt = form.iconAlt.trim() || name;
    const icon = form.icon.trim() || undefined;

    let success: boolean;
    if (kind === "service") {
      const service: Service = {
        id:
          editingId ||
          `svc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name,
        description,
        iconAlt,
        icon,
      };
      const updated = editingId
        ? services.map((s) => (s.id === editingId ? service : s))
        : [...services, service];
      success = await persistData(updated, advantages);
    } else {
      const advantage: Advantage = {
        id:
          editingId ||
          `adv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title: name,
        description,
        iconAlt,
        icon,
      };
      const updated = editingId
        ? advantages.map((a) => (a.id === editingId ? advantage : a))
        : [...advantages, advantage];
      success = await persistData(services, updated);
    }
    if (success) {
      showToast(`${KIND[kind].Noun} disimpan.`, "success");
      closeModal();
    }
  }

  function renderIcon(icon?: string) {
    return (
      <div className="a-ib">
        {icon ? <Icon name={icon} /> : <span aria-hidden="true">—</span>}
      </div>
    );
  }

  function renderFoot(
    kind: Kind,
    id: string,
    name: string,
    onEdit: () => void,
    locked: boolean,
  ) {
    return (
      <div className="a-card-foot">
        <button
          type="button"
          className="a-btn a-bo a-sm"
          onClick={onEdit}
          disabled={saving}
        >
          <Ico icon={Edit02Icon} />
          Edit
        </button>
        <span className="a-sp" />
        <button
          type="button"
          className={`a-icon-btn a-del ${locked ? "a-locked" : ""}`.trim()}
          onClick={() => handleDeleteClick(kind, id, name)}
          disabled={saving}
          title={`Hapus ${KIND[kind].noun}`}
          aria-label={`Hapus ${KIND[kind].noun} ${name}`}
        >
          <Ico icon={Delete02Icon} />
        </button>
      </div>
    );
  }

  const activeKind: Kind = activeSubTab === "layanan" ? "service" : "advantage";

  return (
    <div>
      <PageHeader
        title="Layanan & keunggulan"
        description="Atur skema sewa dan alasan driver memilih Mahkota Drive."
      />

      <div className="a-sub-head">
        <div className="a-seg" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeSubTab === "layanan"}
            className={activeSubTab === "layanan" ? "a-on" : ""}
            onClick={() => setActiveSubTab("layanan")}
          >
            Layanan <small>{services.length}</small>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeSubTab === "keunggulan"}
            className={activeSubTab === "keunggulan" ? "a-on" : ""}
            onClick={() => setActiveSubTab("keunggulan")}
          >
            Keunggulan <small>{advantages.length}</small>
          </button>
        </div>
        <div className="a-ph-r">
          <span className="a-rule">
            <Ico icon={InformationCircleIcon} />
            Minimal {MIN_ITEMS} item di tiap bagian
          </span>
          <button
            type="button"
            className="a-btn a-bd"
            onClick={() => openAdd(activeKind)}
            disabled={saving}
          >
            <Ico icon={Add01Icon} />
            Tambah {KIND[activeKind].noun}
          </button>
        </div>
      </div>

      {activeSubTab === "layanan" && (
        <div className="a-grid a-g3">
          {services.map((s) => (
            <article key={s.id} className="a-card a-item a-svc">
              {renderIcon(s.icon)}
              <h3>{s.name}</h3>
              {s.description && <p>{s.description}</p>}
              {renderFoot(
                "service",
                s.id,
                s.name,
                () => openEditService(s),
                services.length <= MIN_ITEMS,
              )}
            </article>
          ))}
        </div>
      )}

      {activeSubTab === "keunggulan" && (
        <div className="a-grid a-g2">
          {advantages.map((a) => (
            <article key={a.id} className="a-card a-item a-svc a-row">
              {renderIcon(a.icon)}
              <div className="a-body">
                <h3>{a.title}</h3>
                {a.description && <p>{a.description}</p>}
                {renderFoot(
                  "advantage",
                  a.id,
                  a.title,
                  () => openEditAdvantage(a),
                  advantages.length <= MIN_ITEMS,
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {modal && (
        <Modal
          title={`${modal.editingId ? "Edit" : "Tambah"} ${KIND[modal.kind].noun}`}
          onClose={closeModal}
          onSubmit={handleSubmit}
          error={formError}
          saving={saving}
        >
          <div className="a-field">
            <label htmlFor="s-name">
              {KIND[modal.kind].nameLabel} <span className="a-req">*</span>
            </label>
            <input
              id="s-name"
              className="a-input"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              autoFocus
            />
          </div>
          <div className="a-field">
            <label htmlFor="s-desc">
              Deskripsi
              <span className="a-count">
                {form.description.length}/{KIND[modal.kind].max}
              </span>
            </label>
            <textarea
              id="s-desc"
              className="a-input a-ta"
              rows={3}
              maxLength={KIND[modal.kind].max}
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value.slice(0, KIND[modal.kind].max),
                })
              }
            />
          </div>
          <HugeiconPicker
            value={form.icon}
            onChange={(key) => setForm({ ...form, icon: key })}
            label="Ikon"
          />
          <div className="a-field">
            <label htmlFor="s-alt">
              Teks alternatif ikon <span className="a-opt">Opsional</span>
            </label>
            <input
              id="s-alt"
              className="a-input"
              type="text"
              value={form.iconAlt}
              onChange={(e) => setForm({ ...form, iconAlt: e.target.value })}
            />
            <p className="a-hint">
              Dibaca oleh pembaca layar. Kosongkan untuk memakai nama.
            </p>
          </div>
        </Modal>
      )}

      {confirmDelete && (
        <ConfirmDialog
          title={`Hapus ${KIND[confirmDelete.kind].noun}?`}
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
