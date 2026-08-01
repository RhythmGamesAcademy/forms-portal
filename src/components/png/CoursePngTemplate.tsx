"use client";

import React from "react";
import PngTemplate from "./PngTemplate";
import type { CourseFormData } from "@/lib/types";
import { calculateCredits } from "@/lib/types";

/**
 * Shared styles for the PNG document fields
 */
const fieldGroupStyle: React.CSSProperties = {
  marginBottom: "16px",
};

const fieldLabelStyle: React.CSSProperties = {
  fontSize: "11px",
  color: "#888888",
  marginBottom: "4px",
  fontWeight: 600,
  letterSpacing: "0.05em",
};

const fieldValueStyle: React.CSSProperties = {
  fontSize: "14px",
  lineHeight: "1.6",
  padding: "10px 14px",
  border: "1.5px solid #cccccc",
  borderRadius: "8px",
  minHeight: "36px",
  wordBreak: "break-word" as const,
  whiteSpace: "pre-wrap" as const,
};

const twoColGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "16px",
};

const listItemStyle: React.CSSProperties = {
  fontSize: "14px",
  lineHeight: "1.6",
  padding: "8px 14px",
  border: "1.5px solid #cccccc",
  borderRadius: "8px",
  marginBottom: "6px",
  wordBreak: "break-word" as const,
};

interface CoursePngTemplateProps {
  data: CourseFormData;
}

const CoursePngTemplate = React.forwardRef<
  HTMLDivElement,
  CoursePngTemplateProps
>(function CoursePngTemplate({ data }, ref) {
  const sessionCount =
    typeof data.sessionCount === "number" ? data.sessionCount : 0;
  const credits = calculateCredits(sessionCount);

  return (
    <PngTemplate ref={ref} title="講義開講申請書">
      {/* Row 1: Subject / Instructor */}
      <div style={twoColGrid}>
        <div style={fieldGroupStyle}>
          <div style={fieldLabelStyle}>科目名</div>
          <div style={fieldValueStyle}>{data.subjectName}</div>
        </div>
        <div style={fieldGroupStyle}>
          <div style={fieldLabelStyle}>担当講師</div>
          <div style={fieldValueStyle}>{data.instructorName}</div>
        </div>
      </div>

      {/* Row 2: Department / Category */}
      <div style={twoColGrid}>
        <div style={fieldGroupStyle}>
          <div style={fieldLabelStyle}>対象学部</div>
          <div style={fieldValueStyle}>{data.department}</div>
        </div>
        <div style={fieldGroupStyle}>
          <div style={fieldLabelStyle}>講義区分</div>
          <div style={fieldValueStyle}>{data.courseCategory}</div>
        </div>
      </div>

      {/* Row 3: Sessions / Credits */}
      <div style={twoColGrid}>
        <div style={fieldGroupStyle}>
          <div style={fieldLabelStyle}>講義回数</div>
          <div style={fieldValueStyle}>{sessionCount}回</div>
        </div>
        <div style={fieldGroupStyle}>
          <div style={fieldLabelStyle}>単位数</div>
          <div style={fieldValueStyle}>{credits}単位</div>
        </div>
      </div>

      {/* Row 4: Overview */}
      <div style={fieldGroupStyle}>
        <div style={fieldLabelStyle}>講義概要</div>
        <div style={fieldValueStyle}>{data.overview}</div>
      </div>

      {/* Row 5: Goals */}
      <div style={fieldGroupStyle}>
        <div style={fieldLabelStyle}>受講者の到達目標</div>
        {data.goals
          .filter((g) => g.trim())
          .map((goal, idx) => (
            <div key={`goal-${idx}`} style={listItemStyle}>
              {idx + 1}. {goal}
            </div>
          ))}
      </div>

      {/* Row 6: Approach */}
      <div style={fieldGroupStyle}>
        <div style={fieldLabelStyle}>講義の進め方・方針</div>
        <div style={fieldValueStyle}>{data.approach}</div>
      </div>

      {/* Row 7: References (optional) */}
      {data.references && (
        <div style={fieldGroupStyle}>
          <div style={fieldLabelStyle}>参考文献など</div>
          <div style={fieldValueStyle}>{data.references}</div>
        </div>
      )}
    </PngTemplate>
  );
});

export default CoursePngTemplate;
