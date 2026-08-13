import { mockExamsData } from "@/lib/mockExamsData";
import { Exam } from "@/types/exam";

const STORAGE_KEY_PREFIX = "rewaa_exams_";

export function getStoredExams(locale: string): Exam[] {
  if (typeof window === "undefined") {
    return mockExamsData[locale as "ar" | "en"] || mockExamsData.ar;
  }

  try {
    const key = `${STORAGE_KEY_PREFIX}${locale}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Failed to load exams from localStorage:", error);
  }

  // Initial load: seed localStorage with default mock data
  const initialData = mockExamsData[locale as "ar" | "en"] || mockExamsData.ar;
  saveStoredExams(locale, initialData);
  return initialData;
}

export function saveStoredExams(locale: string, exams: Exam[]): void {
  if (typeof window === "undefined") return;

  try {
    const key = `${STORAGE_KEY_PREFIX}${locale}`;
    localStorage.setItem(key, JSON.stringify(exams));
    // Dispatch custom event to sync across components/tabs
    window.dispatchEvent(new Event("rewaa_exams_updated"));
  } catch (error) {
    console.error("Failed to save exams to localStorage:", error);
  }
}

export function resetStoredExams(locale: string): Exam[] {
  if (typeof window === "undefined") {
    return mockExamsData[locale as "ar" | "en"] || mockExamsData.ar;
  }

  try {
    const key = `${STORAGE_KEY_PREFIX}${locale}`;
    const freshData = mockExamsData[locale as "ar" | "en"] || mockExamsData.ar;
    localStorage.setItem(key, JSON.stringify(freshData));
    window.dispatchEvent(new Event("rewaa_exams_updated"));
    return freshData;
  } catch (error) {
    console.error("Failed to reset exams in localStorage:", error);
    return mockExamsData[locale as "ar" | "en"] || mockExamsData.ar;
  }
}
