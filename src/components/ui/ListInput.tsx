"use client";

import React from "react";
import { MAX_LIST_ITEMS } from "@/lib/constants";

interface ListInputProps {
  id: string;
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
}

export default function ListInput({
  id,
  label,
  items,
  onChange,
  placeholder,
  required = false,
  maxLength,
}: ListInputProps) {
  const canAdd = items.length < MAX_LIST_ITEMS;
  const [focusedIndex, setFocusedIndex] = React.useState<number | null>(null);

  const handleItemChange = (index: number, value: string) => {
    const updated = [...items];
    updated[index] = value;
    onChange(updated);
  };

  const handleAdd = () => {
    if (canAdd) {
      onChange([...items, ""]);
    }
  };

  const handleRemove = (index: number) => {
    if (items.length > 1) {
      const updated = items.filter((_, i) => i !== index);
      onChange(updated);
    }
  };

  return (
    <div className="animate-fade-in">
      <label className="form-label">
        {label}
        {required ? (
          <span className="badge-required">必須</span>
        ) : (
          <span className="badge-optional">任意</span>
        )}
      </label>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {items.map((item, index) => {
          const charCount = item.length;
          // 上限ちょうど (30/30) は有効。超過 (31/30) からエラー表示。
          const isOverLimit = maxLength ? charCount > maxLength : false;

          return (
            <div key={`${id}-item-${index}`} className="animate-slide-down">
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span
                  style={{
                    flexShrink: 0,
                    width: "1.5rem",
                    textAlign: "center",
                    fontSize: "0.75rem",
                    color: "var(--color-text-muted)",
                    fontWeight: 600,
                  }}
                >
                  {index + 1}
                </span>
                <input
                  id={`${id}-${index}`}
                  type="text"
                  className={`form-input ${isOverLimit ? "has-error" : ""}`}
                  value={item}
                  onChange={(e) => handleItemChange(index, e.target.value)}
                  onFocus={() => setFocusedIndex(index)}
                  onBlur={() => setFocusedIndex(null)}
                  placeholder={placeholder}
                  aria-invalid={isOverLimit}
                  aria-describedby={maxLength ? `${id}-${index}-counter ${id}-${index}-error` : undefined}
                  autoComplete="off"
                />
                {items.length > 1 && (
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => handleRemove(index)}
                    aria-label={`${index + 1}番目を削除`}
                  >
                    x
                  </button>
                )}
              </div>
              {maxLength && (focusedIndex === index || isOverLimit) && (
                <div className="flex justify-between items-center mt-1 pl-8 pr-12">
                  <div id={`${id}-${index}-error`} className="text-xs text-[var(--color-error)]" role="alert">
                    {isOverLimit && `${charCount - maxLength}文字超過しています`}
                  </div>
                  <div id={`${id}-${index}-counter`} className={`char-counter !mt-0 ${isOverLimit ? "over-limit" : ""}`}>
                    {charCount} / {maxLength}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: "0.5rem" }}>
        <button
          type="button"
          className="btn-secondary"
          onClick={handleAdd}
          disabled={!canAdd}
          style={{ width: "100%" }}
        >
          + 項目を追加
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--color-text-muted)",
              marginLeft: "0.25rem",
            }}
          >
            ({items.length}/{MAX_LIST_ITEMS})
          </span>
        </button>
      </div>
    </div>
  );
}
