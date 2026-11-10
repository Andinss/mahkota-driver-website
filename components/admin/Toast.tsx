"use client";

import { useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";

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
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColor = type === "success" ? "bg-green-600" : "bg-red-600";
  const icon = type === "success" ? CheckmarkCircle02Icon : AlertCircleIcon;

  return (
    <div className="fixed top-4 right-4 z-[100] animate-slide-in">
      <div
        className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[280px] max-w-md`}
      >
        <span className="ms text-[20px] shrink-0">
          <HugeiconsIcon icon={icon} size="1em" />
        </span>
        <span className="text-sm font-medium flex-1">{message}</span>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 p-1 hover:bg-white/20 rounded transition-colors"
          aria-label="Tutup notifikasi"
        >
          <span className="ms text-[16px]">
            <HugeiconsIcon icon={Cancel01Icon} size="1em" />
          </span>
        </button>
      </div>
    </div>
  );
}
