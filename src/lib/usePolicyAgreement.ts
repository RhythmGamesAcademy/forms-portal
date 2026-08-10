"use client";

import { useState } from "react";
import type { AgreementField } from "./types";

type PolicyAgreementOptions = {
  onAgree: (field: AgreementField, value: boolean) => void;
};

type PolicyModalConfig = {
  field: AgreementField;
  markdownPath: string;
  title: string;
};

export type PolicyAgreementReturn = {
  openModal: (modalId: string) => void;
  closeModal: () => void;
  activeModalId: string | null;
  handleCheckboxChange: (
    field: AgreementField,
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
    field: AgreementField,
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
