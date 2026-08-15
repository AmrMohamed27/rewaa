import { mockStudentsData } from "@/lib/mockStudentsData";
import { Student } from "@/types/student";

const STORAGE_KEY_PREFIX = "rewaa_students_";

export function getStoredStudents(locale: string): Student[] {
  if (typeof window === "undefined") {
    return mockStudentsData[locale as "ar" | "en"] || mockStudentsData.ar;
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
    console.error("Failed to load students from localStorage:", error);
  }

  // Initial load: seed localStorage with default mock data
  const initialData = mockStudentsData[locale as "ar" | "en"] || mockStudentsData.ar;
  saveStoredStudents(locale, initialData);
  return initialData;
}

export function getStudentById(locale: string, id: string): Student | null {
  const students = getStoredStudents(locale);
  return students.find((s) => s.id === id) || null;
}

export function saveStoredStudents(locale: string, students: Student[]): void {
  if (typeof window === "undefined") return;

  try {
    const key = `${STORAGE_KEY_PREFIX}${locale}`;
    localStorage.setItem(key, JSON.stringify(students));
    window.dispatchEvent(new Event("rewaa_students_updated"));
  } catch (error) {
    console.error("Failed to save students to localStorage:", error);
  }
}

export function resetStoredStudents(locale: string): Student[] {
  if (typeof window === "undefined") {
    return mockStudentsData[locale as "ar" | "en"] || mockStudentsData.ar;
  }

  try {
    const key = `${STORAGE_KEY_PREFIX}${locale}`;
    const freshData = mockStudentsData[locale as "ar" | "en"] || mockStudentsData.ar;
    localStorage.setItem(key, JSON.stringify(freshData));
    window.dispatchEvent(new Event("rewaa_students_updated"));
    return freshData;
  } catch (error) {
    console.error("Failed to reset students in localStorage:", error);
    return mockStudentsData[locale as "ar" | "en"] || mockStudentsData.ar;
  }
}

export function addStoredStudent(
  locale: string,
  studentData: Omit<Student, "id" | "createdAt">,
): Student {
  const students = getStoredStudents(locale);
  const newStudent: Student = {
    ...studentData,
    id: `std-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [newStudent, ...students];
  saveStoredStudents(locale, updated);
  return newStudent;
}

export function updateStoredStudent(
  locale: string,
  id: string,
  studentData: Partial<Student>,
): Student | null {
  const students = getStoredStudents(locale);
  let updatedStudent: Student | null = null;
  const updated = students.map((s) => {
    if (s.id === id) {
      updatedStudent = { ...s, ...studentData, updatedAt: new Date().toISOString() };
      return updatedStudent;
    }
    return s;
  });
  if (updatedStudent) {
    saveStoredStudents(locale, updated);
  }
  return updatedStudent;
}

export function deleteStoredStudent(locale: string, id: string): boolean {
  const students = getStoredStudents(locale);
  const filtered = students.filter((s) => s.id !== id);
  if (filtered.length !== students.length) {
    saveStoredStudents(locale, filtered);
    return true;
  }
  return false;
}
