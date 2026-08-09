"use client";

import React from "react";
import Checkbox from "./Checkbox";
import PolicyModal from "./PolicyModal";

type PolicyItem = {
  modalId: string;
  checkboxId: string;
  checked: boolean;
  markdownPath: string;
  title: string;
  label: React.ReactNode;
  field: string;
};

type AgreementSectionProps = {
  confirmNoFalsehood: boolean;
  onFalsehoodChange: (val: boolean) => void;
  falsehoodCheckboxId: string;
  policies: PolicyItem[];
  activeModalId: string | null;
  onModalClose: () => void;
  onModalAgree: (field: string) => void;
  onCheckboxChange: (field: string, val: boolean, modalId: string) => void;
  onOpenModal: (modalId: string) => void;
};

export default function AgreementSection({
  confirmNoFalsehood,
  onFalsehoodChange,
  falsehoodCheckboxId,
  policies,
  activeModalId,
  onModalClose,
  onModalAgree,
  onCheckboxChange,
  onOpenModal,
}: AgreementSectionProps) {
  return (
    <>
      <div className="space-y-2">
        <Checkbox
          id={falsehoodCheckboxId}
          checked={confirmNoFalsehood}
          onChange={onFalsehoodChange}
        >
          申請内容に虚偽はありません
        </Checkbox>

        {policies.map((policy) => (
          <Checkbox
            key={policy.modalId}
            id={policy.checkboxId}
            checked={policy.checked}
            onChange={(val) =>
              onCheckboxChange(policy.field, val, policy.modalId)
            }
          >
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onOpenModal(policy.modalId);
              }}
              className="text-[var(--color-accent-pink)] hover:text-[var(--color-accent-lavender)] underline"
            >
              {policy.title}
            </a>
            {policy.label}
          </Checkbox>
        ))}
      </div>

      {policies.map((policy) => (
        <PolicyModal
          key={policy.modalId}
          isOpen={activeModalId === policy.modalId}
          onClose={onModalClose}
          onAgree={() => onModalAgree(policy.field)}
          markdownPath={policy.markdownPath}
          title={policy.title}
        />
      ))}
    </>
  );
}
