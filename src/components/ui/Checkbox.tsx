"use client";

import React from "react";

interface CheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
}

export default function Checkbox({
  id,
  checked,
  onChange,
  children,
}: CheckboxProps) {
  return (
    <label htmlFor={id} className="custom-checkbox">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="checkmark" />
      <span className="label-text">{children}</span>
    </label>
  );
}
