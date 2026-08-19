/**
 * Student Enrolled Courses Storage Helper
 * Centralizes enrolled course IDs in localStorage.
 */

const STORAGE_KEY = "rewaa_student_enrolled_courses";

// Default initial enrolled course IDs (Physics: course-001, Biology: course-004)
const DEFAULT_ENROLLED_COURSE_IDS = ["course-001", "course-004"];

export function getEnrolledCourseIds(): string[] {
  if (typeof window === "undefined") {
    return DEFAULT_ENROLLED_COURSE_IDS;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Failed to load enrolled courses from localStorage:", error);
  }

  // Seed default enrolled courses
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ENROLLED_COURSE_IDS));
  } catch (error) {
    console.error("Failed to seed default enrolled courses:", error);
  }

  return DEFAULT_ENROLLED_COURSE_IDS;
}

export function isCourseEnrolled(courseId: string): boolean {
  if (!courseId) return false;
  const enrolledIds = getEnrolledCourseIds();
  return enrolledIds.includes(courseId);
}

export function enrollCourse(courseId: string): string[] {
  if (typeof window === "undefined" || !courseId) return [];

  try {
    const current = getEnrolledCourseIds();
    if (current.includes(courseId)) return current;

    const updated = [...current, courseId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Dispatch custom event to notify all components
    window.dispatchEvent(
      new CustomEvent("rewaa_student_enrollment_updated", {
        detail: { courseId, action: "enroll" },
      }),
    );
    window.dispatchEvent(new Event("storage"));

    return updated;
  } catch (error) {
    console.error("Failed to enroll in course:", error);
    return [];
  }
}

export function unenrollCourse(courseId: string): string[] {
  if (typeof window === "undefined" || !courseId) return [];

  try {
    const current = getEnrolledCourseIds();
    const updated = current.filter((id) => id !== courseId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    window.dispatchEvent(
      new CustomEvent("rewaa_student_enrollment_updated", {
        detail: { courseId, action: "unenroll" },
      }),
    );
    window.dispatchEvent(new Event("storage"));

    return updated;
  } catch (error) {
    console.error("Failed to unenroll from course:", error);
    return [];
  }
}

export function resetEnrolledCourses(): string[] {
  if (typeof window === "undefined") return DEFAULT_ENROLLED_COURSE_IDS;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ENROLLED_COURSE_IDS));
    window.dispatchEvent(
      new CustomEvent("rewaa_student_enrollment_updated", {
        detail: { courseIds: DEFAULT_ENROLLED_COURSE_IDS, action: "reset" },
      }),
    );
    window.dispatchEvent(new Event("storage"));
    return DEFAULT_ENROLLED_COURSE_IDS;
  } catch (error) {
    console.error("Failed to reset enrolled courses:", error);
    return DEFAULT_ENROLLED_COURSE_IDS;
  }
}
