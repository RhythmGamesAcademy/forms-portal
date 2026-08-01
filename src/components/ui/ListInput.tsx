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
        {items.map((item, index) => (
          <div
            key={`${id}-item-${index}`}
            className="animate-slide-down"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
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
              className="form-input"
              value={item}
              onChange={(e) => handleItemChange(index, e.target.value)}
              placeholder={placeholder}
              maxLength={maxLength}
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
        ))}
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
