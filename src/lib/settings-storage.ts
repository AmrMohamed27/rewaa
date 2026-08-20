import {
  Teacher,
  GradeItem,
  SubjectItem,
  AssistantItem,
  PlatformInfo,
  PlatformInfoGroupCommunication,
} from "@/types/settings";
import {
  initialTeachers,
  initialGrades,
  initialSubjects,
  initialAssistants,
  initialPlatformInfo,
  initialAnnouncements,
} from "./mockSettingsData";

const TEACHERS_KEY = "rewaa_settings_teachers";
const GRADES_KEY = "rewaa_settings_grades";
const SUBJECTS_KEY = "rewaa_settings_subjects";

// Teachers
export const getStoredTeachers = (): Teacher[] => {
  if (typeof window === "undefined") return initialTeachers;
  const stored = localStorage.getItem(TEACHERS_KEY);
  if (!stored) {
    localStorage.setItem(TEACHERS_KEY, JSON.stringify(initialTeachers));
    return initialTeachers;
  }
  try {
    const parsed: Teacher[] = JSON.parse(stored);
    // If old mock data with English names or old dual-subject arrays is stored, reset to new initialTeachers
    if (
      parsed.some((t) => t.name.includes("Dr. Ahmed") || t.name.includes("Prof. Sarah")) ||
      !parsed.some((t) => t.name.includes("عبد المعبود")) ||
      parsed.some(
        (t) => t.subjects && t.subjects.includes("الفيزياء") && t.subjects.includes("physics"),
      )
    ) {
      localStorage.setItem(TEACHERS_KEY, JSON.stringify(initialTeachers));
      return initialTeachers;
    }
    return parsed;
  } catch {
    return initialTeachers;
  }
};

export const saveTeacher = (teacher: Omit<Teacher, "id"> & { id?: string }): Teacher => {
  const current = getStoredTeachers();
  let updatedTeacher: Teacher;

  if (teacher.id) {
    updatedTeacher = teacher as Teacher;
    const index = current.findIndex((t) => t.id === teacher.id);
    if (index !== -1) {
      current[index] = updatedTeacher;
    } else {
      current.unshift(updatedTeacher);
    }
  } else {
    updatedTeacher = {
      ...teacher,
      id: `tch-${Date.now()}`,
    };
    current.unshift(updatedTeacher);
  }

  localStorage.setItem(TEACHERS_KEY, JSON.stringify(current));
  window.dispatchEvent(new Event("rewaa_teachers_updated"));
  return updatedTeacher;
};

export const resetTeachers = (): Teacher[] => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TEACHERS_KEY, JSON.stringify(initialTeachers));
    window.dispatchEvent(new Event("rewaa_teachers_updated"));
  }
  return initialTeachers;
};

export const deleteTeacher = (id: string): void => {
  const current = getStoredTeachers();
  const filtered = current.filter((t) => t.id !== id);
  localStorage.setItem(TEACHERS_KEY, JSON.stringify(filtered));
  window.dispatchEvent(new Event("rewaa_teachers_updated"));
};

// Grades
export const getStoredGrades = (): GradeItem[] => {
  if (typeof window === "undefined") return initialGrades;
  const stored = localStorage.getItem(GRADES_KEY);
  if (!stored) {
    localStorage.setItem(GRADES_KEY, JSON.stringify(initialGrades));
    return initialGrades;
  }
  try {
    const parsed: GradeItem[] = JSON.parse(stored);
    if (parsed.length < initialGrades.length) {
      localStorage.setItem(GRADES_KEY, JSON.stringify(initialGrades));
      return initialGrades;
    }
    return parsed;
  } catch {
    return initialGrades;
  }
};

export const saveGrade = (grade: { id?: string; name: string; year: number }): GradeItem => {
  const current = getStoredGrades();
  let updatedGrade: GradeItem;

  if (grade.id) {
    const index = current.findIndex((g) => g.id === grade.id);
    if (index !== -1) {
      updatedGrade = {
        ...current[index],
        name: grade.name,
        year: grade.year,
      };
      current[index] = updatedGrade;
    } else {
      updatedGrade = {
        id: grade.id,
        name: grade.name,
        year: grade.year,
        studentsCount: 0,
        coursesCount: 0,
        teachersCount: 0,
      };
      current.unshift(updatedGrade);
    }
  } else {
    updatedGrade = {
      id: `grd-${Date.now()}`,
      name: grade.name,
      year: grade.year,
      studentsCount: 0,
      coursesCount: 0,
      teachersCount: 0,
    };
    current.unshift(updatedGrade);
  }

  localStorage.setItem(GRADES_KEY, JSON.stringify(current));
  window.dispatchEvent(new Event("rewaa_grades_updated"));
  return updatedGrade;
};

export const resetGrades = (): GradeItem[] => {
  if (typeof window !== "undefined") {
    localStorage.setItem(GRADES_KEY, JSON.stringify(initialGrades));
    window.dispatchEvent(new Event("rewaa_grades_updated"));
  }
  return initialGrades;
};

export const deleteGrade = (id: string): void => {
  const current = getStoredGrades();
  const filtered = current.filter((g) => g.id !== id);
  localStorage.setItem(GRADES_KEY, JSON.stringify(filtered));
  window.dispatchEvent(new Event("rewaa_grades_updated"));
};

// Subjects
export const getStoredSubjects = (): SubjectItem[] => {
  if (typeof window === "undefined") return initialSubjects;
  const stored = localStorage.getItem(SUBJECTS_KEY);
  if (!stored) {
    localStorage.setItem(SUBJECTS_KEY, JSON.stringify(initialSubjects));
    return initialSubjects;
  }
  try {
    const parsed: SubjectItem[] = JSON.parse(stored);
    if (
      parsed.length < initialSubjects.length ||
      parsed.some((s) => s.name === "الرياضيات البحرية")
    ) {
      localStorage.setItem(SUBJECTS_KEY, JSON.stringify(initialSubjects));
      return initialSubjects;
    }
    return parsed;
  } catch {
    return initialSubjects;
  }
};

export const saveSubject = (subject: { id?: string; name: string }): SubjectItem => {
  const current = getStoredSubjects();
  let updatedSubject: SubjectItem;

  if (subject.id) {
    const index = current.findIndex((s) => s.id === subject.id);
    if (index !== -1) {
      updatedSubject = {
        ...current[index],
        name: subject.name,
      };
      current[index] = updatedSubject;
    } else {
      updatedSubject = {
        id: subject.id,
        name: subject.name,
        coursesCount: 0,
        teachersCount: 0,
      };
      current.unshift(updatedSubject);
    }
  } else {
    updatedSubject = {
      id: `sbj-${Date.now()}`,
      name: subject.name,
      coursesCount: 0,
      teachersCount: 0,
    };
    current.unshift(updatedSubject);
  }

  localStorage.setItem(SUBJECTS_KEY, JSON.stringify(current));
  window.dispatchEvent(new Event("rewaa_subjects_updated"));
  return updatedSubject;
};

export const resetSubjects = (): SubjectItem[] => {
  if (typeof window !== "undefined") {
    localStorage.setItem(SUBJECTS_KEY, JSON.stringify(initialSubjects));
    window.dispatchEvent(new Event("rewaa_subjects_updated"));
  }
  return initialSubjects;
};

export const deleteSubject = (id: string): void => {
  const current = getStoredSubjects();
  const filtered = current.filter((s) => s.id !== id);
  localStorage.setItem(SUBJECTS_KEY, JSON.stringify(filtered));
  window.dispatchEvent(new Event("rewaa_subjects_updated"));
};

// Assistants
const ASSISTANTS_KEY = "rewaa_settings_assistants";

export const getStoredAssistants = (): AssistantItem[] => {
  if (typeof window === "undefined") return initialAssistants;
  const stored = localStorage.getItem(ASSISTANTS_KEY);
  if (!stored) {
    localStorage.setItem(ASSISTANTS_KEY, JSON.stringify(initialAssistants));
    return initialAssistants;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return initialAssistants;
  }
};

export const saveAssistant = (
  assistant: Omit<AssistantItem, "id"> & { id?: string },
): AssistantItem => {
  const current = getStoredAssistants();
  let updated: AssistantItem;

  if (assistant.id) {
    updated = assistant as AssistantItem;
    const index = current.findIndex((a) => a.id === assistant.id);
    if (index !== -1) {
      current[index] = updated;
    } else {
      current.unshift(updated);
    }
  } else {
    updated = {
      ...assistant,
      id: `ast-${Date.now()}`,
    };
    current.unshift(updated);
  }

  localStorage.setItem(ASSISTANTS_KEY, JSON.stringify(current));
  window.dispatchEvent(new Event("rewaa_assistants_updated"));
  return updated;
};

export const resetAssistants = (): AssistantItem[] => {
  if (typeof window !== "undefined") {
    localStorage.setItem(ASSISTANTS_KEY, JSON.stringify(initialAssistants));
    window.dispatchEvent(new Event("rewaa_assistants_updated"));
  }
  return initialAssistants;
};

export const deleteAssistant = (id: string): void => {
  const current = getStoredAssistants();
  const filtered = current.filter((a) => a.id !== id);
  localStorage.setItem(ASSISTANTS_KEY, JSON.stringify(filtered));
  window.dispatchEvent(new Event("rewaa_assistants_updated"));
};

// Platform Info
const PLATFORM_INFO_KEY = "rewaa_settings_platform_info";

export const getStoredPlatformInfo = (): PlatformInfo => {
  if (typeof window === "undefined") return initialPlatformInfo;
  const stored = localStorage.getItem(PLATFORM_INFO_KEY);
  if (!stored) {
    localStorage.setItem(PLATFORM_INFO_KEY, JSON.stringify(initialPlatformInfo));
    return initialPlatformInfo;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return initialPlatformInfo;
  }
};

export const savePlatformInfoCommunication = (
  communication: PlatformInfoGroupCommunication,
): PlatformInfo => {
  const current = getStoredPlatformInfo();
  const updated: PlatformInfo = {
    ...current,
    communication,
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(PLATFORM_INFO_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("rewaa_platform_info_updated"));
  }
  return updated;
};

export const savePlatformInfoWhoWeAre = (content: string): PlatformInfo => {
  const current = getStoredPlatformInfo();
  const updated: PlatformInfo = {
    ...current,
    whoWeAre: { content },
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(PLATFORM_INFO_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("rewaa_platform_info_updated"));
  }
  return updated;
};

export const savePlatformInfoTerms = (content: string): PlatformInfo => {
  const current = getStoredPlatformInfo();
  const updated: PlatformInfo = {
    ...current,
    terms: { content },
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(PLATFORM_INFO_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("rewaa_platform_info_updated"));
  }
  return updated;
};

export const resetPlatformInfoGroup = (
  group: "communication" | "whoWeAre" | "terms",
): PlatformInfo => {
  const current = getStoredPlatformInfo();
  const updated: PlatformInfo = {
    ...current,
    [group]: initialPlatformInfo[group],
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(PLATFORM_INFO_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("rewaa_platform_info_updated"));
  }
  return updated;
};

// Announcements
const ANNOUNCEMENTS_KEY = "rewaa_settings_announcements";

export const getStoredAnnouncements = (): import("@/types/settings").AnnouncementItem[] => {
  if (typeof window === "undefined") return initialAnnouncements;
  const stored = localStorage.getItem(ANNOUNCEMENTS_KEY);
  if (!stored) {
    localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(initialAnnouncements));
    return initialAnnouncements;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return initialAnnouncements;
  }
};

export const saveAnnouncement = (data: {
  id?: string;
  title: string;
  description: string;
  coverImage?: string;
  url?: string;
  active?: boolean;
}): {
  announcement: import("@/types/settings").AnnouncementItem;
  deactivatedAnnouncementTitle?: string;
} => {
  const current = getStoredAnnouncements();
  let deactivatedTitle: string | undefined;

  // Default active to true if creating new record, or keep existing active state if editing
  const isEditing = !!data.id;
  const targetActive = data.active !== undefined ? data.active : true;

  // Check if we are activating or creating an active announcement and already have >= 3 active
  const activeCount = current.filter((a) => a.active && a.id !== data.id).length;

  if (targetActive && activeCount >= 3) {
    // Find the oldest active announcement that isn't the current one
    const activeItems = current.filter((a) => a.active && a.id !== data.id);
    // Sort by createdAt ascending (oldest first)
    activeItems.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    if (activeItems.length > 0) {
      const oldestActive = activeItems[0];
      const oldestIndex = current.findIndex((a) => a.id === oldestActive.id);
      if (oldestIndex !== -1) {
        current[oldestIndex] = { ...current[oldestIndex], active: false };
        deactivatedTitle = oldestActive.title;
      }
    }
  }

  let savedItem: import("@/types/settings").AnnouncementItem;

  if (isEditing) {
    const index = current.findIndex((a) => a.id === data.id);
    if (index !== -1) {
      savedItem = {
        ...current[index],
        title: data.title,
        description: data.description,
        coverImage: data.coverImage,
        url: data.url,
        active: targetActive,
      };
      current[index] = savedItem;
    } else {
      savedItem = {
        id: data.id!,
        title: data.title,
        description: data.description,
        coverImage: data.coverImage,
        url: data.url,
        active: targetActive,
        createdAt: new Date().toISOString(),
      };
      current.unshift(savedItem);
    }
  } else {
    savedItem = {
      id: `anc-${Date.now()}`,
      title: data.title,
      description: data.description,
      coverImage: data.coverImage,
      url: data.url,
      active: targetActive,
      createdAt: new Date().toISOString(),
    };
    current.unshift(savedItem);
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(current));
    window.dispatchEvent(new Event("rewaa_announcements_updated"));
  }

  return { announcement: savedItem, deactivatedAnnouncementTitle: deactivatedTitle };
};

export const toggleAnnouncementActive = (id: string): { deactivatedAnnouncementTitle?: string } => {
  const current = getStoredAnnouncements();
  const index = current.findIndex((a) => a.id === id);
  if (index === -1) return {};

  const targetItem = current[index];
  const newActiveState = !targetItem.active;

  let deactivatedTitle: string | undefined;

  if (newActiveState) {
    const activeCount = current.filter((a) => a.active && a.id !== id).length;
    if (activeCount >= 3) {
      const activeItems = current.filter((a) => a.active && a.id !== id);
      activeItems.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      if (activeItems.length > 0) {
        const oldestActive = activeItems[0];
        const oldestIndex = current.findIndex((a) => a.id === oldestActive.id);
        if (oldestIndex !== -1) {
          current[oldestIndex] = { ...current[oldestIndex], active: false };
          deactivatedTitle = oldestActive.title;
        }
      }
    }
  }

  current[index] = { ...current[index], active: newActiveState };

  if (typeof window !== "undefined") {
    localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(current));
    window.dispatchEvent(new Event("rewaa_announcements_updated"));
  }

  return { deactivatedAnnouncementTitle: deactivatedTitle };
};

export const resetAnnouncements = (): import("@/types/settings").AnnouncementItem[] => {
  if (typeof window !== "undefined") {
    localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(initialAnnouncements));
    window.dispatchEvent(new Event("rewaa_announcements_updated"));
  }
  return initialAnnouncements;
};

export const deleteAnnouncement = (id: string): void => {
  const current = getStoredAnnouncements();
  const filtered = current.filter((a) => a.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new Event("rewaa_announcements_updated"));
  }
};
