"use client";

import React, { useState, useRef } from "react";
import TextInput from "./ui/TextInput";
import TextArea from "./ui/TextArea";
import SelectInput from "./ui/SelectInput";
import ListInput from "./ui/ListInput";
import Checkbox from "./ui/Checkbox";
import PolicyModal from "./ui/PolicyModal";
import InstructorPngTemplate from "./png/InstructorPngTemplate";
import {
  type InstructorFormData,
  createEmptyInstructorForm,
  DEPARTMENTS,
  DEPARTMENT_CATEGORIES,
} from "@/lib/types";
import { CHAR_LIMITS, PLACEHOLDERS } from "@/lib/constants";
import { generatePng, formatDateForFilename } from "@/lib/generatePng";

export default function InstructorForm() {
  const [formData, setFormData] = useState<InstructorFormData>(createEmptyInstructorForm());
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isLecturerModalOpen, setIsLecturerModalOpen] = useState(false);
  const templateRef = useRef<HTMLDivElement>(null);

  // Field change helpers
  const updateField = <K extends keyof InstructorFormData>(key: K, value: InstructorFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
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
      age.trim() !== "" &&
      discordId.trim() !== "" &&
      field.trim() !== "" &&
      department !== "" &&
      courseCategory !== "" &&
      fieldReason.trim() !== "" &&
      fieldReason.length <= CHAR_LIMITS.textDefault &&
      selfAppeal.trim() !== "" &&
      selfAppeal.length <= CHAR_LIMITS.selfAppeal;

    const hasValidAchievements =
      achievements.length > 0 && achievements.some((a) => a.trim() !== "");

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
      const filename = `講師登録申請書_${formData.name.trim() || "無題"}_${formatDateForFilename()}.png`;
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
        {/* Name & Age */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            id="instructor-name"
            label="講師名"
            value={formData.name}
            onChange={(val) => updateField("name", val)}
            placeholder={PLACEHOLDERS.instructor.name}
            required
            maxLength={50}
          />
          <TextInput
            id="instructor-age"
            label="年齢"
            value={formData.age}
            onChange={(val) => updateField("age", val)}
            placeholder={PLACEHOLDERS.instructor.age}
            required
            maxLength={10}
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
            maxLength={50}
          />
          <TextInput
            id="instructor-x"
            label="X ID"
            value={formData.xId}
            onChange={(val) => updateField("xId", val)}
            placeholder={PLACEHOLDERS.instructor.xId}
            maxLength={50}
          />
        </div>

        {/* Field */}
        <TextInput
          id="instructor-field"
          label="担当分野"
          value={formData.field}
          onChange={(val) => updateField("field", val)}
          placeholder={PLACEHOLDERS.instructor.field}
          required
          maxLength={100}
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
          maxLength={CHAR_LIMITS.textDefault}
        />

        {/* Achievements */}
        <ListInput
          id="instructor-achievements"
          label="実績"
          items={formData.achievements}
          onChange={(items) => updateField("achievements", items)}
          placeholder={PLACEHOLDERS.instructor.achievement}
          required
          maxLength={100}
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

        <hr className="section-divider" />

        {/* Confirmations */}
        <div className="space-y-2">
          <Checkbox
            id="confirm-falsehood-inst"
            checked={formData.confirmNoFalsehood}
            onChange={(val) => updateField("confirmNoFalsehood", val)}
          >
            申請内容に虚偽はありません
          </Checkbox>
          <Checkbox
            id="confirm-privacy-inst"
            checked={formData.confirmPrivacyPolicy}
            onChange={(val) => {
              if (val) setIsPrivacyModalOpen(true);
              else updateField("confirmPrivacyPolicy", false);
            }}
          >
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); setIsPrivacyModalOpen(true); }} 
              className="text-pink-400 hover:text-pink-300 underline"
            >
              プライバシーポリシー
            </a>
            に同意します
          </Checkbox>
          <Checkbox
            id="confirm-regulations-inst"
            checked={formData.confirmRegulations}
            onChange={(val) => {
              if (val) setIsLecturerModalOpen(true);
              else updateField("confirmRegulations", false);
            }}
          >
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); setIsLecturerModalOpen(true); }} 
              className="text-pink-400 hover:text-pink-300 underline"
            >
              講師規約
            </a>
            に同意し、遵守することを誓います
          </Checkbox>
        </div>

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

      <PolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        onAgree={() => {
          updateField("confirmPrivacyPolicy", true);
          setIsPrivacyModalOpen(false);
        }}
        markdownPath="/privacy-policy.md"
        title="プライバシーポリシー"
      />
      <PolicyModal
        isOpen={isLecturerModalOpen}
        onClose={() => setIsLecturerModalOpen(false)}
        onAgree={() => {
          updateField("confirmRegulations", true);
          setIsLecturerModalOpen(false);
        }}
        markdownPath="/lecturer-policy.md"
        title="講師規約"
      />
    </div>
  );
}
