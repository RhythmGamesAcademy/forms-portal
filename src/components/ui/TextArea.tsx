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
  // 上限ちょうど (30/30) は有効。超過 (31/30) からエラー表示。
  // maxLength 属性で通常は超過しないが、ペースト・IME・プログラム的変更の
  // 抜け道が残るため、検知とバリデーションは残す。
  const isOverLimit = charCount > maxLength;
  const isAtLimit = charCount === maxLength;

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
        maxLength={maxLength}
        aria-required={required}
        aria-invalid={isOverLimit}
        aria-describedby={`${id}-counter ${id}-error`}
        autoComplete="off"
      />
      <div className="flex justify-between items-center mt-1">
        <div
          id={`${id}-error`}
          className={`text-xs ${isOverLimit ? "text-[var(--color-error)]" : "text-[var(--color-text-muted)]"}`}
          aria-live="polite"
        >
          {isOverLimit
            ? `${charCount - maxLength}文字超過しています`
            : isAtLimit && "上限に達しました"}
        </div>
        <div id={`${id}-counter`} className={`char-counter !mt-0 ${isOverLimit ? "over-limit" : ""}`}>
          {charCount} / {maxLength}
        </div>
      </div>
    </div>
  );
}
