"use client";

import React from "react";

interface ListInputProps {
  id: string;
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  required?: boolean;
  /** 1項目あたりの最大文字数 */
  maxLength?: number;
  /** 追加できる項目数の上限。項目ごとに異なるため呼び出し側で指定する。 */
  maxItems: number;
}

export default function ListInput({
  id,
  label,
  items,
  onChange,
  placeholder,
  required = false,
  maxLength,
  maxItems,
}: ListInputProps) {
  const canAdd = items.length < maxItems;
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
    <fieldset className="list-fieldset animate-fade-in">
      <legend className="form-legend">
        {label}
        {required ? (
          <span className="badge-required">必須</span>
        ) : (
          <span className="badge-optional">任意</span>
        )}
      </legend>

      <div className="list-items">
        {items.map((item, index) => {
          const charCount = item.length;
          // 上限ちょうど (30/30) は有効。超過 (31/30) からエラー表示。
          // maxLength 属性で通常は超過しないが、ペースト・IME・プログラム的変更の
          // 抜け道が残るため、検知とバリデーションは残す。
          const isOverLimit = maxLength ? charCount > maxLength : false;
          const isAtLimit = maxLength ? charCount === maxLength : false;

          return (
            <div key={`${id}-item-${index}`} className="animate-slide-down">
              <div className="list-row">
                <span className="list-index">{index + 1}</span>
                <input
                  id={`${id}-${index}`}
                  type="text"
                  className={`form-input ${isOverLimit ? "has-error" : ""}`}
                  value={item}
                  onChange={(e) => handleItemChange(index, e.target.value)}
                  onFocus={() => setFocusedIndex(index)}
                  onBlur={() => setFocusedIndex(null)}
                  placeholder={placeholder}
                  maxLength={maxLength}
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
                  <div
                    id={`${id}-${index}-error`}
                    className={`text-xs ${isOverLimit ? "text-[var(--color-error)]" : "text-[var(--color-text-muted)]"}`}
                    aria-live="polite"
                  >
                    {isOverLimit
                      ? `${charCount - maxLength}文字超過しています`
                      : isAtLimit && "上限に達しました"}
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

      <button
        type="button"
        className="btn-secondary list-add"
        onClick={handleAdd}
        disabled={!canAdd}
      >
        + 項目を追加
        <span className="list-add-count">
          ({items.length}/{maxItems})
        </span>
      </button>
    </fieldset>
  );
}
