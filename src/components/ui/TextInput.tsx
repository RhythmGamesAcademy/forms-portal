"use client";

import React from "react";

interface TextInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  type?: "text" | "number";
  min?: number;
  max?: number;
  disabled?: boolean;
}

export default function TextInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  maxLength,
  type = "text",
  min,
  max,
  disabled = false,
}: TextInputProps) {
  const charCount = value.length;
  const isOverLimit = maxLength ? charCount > maxLength : false;

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
      <input
        id={id}
        type={type}
        className={`form-input ${isOverLimit ? "has-error" : ""}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        min={min}
        max={max}
        autoComplete="off"
      />
      {maxLength && (
        <div className={`char-counter ${isOverLimit ? "over-limit" : ""}`}>
          {charCount} / {maxLength}
        </div>
      )}
    </div>
  );
}
