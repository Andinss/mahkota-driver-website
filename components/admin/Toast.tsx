"use client";

import { useEffect, useRef } from "react";
import {
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import Ico from "./Ico";

export type ToastType = "success" | "error";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type,
  onClose,
  duration = 3000,
}: ToastProps) {
  // Simpan onClose di ref supaya timer tidak diulang tiap parent render ulang.
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    const timer = setTimeout(() => closeRef.current(), duration);
    return () => clearTimeout(timer);
  }, [message, duration]);

  return (
    <div
      className={`a-toast a-on ${type === "error" ? "a-bad" : ""}`.trim()}
      role="status"
      aria-live="polite"
    >
      <span className="a-t-ic">
        <Ico icon={type === "success" ? CheckmarkCircle02Icon : AlertCircleIcon} />
      </span>
      <span className="a-m">{message}</span>
      <button type="button" onClick={onClose} aria-label="Tutup notifikasi">
        <Ico icon={Cancel01Icon} />
      </button>
    </div>
  );
}
