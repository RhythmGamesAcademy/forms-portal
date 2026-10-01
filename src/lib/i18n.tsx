"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { PLACEHOLDERS } from "./constants";
import { SITE_DESCRIPTION, SITE_TITLE } from "./siteMetadata";

export type Locale = "ja" | "en";

export function getLocalizedCharacterLimit(baseLimit: number, locale: Locale): number {
  const multiplier = locale === "en" ? 1.5 : 1;
  return Math.floor(baseLimit * multiplier);
}

/**
 * Japanese source text -> translation. The Japanese text itself is the key, so
 * a missing entry falls back to Japanese. `{name}` placeholders are filled in by
 * `t(text, { name })`, which lets a translation reorder words around a value.
 * Strings that are also defined in constants/siteMetadata are keyed by reference
 * so the two can never drift apart.
 */
const translations: Record<string, Partial<Record<Locale, string>>> = {
  // -- Site / header / footer --
  "音楽ゲーム学園": { en: "Rhythm Games Academy" },
  "音楽ゲーム学園 ロゴ": { en: "Rhythm Games Academy logo" },
  "申請書作成ポータル": { en: "Application Portal" },
  [SITE_TITLE]: { en: "Application Builder | Rhythm Games Academy" },
  [SITE_DESCRIPTION]: {
    en: "A web app for creating and downloading Rhythm Games Academy lecturer registration and course opening applications in your browser.",
  },
  "言語": { en: "Language" },

  // -- Page intro / tabs --
  "申請書作成": { en: "Create an Application" },
  "必要事項を入力し、「申請書PNGをダウンロード」ボタンを押すとA4風の申請書画像を生成できます。": {
    en: 'Enter the details and select "Download Application PNG" to create an A4-sized application image.',
  },
  "生成後は所定の手続きに従って運営へ提出してください。": {
    en: "After generating the image, submit it to Management using the designated procedure.",
  },
  "申請種別": { en: "Application type" },
  "講師登録申請": { en: "Lecturer Registration Application" },
  "講義開講申請": { en: "Course Opening Application" },

  // -- Section headings --
  "基本情報": { en: "Basic Information" },
  "担当領域": { en: "Field of Responsibility" },
  "実績・自己PR": { en: "Experience & Self-Promotion" },
  "講義基本情報": { en: "Course Information" },
  "開講条件": { en: "Course Opening Conditions" },
  "講義内容": { en: "Course Content" },
  "確認・同意": { en: "Confirmation and Agreement" },

  // -- Instructor form fields --
  "講師名": { en: "Lecturer Name" },
  "年齢": { en: "Age" },
  "担当分野": { en: "Field of Expertise" },
  "担当学部": { en: "Faculty" },
  "講義区分": { en: "Course Category" },
  "担当分野の選定理由": { en: "Field of Expertise Selection Reason" },
  "実績": { en: "Experience" },
  "自己アピール": { en: "Self-Promotion" },

  // -- Course form fields --
  "科目名": { en: "Course Title" },
  "担当講師": { en: "Assigned Lecturer" },
  "対象学部": { en: "Faculty" },
  "開講時期": { en: "Course Opening Period" },
  "講義回数 (3〜15回)": { en: "Number of Sessions (3–15)" },
  "講義回数": { en: "Sessions" },
  "講義回数は半角数字で 3〜15 回の範囲で入力してください": {
    en: "Enter 3–15 using half-width digits.",
  },
  "{count}回": { en: "{count} sessions" },
  "単位": { en: "Credits" },
  "単位数": { en: "Credits" },
  "自動算出": { en: "Calculated" },
  "{credits} 単位": { en: "{credits} credit(s)" },
  "{credits}単位": { en: "{credits} credit(s)" },
  "(3〜5回:1 / 6〜10回:2 / 11〜15回:3)": {
    en: "(3–5 sessions: 1 / 6–10: 2 / 11–15: 3)",
  },
  "講義概要": { en: "Course Overview" },
  "受講者の到達目標": { en: "Learning Outcomes" },
  "講義の進め方・方針": { en: "Teaching Method and Approach" },
  "参考文献など": { en: "References" },

  // -- Faculties, course categories, offering types --
  "音ゲー基礎学部": { en: "Rhythm Games Foundations Faculty" },
  "音ゲー実践学部": { en: "Rhythm Games Practice Faculty" },
  "文理系": { en: "Humanities and Sciences" },
  "創作系": { en: "Creation" },
  "アーケード系": { en: "Arcade" },
  "スタンドアロン系": { en: "Standalone" },
  "モバイル系": { en: "Mobile" },
  "当期講義": { en: "Current-term Course" },
  "通期講義": { en: "Continuing Course" },
  "{offering}（#{term}期）": { en: "{offering} (Term #{term})" },
  "{offering}（#{term}期から）": { en: "{offering} (from Term #{term})" },
  "対象期は2026年8月1日以降に表示されます。": {
    en: "The academic term will be shown from August 1, 2026.",
  },
  "選択結果: {offering}（対象期は2026年8月1日以降に確定）": {
    en: "Selection: {offering} (the academic term will be determined from August 1, 2026)",
  },
  "PNGへの印字: {value}": { en: "Printed on PNG: {value}" },
  "対象期: #{term}期（開講時期を選択するとPNGへの印字を確認できます）": {
    en: "Academic term: #{term} (select a course opening period to preview the PNG)",
  },

  // -- Generic form UI --
  "必須": { en: "Required" },
  "任意": { en: "Optional" },
  "項目を追加": { en: "Add item" },
  "{index}番目を削除": { en: "Remove item {index}" },
  "選択してください": { en: "Please select" },
  "先に対象学部を選択してください": { en: "Select a faculty first" },
  "先に担当学部を選択してください": { en: "Select a faculty first" },
  "上限に達しました": { en: "Character limit reached" },
  "文字超過しています": { en: " characters over the limit" },

  // -- Placeholders (keyed by the constants they translate) --
  [PLACEHOLDERS.instructor.name]: { en: "e.g. tzug" },
  [PLACEHOLDERS.instructor.age]: { en: "e.g. 18" },
  [PLACEHOLDERS.instructor.discordId]: { en: "e.g. #username" },
  [PLACEHOLDERS.instructor.xId]: { en: "e.g. @username" },
  [PLACEHOLDERS.instructor.field]: { en: "e.g. Computer Engineering, Arcaea" },
  [PLACEHOLDERS.instructor.fieldReason]: {
    en: "e.g. I want to share the fun of applying computer engineering to rhythm games and uncovering how they work internally, and to look at Arcaea from an information science perspective.",
  },
  [PLACEHOLDERS.instructor.achievement]: {
    en: "Degrees, qualifications, academic records, ratings, etc.",
  },
  [PLACEHOLDERS.instructor.selfAppeal]: {
    en: "e.g. I am a third-year student in an information engineering department at a technical school. My cumulative GPA is 3.5 and I rank 2nd in my department, so I believe I have a suitable level of academic ability.",
  },
  [PLACEHOLDERS.course.subjectName]: {
    en: "e.g. Introduction to Image Processing for Rhythm Gamers",
  },
  [PLACEHOLDERS.course.sessionCount]: { en: "3–15" },
  [PLACEHOLDERS.course.overview]: {
    en: "e.g. Learn image processing with Python and OpenCV, from matrix operations and linear transformations to hands-on image processing (a PC is required).",
  },
  [PLACEHOLDERS.course.goal]: {
    en: "e.g. Apply image processing to chart analysis",
  },
  [PLACEHOLDERS.course.approach]: {
    en: "e.g. Set a theme for each session and upload a lecture-material PDF on that theme to GitHub every Tuesday. Also give a short quiz each time to see where students struggled in the previous session, and post supplementary materials in the same way.",
  },
  [PLACEHOLDERS.course.references]: { en: "e.g. Reference URLs or book titles" },

  // -- Agreements / policy modal --
  "申請内容に虚偽はありません": {
    en: "I confirm that the information provided is accurate.",
  },
  "プライバシーポリシー": { en: "Privacy Policy" },
  "講師ガイドライン": { en: "Lecturer guideline" },
  "に同意します": { en: " — I agree." },
  "に同意し、遵守することを誓います": {
    en: " — I agree to it and pledge to comply with it.",
  },
  "閉じる": { en: "Close" },
  "同意する": { en: "Agree" },
  "読み込み中...": { en: "Loading..." },
  "読み込みエラー: ": { en: "Loading error: " },

  // -- Draft / PNG actions --
  "PNG生成中...": { en: "Generating PNG..." },
  "申請書PNGをダウンロード": { en: "Download Application PNG" },
  "下書きを保存": { en: "Save Draft" },
  "下書きを削除": { en: "Delete Draft" },
  "保存済みの下書きを復元しました。確認・同意項目は再度確認してください。": {
    en: "Draft restored. Please review the confirmation and agreement items again.",
  },
  "保存済みの下書きを読み込めませんでした。データが破損しているか、現在のフォーム形式と異なる可能性があります。下書きは削除せず残しています。": {
    en: "Could not load the saved draft. It may be corrupted or use an incompatible form version. The draft was kept.",
  },
  "ブラウザの保存領域を利用できないため、下書きを読み込めませんでした。": {
    en: "Could not load the draft because browser storage is unavailable.",
  },
  "入力内容が下書きの保存可能な形式を超えています。入力内容を確認してください。既存の下書きは削除していません。": {
    en: "The entered data cannot be saved as a draft. Please review it. The existing draft was kept.",
  },
  "下書きを保存しました。このブラウザに保存されています。": {
    en: "Draft saved in this browser.",
  },
  "下書きを保存できませんでした。ブラウザの設定や保存容量をご確認ください。既存の下書きは削除していません。": {
    en: "Could not save the draft. Check browser settings and available storage. The existing draft was kept.",
  },
  "保存済みの下書きを削除しました。入力中の内容は保持されています。": {
    en: "Saved draft deleted. Your current entries were kept.",
  },
  "下書きを削除できませんでした。ブラウザの設定をご確認ください。": {
    en: "Could not delete the draft. Please check browser settings.",
  },
  "PNGの生成に失敗しました。もう一度お試しください。": {
    en: "Could not generate the PNG. Please try again.",
  },

  // -- PNG document --
  "講師登録申請書": { en: "Lecturer Registration Application Form" },
  "講義開講申請書": { en: "Course Opening Application Form" },
  "PNG作成日": { en: "PNG Creation Date" },
  "無題": { en: "Untitled" },

  // -- FAQ --
  "よくある質問 (FAQ)": { en: "Frequently Asked Questions (FAQ)" },
  "申請する際に疑問が生じた場合は、まずこちらをご確認ください。": {
    en: "Please check here if you have questions about applying.",
  },
  "よくある質問を読み込み中...": { en: "Loading FAQs..." },
  "FAQの読み込みに失敗しました: ": { en: "Could not load FAQs: " },
  "申請の流れについて": { en: "Application Process" },
  "担当学部について": { en: "Faculties" },
  "講義区分について": { en: "Course Categories" },
  "実績について": { en: "Qualifications and Experience" },
  "講師活動について": { en: "Lecturer Activities" },
  "プライバシーについて": { en: "Privacy" },
  "講義の開講時期について": { en: "Course Opening Periods" },
  "講義資料について": { en: "Course Materials" },
};

const faqTranslations: Record<Locale, Record<number, [string, string]>> = {
  ja: {},
  en: {
    1: [
      "What should I do after downloading the application PNG?",
      "You can submit a lecturer registration application from the application channels in the Academic Affairs Officer's room on Discord. Create a dedicated channel there and post the downloaded application image. Your application is considered received once you post it.",
    ],
    2: [
      "How long does the review take?",
      "We aim to notify you of the result within two weeks of your application. This may vary depending on the review status, so thank you for your understanding.",
    ],
    3: [
      "Is there an age limit?",
      "Because the Academy is based on Discord, we follow Discord's Terms of Service and accept applicants aged 13 or older.",
    ],
    4: [
      "Can I teach in faculties other than the one I selected?",
      "Yes. The selected faculty only indicates your primary area of activity. You may also teach in other faculties, so please select the field that is the center of your activities.",
    ],
    5: [
      "Where should I apply for PC or console rhythm-game courses?",
      "Please apply under Standalone courses.",
    ],
    6: [
      "Where should interdisciplinary courses be categorized?",
      "Please apply under Humanities and Sciences courses in the Rhythm Games Foundations Faculty. Content that spans faculties or is general-education in nature is treated as Humanities and Sciences courses.",
    ],
    7: [
      "What should I write under Experience?",
      "List facts that objectively show you are able to teach your field, such as degrees or grades, qualifications, works or portfolios, and community activity history. If you have no notable achievements, use the Self-Promotion field to fully convey your knowledge and experience. Please avoid writing information you do not wish to make public, such as your real name or school name.",
    ],
    8: [
      "Do I have to open a course every term after registering as a lecturer?",
      "No. Once approved, your lecturer qualification remains valid. You will not lose it even if you skip a term, so please work at your own pace.",
    ],
    9: [
      "Is the information entered in the form stored on a server?",
      'No, it is not stored on a server. Your input is converted into the application PNG in your browser. If you select "Save Draft", your input (excluding the confirmation and agreement checkboxes) is saved in the browser you are using and restored when you open the form in the same browser. See the Privacy Policy for details.',
    ],
    10: [
      'What is the difference between a "current-term course" and a "continuing course"?',
      "A current-term course is held and ends in its designated term; to run it again in another term, you submit a new course opening application, as at a typical school. A continuing course can continue to be taken from the designated term without updating the course materials. A continuing course does not mean classes are held every term or that it is available permanently.",
    ],
    11: [
      "When does the academic term change?",
      "The term changes on February 1 and August 1, determined by Japan time when the PNG is created. August 1, 2026 through January 31, 2027 is Term #1, and the number advances by one at each change after that. The PNG creation date and time is not the actual date and time you post your application on Discord.",
    ],
    12: [
      "How can I update published course materials?",
      "Do not edit published course materials into a new version. If the content becomes outdated, please apply again as a new course. You may reuse past materials apart from the parts that need to change. The previous course will no longer be available to take.",
    ],
    13: [
      "Is the creation date on the PNG the date I applied on Discord?",
      "No. The portal records the date and time the PNG was created. It does not capture the actual date and time your application was posted or received, so please check the post date and time on Discord.",
    ],
  },
};

export type FaqTranslation = { question: string; answer: string };
export type TranslationParams = Record<string, string | number>;

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (text: string, params?: TranslationParams) => string;
  getFaqTranslation: (id: number) => FaqTranslation | null;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);
const STORAGE_KEY = "syllabus-portal:locale";
const localeListeners = new Set<() => void>();
let currentLocale: Locale = "ja";

function getLocaleSnapshot(): Locale {
  if (typeof window === "undefined") return currentLocale;
  try {
    const savedLocale = window.localStorage.getItem(STORAGE_KEY);
    if (savedLocale === "ja" || savedLocale === "en") {
      currentLocale = savedLocale;
    }
  } catch {
    // Keep the current language when browser storage is unavailable.
  }
  return currentLocale;
}

function getServerLocaleSnapshot(): Locale {
  return "ja";
}

function subscribeToLocale(listener: () => void): () => void {
  localeListeners.add(listener);
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      currentLocale = getLocaleSnapshot();
      listener();
    }
  };
  window.addEventListener("storage", handleStorage);
  return () => {
    localeListeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

function changeLocale(locale: Locale): void {
  currentLocale = locale;
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // Language switching still works when storage is unavailable.
  }
  localeListeners.forEach((listener) => listener());
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(
    subscribeToLocale,
    getLocaleSnapshot,
    getServerLocaleSnapshot
  );

  // <head> is rendered on the server in Japanese; keep it in step with the chosen language.
  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = translate(SITE_TITLE, locale);
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", translate(SITE_DESCRIPTION, locale));
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale: changeLocale,
      t: (text, params) => translate(text, locale, params),
      getFaqTranslation: (id) => {
        const entry = faqTranslations[locale]?.[id];
        return entry ? { question: entry[0], answer: entry[1] } : null;
      },
    }),
    [locale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}

export function translate(
  text: string,
  locale: Locale,
  params?: TranslationParams
): string {
  const template = locale === "ja" ? text : translations[text]?.[locale] ?? text;
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match
  );
}

export function getLocalizedMarkdownPath(basePath: string, locale: Locale): string {
  if (locale === "ja") return basePath;
  const ext = ".md";
  if (basePath.endsWith(ext)) {
    return `${basePath.slice(0, -ext.length)}.${locale}${ext}`;
  }
  return basePath;
}
