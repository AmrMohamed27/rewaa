import { ExamComplaint } from "@/types/complaint";
import { getInitialComplaintsForExam } from "./mockExamComplaintsData";

const STORAGE_KEY_PREFIX = "rewaa_exam_complaints_";

export function getStoredComplaints(examId: string, locale: string): ExamComplaint[] {
  if (typeof window === "undefined") {
    return getInitialComplaintsForExam(examId, (locale as "ar" | "en") || "ar");
  }

  try {
    const key = `${STORAGE_KEY_PREFIX}${locale}_${examId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Failed to load complaints from localStorage:", error);
  }

  // Initial seed
  const initial = getInitialComplaintsForExam(examId, (locale as "ar" | "en") || "ar");
  saveStoredComplaints(examId, locale, initial);
  return initial;
}

export function saveStoredComplaints(
  examId: string,
  locale: string,
  complaints: ExamComplaint[],
): void {
  if (typeof window === "undefined") return;

  try {
    const key = `${STORAGE_KEY_PREFIX}${locale}_${examId}`;
    localStorage.setItem(key, JSON.stringify(complaints));
    window.dispatchEvent(new CustomEvent("rewaa_complaints_updated", { detail: { examId } }));
  } catch (error) {
    console.error("Failed to save complaints to localStorage:", error);
  }
}

export function dismissComplaint(
  examId: string,
  locale: string,
  complaintId: string,
): ExamComplaint[] {
  const current = getStoredComplaints(examId, locale);
  const updated = current.filter((c) => c.id !== complaintId);
  saveStoredComplaints(examId, locale, updated);
  return updated;
}

export function resetStoredComplaints(examId: string, locale: string): ExamComplaint[] {
  if (typeof window === "undefined") {
    return getInitialComplaintsForExam(examId, (locale as "ar" | "en") || "ar");
  }

  try {
    const key = `${STORAGE_KEY_PREFIX}${locale}_${examId}`;
    const fresh = getInitialComplaintsForExam(examId, (locale as "ar" | "en") || "ar");
    localStorage.setItem(key, JSON.stringify(fresh));
    window.dispatchEvent(new CustomEvent("rewaa_complaints_updated", { detail: { examId } }));
    return fresh;
  } catch (error) {
    console.error("Failed to reset complaints in localStorage:", error);
    return getInitialComplaintsForExam(examId, (locale as "ar" | "en") || "ar");
  }
}
