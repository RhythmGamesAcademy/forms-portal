"use client";

import React from "react";
import { useLocale } from "@/lib/i18n";

interface SelectInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export default function SelectInput({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  required = false,
  disabled = false,
}: SelectInputProps) {
  const { t } = useLocale();
  return (
    <div className="animate-fade-in">
      <label htmlFor={id} className="form-label">
        {label}
        {required ? (
          <span className="badge-required">{t("必須")}</span>
        ) : (
          <span className="badge-optional">{t("任意")}</span>
        )}
      </label>
      <select
        id={id}
        className="form-input form-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-required={required}
      >
        <option value="" disabled>
          {placeholder ?? t("選択してください")}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {t(opt)}
          </option>
        ))}
      </select>
    </div>
  );
}