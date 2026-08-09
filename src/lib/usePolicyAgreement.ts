"use client";

import { useState } from "react";

type PolicyAgreementOptions = {
  onAgree: (field: string, value: boolean) => void;
};

type PolicyModalConfig = {
  field: string;
  markdownPath: string;
  title: string;
};

export type PolicyAgreementReturn = {
  openModal: (modalId: string) => void;
  closeModal: () => void;
  activeModalId: string | null;
  handleCheckboxChange: (
    field: string,
    val: boolean,
    modalId: string
  ) => void;
};

export function usePolicyAgreement({
  onAgree,
}: PolicyAgreementOptions): PolicyAgreementReturn {
  const [activeModalId, setActiveModalId] = useState<string | null>(null);

  const openModal = (modalId: string) => {
    setActiveModalId(modalId);
  };

  const closeModal = () => {
    setActiveModalId(null);
  };

  const handleCheckboxChange = (
    field: string,
    val: boolean,
    modalId: string
  ) => {
    if (val) {
      openModal(modalId);
    } else {
      onAgree(field, false);
    }
  };

  return {
    openModal,
    closeModal,
    activeModalId,
    handleCheckboxChange,
  };
}

export type { PolicyModalConfig };
