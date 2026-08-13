import { mockLessonsData } from "@/lib/mockLessonsData";
import { Lesson } from "@/types/course";

const STORAGE_KEY_PREFIX = "rewaa_lessons_";

export function getStoredLessons(locale: string): Lesson[] {
  if (typeof window === "undefined") {
    return mockLessonsData[locale as "ar" | "en"] || mockLessonsData.ar;
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
    console.error("Failed to load lessons from localStorage:", error);
  }

  // Initial load: seed localStorage with default mock data
  const initialData = mockLessonsData[locale as "ar" | "en"] || mockLessonsData.ar;
  saveStoredLessons(locale, initialData);
  return initialData;
}

export function saveStoredLessons(locale: string, lessons: Lesson[]): void {
  if (typeof window === "undefined") return;

  try {
    const key = `${STORAGE_KEY_PREFIX}${locale}`;
    localStorage.setItem(key, JSON.stringify(lessons));
    // Dispatch custom event to sync across components/tabs
    window.dispatchEvent(new Event("rewaa_lessons_updated"));
  } catch (error) {
    console.error("Failed to save lessons to localStorage:", error);
  }
}

export function resetStoredLessons(locale: string): Lesson[] {
  if (typeof window === "undefined") {
    return mockLessonsData[locale as "ar" | "en"] || mockLessonsData.ar;
  }

  try {
    const key = `${STORAGE_KEY_PREFIX}${locale}`;
    const freshData = mockLessonsData[locale as "ar" | "en"] || mockLessonsData.ar;
    localStorage.setItem(key, JSON.stringify(freshData));
    window.dispatchEvent(new Event("rewaa_lessons_updated"));
    return freshData;
  } catch (error) {
    console.error("Failed to reset lessons in localStorage:", error);
    return mockLessonsData[locale as "ar" | "en"] || mockLessonsData.ar;
  }
}
