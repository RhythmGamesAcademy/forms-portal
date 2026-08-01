"use client";

import React from "react";
import PngTemplate from "./PngTemplate";
import type { InstructorFormData } from "@/lib/types";

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

interface InstructorPngTemplateProps {
  data: InstructorFormData;
}

const InstructorPngTemplate = React.forwardRef<
  HTMLDivElement,
  InstructorPngTemplateProps
>(function InstructorPngTemplate({ data }, ref) {
  return (
    <PngTemplate ref={ref} title="講師登録申請書">
      {/* Row 1: Name / Age */}
      <div style={twoColGrid}>
        <div style={fieldGroupStyle}>
          <div style={fieldLabelStyle}>講師名</div>
          <div style={fieldValueStyle}>{data.name}</div>
        </div>
        <div style={fieldGroupStyle}>
          <div style={fieldLabelStyle}>年齢</div>
          <div style={fieldValueStyle}>{data.age}</div>
        </div>
      </div>

      {/* Row 2: Discord / X */}
      <div style={twoColGrid}>
        <div style={fieldGroupStyle}>
          <div style={fieldLabelStyle}>Discord ID</div>
          <div style={fieldValueStyle}>{data.discordId}</div>
        </div>
        <div style={fieldGroupStyle}>
          <div style={fieldLabelStyle}>X ID</div>
          <div style={fieldValueStyle}>{data.xId || "-"}</div>
        </div>
      </div>

      {/* Row 3: Field */}
      <div style={fieldGroupStyle}>
        <div style={fieldLabelStyle}>担当分野</div>
        <div style={fieldValueStyle}>{data.field}</div>
      </div>

      {/* Row 4: Department / Category */}
      <div style={twoColGrid}>
        <div style={fieldGroupStyle}>
          <div style={fieldLabelStyle}>担当学部</div>
          <div style={fieldValueStyle}>{data.department}</div>
        </div>
        <div style={fieldGroupStyle}>
          <div style={fieldLabelStyle}>講義区分</div>
          <div style={fieldValueStyle}>{data.courseCategory}</div>
        </div>
      </div>

      {/* Row 5: Field reason */}
      <div style={fieldGroupStyle}>
        <div style={fieldLabelStyle}>担当分野の選定理由</div>
        <div style={fieldValueStyle}>{data.fieldReason}</div>
      </div>

      {/* Row 6: Achievements */}
      <div style={fieldGroupStyle}>
        <div style={fieldLabelStyle}>実績</div>
        {data.achievements
          .filter((a) => a.trim())
          .map((achievement, idx) => (
            <div key={`ach-${idx}`} style={listItemStyle}>
              {idx + 1}. {achievement}
            </div>
          ))}
      </div>

      {/* Row 7: Self appeal */}
      <div style={fieldGroupStyle}>
        <div style={fieldLabelStyle}>自己アピール</div>
        <div style={fieldValueStyle}>{data.selfAppeal}</div>
      </div>
    </PngTemplate>
  );
});

export default InstructorPngTemplate;
