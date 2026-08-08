"use client";

import React, { useState, useRef } from "react";
import TextInput from "./ui/TextInput";
import TextArea from "./ui/TextArea";
import SelectInput from "./ui/SelectInput";
import ListInput from "./ui/ListInput";
import Checkbox from "./ui/Checkbox";
import PolicyModal from "./ui/PolicyModal";
import CoursePngTemplate from "./png/CoursePngTemplate";
import {
  type CourseFormData,
  createEmptyCourseForm,
  DEPARTMENTS,
  DEPARTMENT_CATEGORIES,
  calculateCredits,
} from "@/lib/types";
import { CHAR_LIMITS, PLACEHOLDERS, SESSION_MIN, SESSION_MAX } from "@/lib/constants";
import { generatePng, formatDateForFilename } from "@/lib/generatePng";

export default function CourseForm() {
  const [formData, setFormData] = useState<CourseFormData>(createEmptyCourseForm());
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isLecturerModalOpen, setIsLecturerModalOpen] = useState(false);
  const templateRef = useRef<HTMLDivElement>(null);

  // Field change helper
  const updateField = <K extends keyof CourseFormData>(key: K, value: CourseFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Handle department change with cascading reset of courseCategory
  const handleDepartmentChange = (dept: string) => {
    setFormData((prev) => ({
      ...prev,
      department: dept as CourseFormData["department"],
      courseCategory: "",
    }));
  };

  // Handle session count change
  const handleSessionChange = (valStr: string) => {
    if (valStr === "") {
      updateField("sessionCount", "");
      return;
    }
    const num = parseInt(valStr, 10);
    if (!isNaN(num)) {
      updateField("sessionCount", num);
    }
  };

  // Session count validation & auto credit calculation
  const sessionCountNum = typeof formData.sessionCount === "number" ? formData.sessionCount : 0;
  const isSessionValid = sessionCountNum >= SESSION_MIN && sessionCountNum <= SESSION_MAX;
  const credits = calculateCredits(sessionCountNum);

  // Validation: check if form is valid and generation button should be enabled
  const isFormValid = React.useMemo(() => {
    const {
      subjectName,
      instructorName,
      department,
      courseCategory,
      overview,
      goals,
      approach,
      references,
      confirmNoFalsehood,
      confirmPrivacyPolicy,
      confirmRegulations,
    } = formData;

    const hasRequiredFields =
      subjectName.trim() !== "" &&
      instructorName.trim() !== "" &&
      department !== "" &&
      courseCategory !== "" &&
      isSessionValid &&
      overview.trim() !== "" &&
      overview.length <= CHAR_LIMITS.overview &&
      approach.trim() !== "" &&
      approach.length <= CHAR_LIMITS.approach &&
      (references === "" || references.length <= CHAR_LIMITS.reference);

    const hasValidGoals =
      goals.length > 0 && goals.some((g) => g.trim() !== "");

    return (
      hasRequiredFields &&
      hasValidGoals &&
      confirmNoFalsehood &&
      confirmPrivacyPolicy &&
      confirmRegulations
    );
  }, [formData, isSessionValid]);

  // Handle PNG generation
  const handleGenerate = async () => {
    if (!isFormValid || !templateRef.current || isGenerating) return;

    try {
      setIsGenerating(true);
      const filename = `講義開講申請書_${formData.subjectName.trim() || "無題"}_${formatDateForFilename()}.png`;
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
        {/* Subject Name & Instructor Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            id="course-subject"
            label="科目名"
            value={formData.subjectName}
            onChange={(val) => updateField("subjectName", val)}
            placeholder={PLACEHOLDERS.course.subjectName}
            required
            maxLength={CHAR_LIMITS.subjectName}
          />
          <TextInput
            id="course-instructor"
            label="担当講師"
            value={formData.instructorName}
            onChange={(val) => updateField("instructorName", val)}
            placeholder={PLACEHOLDERS.course.instructorName}
            required
            maxLength={CHAR_LIMITS.instructorName}
          />
        </div>

        {/* Department & Course Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectInput
            id="course-department"
            label="対象学部"
            value={formData.department}
            onChange={handleDepartmentChange}
            options={DEPARTMENTS}
            required
          />
          <SelectInput
            id="course-category"
            label="講義区分"
            value={formData.courseCategory}
            onChange={(val) => updateField("courseCategory", val)}
            options={availableCategories}
            placeholder={
              formData.department ? "選択してください" : "先に対象学部を選択してください"
            }
            required
            disabled={!formData.department}
          />
        </div>

        {/* Session Count & Credits (auto calculated) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <div>
            <TextInput
              id="course-sessions"
              label="講義回数 (3〜15回)"
              type="number"
              value={formData.sessionCount === "" ? "" : String(formData.sessionCount)}
              onChange={handleSessionChange}
              placeholder={PLACEHOLDERS.course.sessionCount}
              required
              min={SESSION_MIN}
              max={SESSION_MAX}
            />
            {formData.sessionCount !== "" && !isSessionValid && (
              <p className="text-xs text-red-400 mt-1">
                講義回数は {SESSION_MIN}〜{SESSION_MAX} 回の範囲で入力してください
              </p>
            )}
          </div>
          <div>
            <label className="form-label">
              単位数
              <span className="badge-optional" style={{ backgroundColor: "rgba(52, 211, 153, 0.15)", color: "#34d399" }}>
                自動算出
              </span>
            </label>
            <div className="auto-value">
              {isSessionValid ? `${credits} 単位` : "- 単位"}
              <span className="text-xs text-[var(--color-text-muted)] font-normal ml-2">
                (3〜5回:1 / 6〜10回:2 / 11〜15回:3)
              </span>
            </div>
          </div>
        </div>

        {/* Course Overview */}
        <TextArea
          id="course-overview"
          label="講義概要"
          value={formData.overview}
          onChange={(val) => updateField("overview", val)}
          placeholder={PLACEHOLDERS.course.overview}
          required
          maxLength={CHAR_LIMITS.overview}
        />

        {/* Goals */}
        <ListInput
          id="course-goals"
          label="受講者の到達目標"
          items={formData.goals}
          onChange={(items) => updateField("goals", items)}
          placeholder={PLACEHOLDERS.course.goal}
          required
          maxLength={CHAR_LIMITS.goal}
        />

        {/* Approach / Policy */}
        <TextArea
          id="course-approach"
          label="講義の進め方・方針"
          value={formData.approach}
          onChange={(val) => updateField("approach", val)}
          placeholder={PLACEHOLDERS.course.approach}
          required
          maxLength={CHAR_LIMITS.approach}
        />

        {/* References (optional) */}
        <TextArea
          id="course-references"
          label="参考文献など"
          value={formData.references}
          onChange={(val) => updateField("references", val)}
          placeholder={PLACEHOLDERS.course.references}
          maxLength={CHAR_LIMITS.reference}
        />

        <hr className="section-divider" />

        {/* Confirmations */}
        <div className="space-y-2">
          <Checkbox
            id="confirm-falsehood-course"
            checked={formData.confirmNoFalsehood}
            onChange={(val) => updateField("confirmNoFalsehood", val)}
          >
            申請内容に虚偽はありません
          </Checkbox>
          <Checkbox
            id="confirm-privacy-course"
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
            id="confirm-regulations-course"
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
      <CoursePngTemplate ref={templateRef} data={formData} />

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
