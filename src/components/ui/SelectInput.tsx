"use client";

import React from "react";

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
  placeholder = "選択してください",
  required = false,
  disabled = false,
}: SelectInputProps) {
  return (
    <div className="animate-fade-in">
      <label htmlFor={id} className="form-label">
        {label}
        {required ? (
          <span className="badge-required">必須</span>
        ) : (
          <span className="badge-optional">任意</span>
        )}
      </label>
      <select
        id={id}
        className="form-input form-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
