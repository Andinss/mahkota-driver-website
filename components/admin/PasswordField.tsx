"use client";

import { useState } from "react";
import { LockIcon, ViewIcon, ViewOffIcon } from "@hugeicons/core-free-icons";
import Ico from "./Ico";

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  disabled?: boolean;
  required?: boolean;
  hint?: string;
}

/** Input password dengan tombol tampilkan/sembunyikan. */
export default function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  disabled,
  required,
  hint,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="a-field">
      <label htmlFor={id}>{label}</label>
      <div className="a-has-ic a-has-eye">
        <Ico icon={LockIcon} />
        <input
          id={id}
          className="a-input"
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          required={required}
        />
        <button
          type="button"
          className="a-eye"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Sembunyikan password" : "Tampilkan password"}
          aria-pressed={visible}
        >
          <Ico icon={visible ? ViewOffIcon : ViewIcon} />
        </button>
      </div>
      {hint && <p className="a-hint">{hint}</p>}
    </div>
  );
}
