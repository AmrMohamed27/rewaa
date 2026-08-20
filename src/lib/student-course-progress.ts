/**
 * Student Course Progress & Completed Lessons Storage Helper
 */

import { CourseSection } from "@/types/course";

const STORAGE_KEY_PREFIX = "rewaa_student_completed_lessons_";
const PASSED_EXAMS_STORAGE_KEY = "rewaa_student_passed_exams";

// Default initial passed/completed exams (Physics Unit Quiz: exam-005, Math Diagnostic Placement: exam-006)
const DEFAULT_PASSED_EXAM_IDS = ["exam-005", "exam-006"];

export function getCompletedLessons(courseId: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${courseId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.error("Failed to load completed lessons:", error);
  }
  return [];
}

export function toggleLessonCompletion(
  courseId: string,
  lessonId: string,
): {
  completedLessons: string[];
  isCompleted: boolean;
} {
  if (typeof window === "undefined") return { completedLessons: [], isCompleted: false };

  try {
    const current = getCompletedLessons(courseId);
    const exists = current.includes(lessonId);
    const updated = exists ? current.filter((id) => id !== lessonId) : [...current, lessonId];

    localStorage.setItem(`${STORAGE_KEY_PREFIX}${courseId}`, JSON.stringify(updated));
    window.dispatchEvent(
      new CustomEvent("rewaa_student_progress_updated", {
        detail: { courseId, lessonId, isCompleted: !exists },
      }),
    );

    return { completedLessons: updated, isCompleted: !exists };
  } catch (error) {
    console.error("Failed to toggle lesson completion:", error);
    return { completedLessons: [], isCompleted: false };
  }
}

export function calculateCourseProgress(totalLessons: number, completedCount: number): number {
  if (totalLessons <= 0) return 0;
  return Math.min(100, Math.round((completedCount / totalLessons) * 100));
}

export function getPassedExams(): string[] {
  if (typeof window === "undefined") return DEFAULT_PASSED_EXAM_IDS;
  try {
    const raw = localStorage.getItem(PASSED_EXAMS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.error("Failed to load passed exams:", error);
  }

  // Seed default passed exams
  try {
    localStorage.setItem(PASSED_EXAMS_STORAGE_KEY, JSON.stringify(DEFAULT_PASSED_EXAM_IDS));
  } catch (error) {
    console.error("Failed to seed default passed exams:", error);
  }

  return DEFAULT_PASSED_EXAM_IDS;
}

export function isExamPassed(examId: string): boolean {
  if (!examId) return false;
  const passed = getPassedExams();
  return passed.includes(examId);
}

export function recordExamPass(examId: string, passed: boolean): string[] {
  if (typeof window === "undefined" || !examId) return [];
  try {
    const current = getPassedExams();
    const exists = current.includes(examId);
    let updated: string[];
    if (passed && !exists) {
      updated = [...current, examId];
    } else if (!passed && exists) {
      updated = current.filter((id) => id !== examId);
    } else {
      updated = current;
    }
    localStorage.setItem(PASSED_EXAMS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(
      new CustomEvent("rewaa_student_passed_exams_updated", {
        detail: { examId, passed },
      }),
    );
    return updated;
  } catch (error) {
    console.error("Failed to update passed exams:", error);
    return [];
  }
}

/**
 * Checks whether a section is locked because a previous section has a required exam that hasn't been passed.
 * Returns { isLocked: boolean; requiredExamId?: string; requiredSectionTitle?: string }
 */
export function getSectionLockStatus(
  sectionIndex: number,
  sections: CourseSection[],
  passedExamIds: string[],
): {
  isLocked: boolean;
  requiredExamId?: string;
  requiredSectionTitle?: string;
} {
  for (let i = 0; i < sectionIndex; i++) {
    const prevSec = sections[i];
    if (prevSec && prevSec.isLinkedToExam && prevSec.isRequiredPassExamForNextSection) {
      const examId = prevSec.linkedExamId;
      if (examId && !passedExamIds.includes(examId)) {
        return {
          isLocked: true,
          requiredExamId: examId,
          requiredSectionTitle: prevSec.title,
        };
      }
    }
  }
  return { isLocked: false };
}
