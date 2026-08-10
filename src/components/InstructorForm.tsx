"use client";

import React, { useState, useRef } from "react";
import TextInput from "./ui/TextInput";
import TextArea from "./ui/TextArea";
import SelectInput from "./ui/SelectInput";
import ListInput from "./ui/ListInput";
import AgreementSection from "./ui/AgreementSection";
import SectionHeading from "./ui/SectionHeading";
import InstructorPngTemplate from "./png/InstructorPngTemplate";
import {
  type InstructorFormData,
  createEmptyInstructorForm,
  DEPARTMENTS,
  DEPARTMENT_CATEGORIES,
} from "@/lib/types";
import { CHAR_LIMITS, MAX_ACHIEVEMENT_ITEMS, PLACEHOLDERS } from "@/lib/constants";
import { generatePng, formatDateForFilename, sanitizeFilename } from "@/lib/generatePng";
import { usePolicyAgreement } from "@/lib/usePolicyAgreement";

export default function InstructorForm() {
  const [formData, setFormData] = useState<InstructorFormData>(createEmptyInstructorForm());
  const [isGenerating, setIsGenerating] = useState(false);
  const templateRef = useRef<HTMLDivElement>(null);

  const { activeModalId, openModal, closeModal, handleCheckboxChange } = usePolicyAgreement({
    onAgree: (field, value) => updateField(field, value),
  });

  // Field change helpers
  const updateField = <K extends keyof InstructorFormData>(key: K, value: InstructorFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Convert full-width numbers to half-width and keep only digits
  const handleAgeChange = (value: string) => {
    const halfWidth = value.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
    const digitsOnly = halfWidth.replace(/[^0-9]/g, "");
    updateField("age", digitsOnly);
  };

  // Handle department change with cascading reset of courseCategory
  const handleDepartmentChange = (dept: string) => {
    setFormData((prev) => ({
      ...prev,
      department: dept as InstructorFormData["department"],
      courseCategory: "",
    }));
  };

  // Validation: check if form is valid and generation button should be enabled
  const isFormValid = React.useMemo(() => {
    const {
      name,
      age,
      discordId,
      xId,
      field,
      department,
      courseCategory,
      fieldReason,
      achievements,
      selfAppeal,
      confirmNoFalsehood,
      confirmPrivacyPolicy,
      confirmRegulations,
    } = formData;

    const hasRequiredFields =
      name.trim() !== "" &&
      name.length <= CHAR_LIMITS.name &&
      age.trim() !== "" &&
      age.length <= CHAR_LIMITS.age &&
      discordId.trim() !== "" &&
      discordId.length <= CHAR_LIMITS.discordId &&
      (xId === "" || xId.length <= CHAR_LIMITS.xId) &&
      field.trim() !== "" &&
      field.length <= CHAR_LIMITS.field &&
      department !== "" &&
      courseCategory !== "" &&
      fieldReason.trim() !== "" &&
      fieldReason.length <= CHAR_LIMITS.fieldReason &&
      selfAppeal.trim() !== "" &&
      selfAppeal.length <= CHAR_LIMITS.selfAppeal;

    // 実績は任意。未入力でも可だが、入力された項目は文字数制限を満たすこと。
    const hasValidAchievements = achievements
      .filter((a) => a.trim() !== "")
      .every((a) => a.length <= CHAR_LIMITS.achievement);

    return (
      hasRequiredFields &&
      hasValidAchievements &&
      confirmNoFalsehood &&
      confirmPrivacyPolicy &&
      confirmRegulations
    );
  }, [formData]);

  // Handle PNG generation
  const handleGenerate = async () => {
    if (!isFormValid || !templateRef.current || isGenerating) return;

    try {
      setIsGenerating(true);
      const filename = `講師登録申請書_${sanitizeFilename(formData.name)}_${formatDateForFilename()}.png`;
      await generatePng(templateRef.current, filename);
    } catch (err) {
      console.error("PNG generation error:", err);
      alert("PNGの生成に失敗しました。もう一度お試しください。");
    } finally {
      setIsGenerating(false);
    }
  };

  const availableCategories = formData.department
    ? DEPARTMENT_CATEGORIES[formData.department]
    : [];

  return (
    <div>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <SectionHeading divider={false}>基本情報</SectionHeading>

        {/* Name & Age */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            id="instructor-name"
            label="講師名"
            value={formData.name}
            onChange={(val) => updateField("name", val)}
            placeholder={PLACEHOLDERS.instructor.name}
            required
            maxLength={CHAR_LIMITS.name}
          />
          <TextInput
            id="instructor-age"
            label="年齢"
            value={formData.age}
            onChange={handleAgeChange}
            placeholder={PLACEHOLDERS.instructor.age}
            required
            maxLength={CHAR_LIMITS.age}
            inputMode="numeric"
            pattern="[0-9]*"
          />
        </div>

        {/* Discord ID & X ID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            id="instructor-discord"
            label="Discord ID"
            value={formData.discordId}
            onChange={(val) => updateField("discordId", val)}
            placeholder={PLACEHOLDERS.instructor.discordId}
            required
            maxLength={CHAR_LIMITS.discordId}
          />
          <TextInput
            id="instructor-x"
            label="X ID"
            value={formData.xId}
            onChange={(val) => updateField("xId", val)}
            placeholder={PLACEHOLDERS.instructor.xId}
            maxLength={CHAR_LIMITS.xId}
          />
        </div>

        <SectionHeading>担当領域</SectionHeading>

        {/* Field */}
        <TextInput
          id="instructor-field"
          label="担当分野"
          value={formData.field}
          onChange={(val) => updateField("field", val)}
          placeholder={PLACEHOLDERS.instructor.field}
          required
          maxLength={CHAR_LIMITS.field}
        />

        {/* Department & Course Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectInput
            id="instructor-department"
            label="担当学部"
            value={formData.department}
            onChange={handleDepartmentChange}
            options={DEPARTMENTS}
            required
          />
          <SelectInput
            id="instructor-category"
            label="講義区分"
            value={formData.courseCategory}
            onChange={(val) => updateField("courseCategory", val)}
            options={availableCategories}
            placeholder={
              formData.department ? "選択してください" : "先に担当学部を選択してください"
            }
            required
            disabled={!formData.department}
          />
        </div>

        {/* Reason for Field */}
        <TextArea
          id="instructor-reason"
          label="担当分野の選定理由"
          value={formData.fieldReason}
          onChange={(val) => updateField("fieldReason", val)}
          placeholder={PLACEHOLDERS.instructor.fieldReason}
          required
          maxLength={CHAR_LIMITS.fieldReason}
        />

        <SectionHeading>実績・自己PR</SectionHeading>

        {/* Achievements */}
        <ListInput
          id="instructor-achievements"
          label="実績"
          items={formData.achievements}
          onChange={(items) => updateField("achievements", items)}
          placeholder={PLACEHOLDERS.instructor.achievement}
          maxLength={CHAR_LIMITS.achievement}
          maxItems={MAX_ACHIEVEMENT_ITEMS}
        />

        {/* Self Appeal */}
        <TextArea
          id="instructor-appeal"
          label="自己アピール"
          value={formData.selfAppeal}
          onChange={(val) => updateField("selfAppeal", val)}
          placeholder={PLACEHOLDERS.instructor.selfAppeal}
          required
          maxLength={CHAR_LIMITS.selfAppeal}
        />

        <SectionHeading>確認・同意</SectionHeading>

        <AgreementSection
          confirmNoFalsehood={formData.confirmNoFalsehood}
          onFalsehoodChange={(val) => updateField("confirmNoFalsehood", val)}
          falsehoodCheckboxId="confirm-falsehood-inst"
          policies={[
            {
              modalId: "privacy",
              checkboxId: "confirm-privacy-inst",
              checked: formData.confirmPrivacyPolicy,
              markdownPath: "/privacy-policy.md",
              title: "プライバシーポリシー",
              label: "に同意します",
              field: "confirmPrivacyPolicy",
            },
            {
              modalId: "lecturer",
              checkboxId: "confirm-regulations-inst",
              checked: formData.confirmRegulations,
              markdownPath: "/lecturer-policy.md",
              title: "講師ガイドライン",
              label: "に同意し、遵守することを誓います",
              field: "confirmRegulations",
            },
          ]}
          activeModalId={activeModalId}
          onModalClose={closeModal}
          onModalAgree={(field) => {
            updateField(field, true);
            closeModal();
          }}
          onCheckboxChange={handleCheckboxChange}
          onOpenModal={openModal}
        />

        {/* Generate Button */}
        <div className="pt-2">
          <button
            type="button"
            className="btn-primary"
            disabled={!isFormValid || isGenerating}
            onClick={handleGenerate}
          >
            {isGenerating ? (
              <>
                <span className="spinner" />
                <span>PNG生成中...</span>
              </>
            ) : (
              <span>申請書PNGをダウンロード</span>
            )}
          </button>
        </div>
      </form>

      {/* Hidden DOM element for PNG rendering */}
      <InstructorPngTemplate ref={templateRef} data={formData} />
    </div>
  );
}
