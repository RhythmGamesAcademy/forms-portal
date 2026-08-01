// -- Department / Course Category types --

export const DEPARTMENTS = ["音ゲー基礎学部", "音ゲー実践学部"] as const;
export type Department = (typeof DEPARTMENTS)[number];

export const DEPARTMENT_CATEGORIES: Record<Department, readonly string[]> = {
  "音ゲー基礎学部": ["文理系講義", "創作系講義"],
  "音ゲー実践学部": ["アーケード系講義", "モバイル系講義"],
} as const;

// -- Instructor Registration Form --

export interface InstructorFormData {
  name: string;
  age: string;
  discordId: string;
  xId: string;
  field: string;
  department: Department | "";
  courseCategory: string;
  fieldReason: string;
  achievements: string[];
  selfAppeal: string;
  confirmNoFalsehood: boolean;
  confirmRegulations: boolean;
}

export function createEmptyInstructorForm(): InstructorFormData {
  return {
    name: "",
    age: "",
    discordId: "",
    xId: "",
    field: "",
    department: "",
    courseCategory: "",
    fieldReason: "",
    achievements: [""],
    selfAppeal: "",
    confirmNoFalsehood: false,
    confirmRegulations: false,
  };
}

// -- Course Opening Form --

export interface CourseFormData {
  subjectName: string;
  instructorName: string;
  department: Department | "";
  courseCategory: string;
  sessionCount: number | "";
  overview: string;
  goals: string[];
  approach: string;
  references: string;
  confirmNoFalsehood: boolean;
  confirmRegulations: boolean;
}

export function createEmptyCourseForm(): CourseFormData {
  return {
    subjectName: "",
    instructorName: "",
    department: "",
    courseCategory: "",
    sessionCount: "",
    overview: "",
    goals: [""],
    approach: "",
    references: "",
    confirmNoFalsehood: false,
    confirmRegulations: false,
  };
}

// -- Credits calculation --

export function calculateCredits(sessions: number): number {
  if (sessions >= 3 && sessions <= 5) return 1;
  if (sessions >= 6 && sessions <= 10) return 2;
  if (sessions >= 11 && sessions <= 15) return 3;
  return 0;
}
