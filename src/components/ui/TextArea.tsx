"use client";

import React, { useRef, useEffect } from "react";

interface TextAreaProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  maxLength: number;
  disabled?: boolean;
}

export default function TextArea({
  id,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  maxLength,
  disabled = false,
}: TextAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const charCount = value.length;
  const isOverLimit = charCount > maxLength;

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.max(el.scrollHeight, 80)}px`;
    }
  }, [value]);

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
      <textarea
        ref={textareaRef}
        id={id}
        className={`form-input form-textarea ${isOverLimit ? "has-error" : ""}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        aria-required={required}
        autoComplete="off"
      />
      <div className={`char-counter ${isOverLimit ? "over-limit" : ""}`} role={isOverLimit ? "alert" : undefined}>
        {charCount} / {maxLength}
      </div>
    </div>
  );
}
