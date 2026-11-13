"use client";

import { useState, type FormEvent } from "react";
import {
  Call02Icon,
  Facebook01Icon,
  InstagramIcon,
  Location01Icon,
  WhatsappIcon,
} from "@hugeicons/core-free-icons";
import { ContactData } from "@/types/content";
import Toast, { ToastType } from "./Toast";
import PageHeader from "./PageHeader";
import SectionHead from "./SectionHead";
import SaveBar from "./SaveBar";
import Ico from "./Ico";

interface KontakTabProps {
  data: ContactData;
  onSave: (data: ContactData) => Promise<void>;
}

export default function KontakTab({ data, onSave }: KontakTabProps) {
  const initial = {
    whatsappUrl: data.whatsappUrl,
    phone: data.phone,
    address: data.address,
    instagram: data.socialMedia.instagram ?? "",
    facebook: data.socialMedia.facebook ?? "",
  };
  const [form, setForm] = useState(initial);
  const [baseline, setBaseline] = useState(JSON.stringify(initial));
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const dirty = JSON.stringify(form) !== baseline;

  function set<K extends keyof typeof initial>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const clean = {
        whatsappUrl: form.whatsappUrl.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        instagram: form.instagram.trim(),
        facebook: form.facebook.trim(),
      };
      await onSave({
        ...data,
        whatsappUrl: clean.whatsappUrl,
        phone: clean.phone,
        address: clean.address,
        socialMedia: { instagram: clean.instagram, facebook: clean.facebook },
      });
      setForm(clean);
      setBaseline(JSON.stringify(clean));
      setToast({ message: "Kontak disimpan.", type: "success" });
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : "Gagal menyimpan data.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PageHeader
        title="Kontak & media sosial"
        description="Bagian paling bawah beranda, juga dipakai di footer dan tombol WhatsApp."
      />

      <section className="a-card">
        <SectionHead
          icon={Call02Icon}
          title="Kontak & media sosial"
          description="Dipakai di footer, tombol WhatsApp, dan data bisnis untuk mesin pencari."
        />
        <div className="a-row2">
          <div className="a-field">
            <label htmlFor="k-wa">Tautan WhatsApp</label>
            <div className="a-has-ic">
              <Ico icon={WhatsappIcon} />
              <input
                id="k-wa"
                className="a-input"
                type="text"
                value={form.whatsappUrl}
                onChange={(e) => set("whatsappUrl", e.target.value)}
              />
            </div>
          </div>
          <div className="a-field">
            <label htmlFor="k-tel">Telepon</label>
            <div className="a-has-ic">
              <Ico icon={Call02Icon} />
              <input
                id="k-tel"
                className="a-input"
                type="text"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="a-field">
          <label htmlFor="k-addr">Alamat</label>
          <div className="a-has-ic a-ta">
            <Ico icon={Location01Icon} />
            <textarea
              id="k-addr"
              className="a-input"
              rows={2}
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
            />
          </div>
        </div>
        <div className="a-row2">
          <div className="a-field">
            <label htmlFor="k-ig">Instagram</label>
            <div className="a-has-ic">
              <Ico icon={InstagramIcon} />
              <input
                id="k-ig"
                className="a-input"
                type="text"
                value={form.instagram}
                onChange={(e) => set("instagram", e.target.value)}
              />
            </div>
          </div>
          <div className="a-field">
            <label htmlFor="k-fb">Facebook</label>
            <div className="a-has-ic">
              <Ico icon={Facebook01Icon} />
              <input
                id="k-fb"
                className="a-input"
                type="text"
                value={form.facebook}
                onChange={(e) => set("facebook", e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      <SaveBar dirty={dirty} saving={saving} />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </form>
  );
}
