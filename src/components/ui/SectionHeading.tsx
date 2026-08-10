"use client";

import React from "react";

interface SectionHeadingProps {
  children: React.ReactNode;
  /** Draw a rule above the heading. Off for the first section of a form. */
  divider?: boolean;
}

export default function SectionHeading({
  children,
  divider = true,
}: SectionHeadingProps) {
  return (
    <div className="section-heading-group">
      {divider && <hr className="section-divider" />}
      <h3 className="section-heading">{children}</h3>
    </div>
  );
}
