import { mockCodeGroupsData } from "@/lib/mockCodeGroupsData";
import { CodeGroup } from "@/types/code-group";

const STORAGE_KEY_PREFIX = "rewaa_code_groups_";

export function getStoredCodeGroups(locale: string): CodeGroup[] {
  if (typeof window === "undefined") {
    return mockCodeGroupsData[locale as "ar" | "en"] || mockCodeGroupsData.ar;
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
    console.error("Failed to load code groups from localStorage:", error);
  }

  // Initial load: seed localStorage with default mock data
  const initialData = mockCodeGroupsData[locale as "ar" | "en"] || mockCodeGroupsData.ar;
  saveStoredCodeGroups(locale, initialData);
  return initialData;
}

export function saveStoredCodeGroups(locale: string, groups: CodeGroup[]): void {
  if (typeof window === "undefined") return;

  try {
    const key = `${STORAGE_KEY_PREFIX}${locale}`;
    localStorage.setItem(key, JSON.stringify(groups));
    window.dispatchEvent(new Event("rewaa_code_groups_updated"));
  } catch (error) {
    console.error("Failed to save code groups to localStorage:", error);
  }
}

export function addStoredCodeGroup(
  locale: string,
  newGroupData: Omit<CodeGroup, "id" | "createdAt" | "soldCodes" | "usedCodes">,
): CodeGroup {
  const currentGroups = getStoredCodeGroups(locale);
  const newGroup: CodeGroup = {
    ...newGroupData,
    id: `cg-${Date.now()}`,
    soldCodes: 0,
    usedCodes: 0,
    createdAt: new Date().toISOString().split("T")[0],
  };

  const updatedGroups = [newGroup, ...currentGroups];
  saveStoredCodeGroups(locale, updatedGroups);
  return newGroup;
}

export function resetStoredCodeGroups(locale: string): CodeGroup[] {
  if (typeof window === "undefined") {
    return mockCodeGroupsData[locale as "ar" | "en"] || mockCodeGroupsData.ar;
  }

  try {
    const key = `${STORAGE_KEY_PREFIX}${locale}`;
    const freshData = mockCodeGroupsData[locale as "ar" | "en"] || mockCodeGroupsData.ar;
    localStorage.setItem(key, JSON.stringify(freshData));
    window.dispatchEvent(new Event("rewaa_code_groups_updated"));
    return freshData;
  } catch (error) {
    console.error("Failed to reset code groups in localStorage:", error);
    return mockCodeGroupsData[locale as "ar" | "en"] || mockCodeGroupsData.ar;
  }
}
