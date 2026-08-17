import { mockActivationCodesData } from "@/lib/mockActivationCodesData";
import { ActivationCode, CodeStatus } from "@/types/activation-code";
import { getStoredCodeGroups, saveStoredCodeGroups } from "@/lib/code-groups-storage";

const STORAGE_KEY_PREFIX = "rewaa_activation_codes_";

export function getStoredActivationCodes(locale: string): ActivationCode[] {
  if (typeof window === "undefined") {
    return mockActivationCodesData[locale as "ar" | "en"] || mockActivationCodesData.ar;
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
    console.error("Failed to load activation codes from localStorage:", error);
  }

  // Initial load: seed localStorage with default mock data
  const initialData = mockActivationCodesData[locale as "ar" | "en"] || mockActivationCodesData.ar;
  saveStoredActivationCodes(locale, initialData);
  return initialData;
}

export function saveStoredActivationCodes(locale: string, codes: ActivationCode[]): void {
  if (typeof window === "undefined") return;

  try {
    const key = `${STORAGE_KEY_PREFIX}${locale}`;
    localStorage.setItem(key, JSON.stringify(codes));
    window.dispatchEvent(new Event("rewaa_activation_codes_updated"));

    // Recalculate parent code group counts
    syncGroupCounts(locale, codes);
  } catch (error) {
    console.error("Failed to save activation codes to localStorage:", error);
  }
}

function syncGroupCounts(locale: string, codes: ActivationCode[]): void {
  const groups = getStoredCodeGroups(locale);
  let updated = false;

  const newGroups = groups.map((group) => {
    const groupCodes = codes.filter((c) => c.groupId === group.id);
    if (groupCodes.length === 0) return group;

    const available = groupCodes.filter((c) => c.status === "available").length;
    const sold = groupCodes.filter((c) => c.status === "sold").length;
    const used = groupCodes.filter((c) => c.status === "used").length;
    const total = groupCodes.length;

    if (
      group.totalCodes !== total ||
      group.availableCodes !== available ||
      group.soldCodes !== sold ||
      group.usedCodes !== used
    ) {
      updated = true;
      return {
        ...group,
        totalCodes: total,
        availableCodes: available,
        soldCodes: sold,
        usedCodes: used,
      };
    }

    return group;
  });

  if (updated) {
    saveStoredCodeGroups(locale, newGroups);
  }
}

export function addStoredActivationCode(
  locale: string,
  newCodeData: Omit<ActivationCode, "id" | "createdAt">,
): ActivationCode[] {
  const currentCodes = getStoredActivationCodes(locale);
  const newCodeItem: ActivationCode = {
    ...newCodeData,
    id: `code-${Date.now()}`,
    createdAt: new Date().toISOString().split("T")[0],
  };
  const updatedCodes = [newCodeItem, ...currentCodes];
  saveStoredActivationCodes(locale, updatedCodes);
  return updatedCodes;
}

export function addStoredActivationCodesBatch(
  locale: string,
  newCodesData: Omit<ActivationCode, "id" | "createdAt">[],
): ActivationCode[] {
  const currentCodes = getStoredActivationCodes(locale);
  const nowStr = new Date().toISOString().split("T")[0];
  const newCodeItems: ActivationCode[] = newCodesData.map((item, index) => ({
    ...item,
    id: `code-${Date.now()}-${index}-${Math.floor(Math.random() * 1000)}`,
    createdAt: nowStr,
  }));
  const updatedCodes = [...newCodeItems, ...currentCodes];
  saveStoredActivationCodes(locale, updatedCodes);
  return updatedCodes;
}

export function updateStoredActivationCode(
  locale: string,
  codeId: string,
  updates: Partial<Omit<ActivationCode, "id">>,
): ActivationCode[] {
  const currentCodes = getStoredActivationCodes(locale);
  const updatedCodes = currentCodes.map((item) =>
    item.id === codeId ? { ...item, ...updates } : item,
  );
  saveStoredActivationCodes(locale, updatedCodes);
  return updatedCodes;
}

export function updateStoredActivationCodeStatus(
  locale: string,
  codeId: string,
  newStatus: CodeStatus,
): ActivationCode[] {
  return updateStoredActivationCode(locale, codeId, { status: newStatus });
}

export function deleteStoredActivationCode(locale: string, codeId: string): ActivationCode[] {
  const currentCodes = getStoredActivationCodes(locale);
  const updatedCodes = currentCodes.filter((item) => item.id !== codeId);
  saveStoredActivationCodes(locale, updatedCodes);
  return updatedCodes;
}

export function resetStoredActivationCodes(locale: string): ActivationCode[] {
  if (typeof window === "undefined") {
    return mockActivationCodesData[locale as "ar" | "en"] || mockActivationCodesData.ar;
  }

  try {
    const key = `${STORAGE_KEY_PREFIX}${locale}`;
    const freshData = mockActivationCodesData[locale as "ar" | "en"] || mockActivationCodesData.ar;
    localStorage.setItem(key, JSON.stringify(freshData));
    window.dispatchEvent(new Event("rewaa_activation_codes_updated"));
    syncGroupCounts(locale, freshData);
    return freshData;
  } catch (error) {
    console.error("Failed to reset activation codes in localStorage:", error);
    return mockActivationCodesData[locale as "ar" | "en"] || mockActivationCodesData.ar;
  }
}
