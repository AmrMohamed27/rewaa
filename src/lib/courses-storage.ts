import { mockCoursesData } from "@/lib/mockCoursesData";
import { Course } from "@/types/course";

const STORAGE_KEY_PREFIX = "rewaa_courses_";

export function getStoredCourses(locale: string): Course[] {
  if (typeof window === "undefined") {
    return mockCoursesData[locale as "ar" | "en"] || mockCoursesData.ar;
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
    console.error("Failed to load courses from localStorage:", error);
  }

  // Initial load: seed localStorage with default mock data
  const initialData = mockCoursesData[locale as "ar" | "en"] || mockCoursesData.ar;
  saveStoredCourses(locale, initialData);
  return initialData;
}

export function saveStoredCourses(locale: string, courses: Course[]): void {
  if (typeof window === "undefined") return;

  try {
    const key = `${STORAGE_KEY_PREFIX}${locale}`;
    localStorage.setItem(key, JSON.stringify(courses));
    // Dispatch custom event to sync across components/tabs
    window.dispatchEvent(new Event("rewaa_courses_updated"));
  } catch (error) {
    console.error("Failed to save courses to localStorage:", error);
  }
}

export function resetStoredCourses(locale: string): Course[] {
  if (typeof window === "undefined") {
    return mockCoursesData[locale as "ar" | "en"] || mockCoursesData.ar;
  }

  try {
    const key = `${STORAGE_KEY_PREFIX}${locale}`;
    const freshData = mockCoursesData[locale as "ar" | "en"] || mockCoursesData.ar;
    localStorage.setItem(key, JSON.stringify(freshData));
    window.dispatchEvent(new Event("rewaa_courses_updated"));
    return freshData;
  } catch (error) {
    console.error("Failed to reset courses in localStorage:", error);
    return mockCoursesData[locale as "ar" | "en"] || mockCoursesData.ar;
  }
}
