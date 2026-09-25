"use client";

import React, { useState, useRef } from "react";
import { flushSync } from "react-dom";
import TextInput from "./ui/TextInput";
import TextArea from "./ui/TextArea";
import SelectInput from "./ui/SelectInput";
import ListInput from "./ui/ListInput";
import AgreementSection from "./ui/AgreementSection";
import SectionHeading from "./ui/SectionHeading";
import DraftActions, { type DraftNotice } from "./ui/DraftActions";
import CoursePngTemplate from "./png/CoursePngTemplate";
import {
  type CourseFormData,
  createEmptyCourseForm,
  DEPARTMENTS,
  DEPARTMENT_CATEGORIES,
  COURSE_OFFERING_TYPES,
  calculateCredits,
} from "@/lib/types";
import {
  CHAR_LIMITS,
  MAX_GOAL_ITEMS,
  PLACEHOLDERS,
  SESSION_MIN,
  SESSION_MAX,
} from "@/lib/constants";
import { generatePng, formatDateForFilename, sanitizeFilename } from "@/lib/generatePng";
import {
  formatOfferingForPng,
  getAcademicTermNumber,
  getNextAcademicTermBoundary,
} from "@/lib/academicPeriod";
import {
  COURSE_DRAFT_KEY,
  createCourseDraft,
  parseCourseDraft,
} from "@/lib/formDrafts";
import {
  deleteLocalDraft,
  readLocalDraft,
  writeLocalDraft,
} from "@/lib/localDraft";
import { usePolicyAgreement } from "@/lib/usePolicyAgreement";

export default function CourseForm() {
  const [formData, setFormData] = useState<CourseFormData>(createEmptyCourseForm());
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTerm, setCurrentTerm] = useState<number | null>(null);
  const [draftNotice, setDraftNotice] = useState<DraftNotice | null>(null);
  const [pngSnapshot, setPngSnapshot] = useState<{
    generatedAt: Date;
    termNumber: number;
  } | null>(null);
  const templateRef = useRef<HTMLDivElement>(null);
  const hasUserEditedRef = useRef(false);

  React.useEffect(() => {
    if (hasUserEditedRef.current) return;

    const result = readLocalDraft(COURSE_DRAFT_KEY, "course", parseCourseDraft);

    if (result.status === "loaded") {
      setFormData({ ...createEmptyCourseForm(), ...result.data });
      setDraftNotice({
        kind: "info",
        message: "保存済みの下書きを復元しました。確認・同意項目は再度確認してください。",
      });
    } else if (result.status === "invalid") {
      setDraftNotice({
        kind: "error",
        message:
          "保存済みの下書きを読み込めませんでした。データが破損しているか、現在のフォーム形式と異なる可能性があります。下書きは削除せず残しています。",
      });
    } else if (result.status === "unavailable") {
      setDraftNotice({
        kind: "error",
        message: "ブラウザの保存領域を利用できないため、下書きを読み込めませんでした。",
      });
    }
  }, []);

  React.useEffect(() => {
    let timer: number | undefined;

    const refreshTerm = () => {
      const now = new Date();
      setCurrentTerm(getAcademicTermNumber(now));

      const nextBoundary = getNextAcademicTermBoundary(now);
      const untilBoundary = nextBoundary.getTime() - now.getTime();
      // Long waits are checked hourly so browser timer limits cannot skip a boundary.
      const delay = Math.min(Math.max(untilBoundary + 20, 20), 60 * 60 * 1000);
      timer = window.setTimeout(refreshTerm, delay);
    };

    const refreshWhenVisible = () => {
      if (!document.hidden) {
        if (timer !== undefined) window.clearTimeout(timer);
        refreshTerm();
      }
    };

    refreshTerm();
    window.addEventListener("focus", refreshWhenVisible);
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      if (timer !== undefined) window.clearTimeout(timer);
      window.removeEventListener("focus", refreshWhenVisible);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, []);

  const { activeModalId, openModal, closeModal, handleCheckboxChange } = usePolicyAgreement({
    onAgree: (field, value) => updateField(field, value),
  });

  // Field change helper
  const updateField = <K extends keyof CourseFormData>(key: K, value: CourseFormData[K]) => {
    hasUserEditedRef.current = true;
    setDraftNotice(null);
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Handle department change with cascading reset of courseCategory
  const handleDepartmentChange = (dept: string) => {
    hasUserEditedRef.current = true;
    setDraftNotice(null);
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
      offeringType,
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
      subjectName.length <= CHAR_LIMITS.subjectName &&
      instructorName.trim() !== "" &&
      instructorName.length <= CHAR_LIMITS.instructorName &&
      department !== "" &&
      courseCategory !== "" &&
      offeringType !== "" &&
      isSessionValid &&
      overview.trim() !== "" &&
      overview.length <= CHAR_LIMITS.overview &&
      approach.trim() !== "" &&
      approach.length <= CHAR_LIMITS.approach &&
      (references === "" || references.length <= CHAR_LIMITS.reference);

    const hasValidGoals =
      goals.length > 0 &&
      goals.some((g) => g.trim() !== "") &&
      goals.filter(g => g.trim() !== "").every((g) => g.length <= CHAR_LIMITS.goal);

    return (
      hasRequiredFields &&
      hasValidGoals &&
      confirmNoFalsehood &&
      confirmPrivacyPolicy &&
      confirmRegulations
    );
  }, [formData, isSessionValid]);

  const handleSaveDraft = () => {
    hasUserEditedRef.current = true;
    const draftData = createCourseDraft(formData);
    if (parseCourseDraft(draftData) === null) {
      setDraftNotice({
        kind: "error",
        message:
          "入力内容が下書きの保存可能な形式を超えています。入力内容を確認してください。既存の下書きは削除していません。",
      });
      return;
    }

    const saved = writeLocalDraft(
      COURSE_DRAFT_KEY,
      "course",
      draftData
    );

    setDraftNotice(
      saved
        ? {
            kind: "success",
            message: "下書きを保存しました。このブラウザに保存されています。",
          }
        : {
            kind: "error",
            message:
              "下書きを保存できませんでした。ブラウザの設定や保存容量をご確認ください。既存の下書きは削除していません。",
          }
    );
  };

  const handleDeleteDraft = () => {
    hasUserEditedRef.current = true;
    const deleted = deleteLocalDraft(COURSE_DRAFT_KEY);
    setDraftNotice(
      deleted
        ? {
            kind: "success",
            message: "保存済みの下書きを削除しました。入力中の内容は保持されています。",
          }
        : {
            kind: "error",
            message: "下書きを削除できませんでした。ブラウザの設定をご確認ください。",
          }
    );
  };

  // Handle PNG generation
  const handleGenerate = async () => {
    if (!isFormValid || !templateRef.current || isGenerating) return;

    const generatedAt = new Date();
    const termNumber = getAcademicTermNumber(generatedAt);
    if (termNumber === null) return;

    try {
      flushSync(() => {
        setCurrentTerm(termNumber);
        setPngSnapshot({ generatedAt, termNumber });
        setIsGenerating(true);
      });

      const filename = `講義開講申請書_${sanitizeFilename(
        formData.subjectName
      )}_${formatDateForFilename(generatedAt)}.png`;
      await generatePng(templateRef.current, filename);
    } catch (err) {
      console.error("PNG generation error:", err);
      alert("PNGの生成に失敗しました。もう一度お試しください。");
    } finally {
      flushSync(() => {
        setPngSnapshot(null);
        setIsGenerating(false);
      });
    }
  };

  const availableCategories = formData.department
    ? DEPARTMENT_CATEGORIES[formData.department]
    : [];

  return (
    <div>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <SectionHeading divider={false}>講義基本情報</SectionHeading>

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

        <SectionHeading>開講条件</SectionHeading>

        <div className="max-w-xl">
          <SelectInput
            id="course-offering-type"
            label="開講時期"
            value={formData.offeringType}
            onChange={(val) =>
              updateField("offeringType", val as CourseFormData["offeringType"])
            }
            options={COURSE_OFFERING_TYPES}
            required
          />
          <p className="mt-2 text-sm text-[var(--color-text-muted)]" aria-live="polite">
            {currentTerm === null
              ? formData.offeringType
                ? `選択結果: ${formData.offeringType}（対象期は2026年8月1日以降に確定）`
                : "対象期は2026年8月1日以降に表示されます。"
              : formData.offeringType
                ? `PNGへの印字: ${formatOfferingForPng(formData.offeringType, currentTerm)}`
                : `対象期: #${currentTerm}期（開講時期を選択するとPNGへの印字を確認できます）`}
          </p>
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
              <p className="text-xs text-[var(--color-error)] mt-1">
                講義回数は {SESSION_MIN}〜{SESSION_MAX} 回の範囲で入力してください
              </p>
            )}
          </div>
          <div>
            <label className="form-label">
              単位数
              <span className="badge-auto">自動算出</span>
            </label>
            <div className="auto-value">
              {isSessionValid ? `${credits} 単位` : "- 単位"}
              <span className="text-xs text-[var(--color-text-muted)] font-normal ml-2">
                (3〜5回:1 / 6〜10回:2 / 11〜15回:3)
              </span>
            </div>
          </div>
        </div>

        <SectionHeading>講義内容</SectionHeading>

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
          maxItems={MAX_GOAL_ITEMS}
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

        <SectionHeading>確認・同意</SectionHeading>

        <AgreementSection
          confirmNoFalsehood={formData.confirmNoFalsehood}
          onFalsehoodChange={(val) => updateField("confirmNoFalsehood", val)}
          falsehoodCheckboxId="confirm-falsehood-course"
          policies={[
            {
              modalId: "privacy",
              checkboxId: "confirm-privacy-course",
              checked: formData.confirmPrivacyPolicy,
              markdownPath: "/privacy-policy.md",
              title: "プライバシーポリシー",
              label: "に同意します",
              field: "confirmPrivacyPolicy",
            },
            {
              modalId: "lecturer",
              checkboxId: "confirm-regulations-course",
              checked: formData.confirmRegulations,
              markdownPath: "/lecturer-policy.md",
              title: "講師規約",
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
        <div className="pt-2 space-y-4">
          <DraftActions
            notice={draftNotice}
            onSave={handleSaveDraft}
            onDelete={handleDeleteDraft}
          />
          <button
            type="button"
            className="btn-primary"
            disabled={!isFormValid || currentTerm === null || isGenerating}
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
      <CoursePngTemplate
        ref={templateRef}
        data={formData}
        generatedAt={pngSnapshot?.generatedAt}
        termNumber={pngSnapshot?.termNumber}
      />
    </div>
  );
}
