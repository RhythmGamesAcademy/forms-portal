"use client";

import React, { useState } from "react";
import InstructorForm from "@/components/InstructorForm";
import CourseForm from "@/components/CourseForm";
import Faq from "@/components/Faq";

type TabType = "instructor" | "course";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("instructor");

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg-surface)]/90 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icon.png"
              alt="音楽ゲーム学園 ロゴ"
              className="w-9 h-9 rounded-md object-cover border border-[var(--color-border)]"
            />
            <div>
              <h1 className="text-base font-bold tracking-wide text-[var(--color-text-primary)]">
                音楽ゲーム学園
              </h1>
              <p className="text-xs text-[var(--color-text-secondary)]">申請書作成ポータル</p>
            </div>
          </div>
          <a
            href="https://rhythmgamesacademy.github.io/website/ja"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-accent-purple)] transition-colors hidden sm:inline-block"
          >
            学園公式サイト ↗
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 md:py-10">
        {/* Intro */}
        <div className="mb-6 text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] mb-2">
            申請書作成
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            必要事項を入力し、「申請書PNGをダウンロード」ボタンを押すとA4風の申請書画像を生成できます。<br />
            生成後は所定の手続きに従って運営へ提出してください。
          </p>
        </div>

        <Faq />

        {/* Card with Tabs & Forms */}
        <div className="card shadow-2xl">
          {/* Tab Navigation */}
          <div className="tab-container" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "instructor"}
              className={`tab-button ${activeTab === "instructor" ? "active" : ""}`}
              onClick={() => setActiveTab("instructor")}
            >
              講師登録申請
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "course"}
              className={`tab-button ${activeTab === "course" ? "active" : ""}`}
              onClick={() => setActiveTab("course")}
            >
              講義開講申請
            </button>
          </div>

          {/* Form Content */}
          <div className="card-body">
            {activeTab === "instructor" ? <InstructorForm /> : <CourseForm />}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] py-6 text-center text-xs text-[var(--color-text-muted)]">
        <p>&copy; {new Date().getFullYear()} 音楽ゲーム学園 All rights reserved.</p>
      </footer>
    </div>
  );
}
