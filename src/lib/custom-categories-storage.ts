"use client";

const QUESTION_KINDS_KEY = "rewaa_custom_question_kinds";
const EXAM_CATEGORIES_KEY = "rewaa_custom_exam_categories";
const REGISTRATION_TYPES_KEY = "rewaa_custom_registration_types";
const TRANSACTION_TYPES_KEY = "rewaa_custom_transaction_types";
const CUSTOM_SECTIONS_KEY = "rewaa_custom_sections";

export interface CustomCategoryItem {
  id: string;
  name: string;
}

// ── Generic LocalStorage Helpers ─────────────────────────────────────────────

function getStoredItems(key: string): CustomCategoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => (typeof item === "string" ? { id: item, name: item } : item));
    }
  } catch (err) {
    console.error(`Failed to read from localStorage key "${key}":`, err);
  }
  return [];
}

function saveStoredItem(key: string, name: string, eventName: string): CustomCategoryItem {
  const trimmed = name.trim();
  if (!trimmed) return { id: "", name: "" };

  const current = getStoredItems(key);
  const existing = current.find(
    (item) => item.name.toLowerCase() === trimmed.toLowerCase() || item.id === trimmed,
  );
  if (existing) {
    return existing;
  }

  const newItem: CustomCategoryItem = {
    id: trimmed,
    name: trimmed,
  };

  const updated = [...current, newItem];
  try {
    localStorage.setItem(key, JSON.stringify(updated));
    window.dispatchEvent(new Event(eventName));
    window.dispatchEvent(new Event("rewaa_custom_categories_updated"));
  } catch (err) {
    console.error(`Failed to save to localStorage key "${key}":`, err);
  }

  return newItem;
}

// ── Question Kinds ────────────────────────────────────────────────────────────

export function getStoredCustomQuestionKinds(): CustomCategoryItem[] {
  return getStoredItems(QUESTION_KINDS_KEY);
}

export function saveStoredCustomQuestionKind(name: string): CustomCategoryItem {
  return saveStoredItem(QUESTION_KINDS_KEY, name, "rewaa_question_kinds_updated");
}

// ── Exam Categories ───────────────────────────────────────────────────────────

export function getStoredCustomExamCategories(): CustomCategoryItem[] {
  return getStoredItems(EXAM_CATEGORIES_KEY);
}

export function saveStoredCustomExamCategory(name: string): CustomCategoryItem {
  return saveStoredItem(EXAM_CATEGORIES_KEY, name, "rewaa_exam_categories_updated");
}

// ── Registration Types ────────────────────────────────────────────────────────

export function getStoredCustomRegistrationTypes(): CustomCategoryItem[] {
  return getStoredItems(REGISTRATION_TYPES_KEY);
}

export function saveStoredCustomRegistrationType(name: string): CustomCategoryItem {
  return saveStoredItem(REGISTRATION_TYPES_KEY, name, "rewaa_registration_types_updated");
}

// ── Transaction Types ─────────────────────────────────────────────────────────

export function getStoredCustomTransactionTypes(): CustomCategoryItem[] {
  return getStoredItems(TRANSACTION_TYPES_KEY);
}

export function saveStoredCustomTransactionType(name: string): CustomCategoryItem {
  return saveStoredItem(TRANSACTION_TYPES_KEY, name, "rewaa_transaction_types_updated");
}

// ── Custom Sections ───────────────────────────────────────────────────────────

export function getStoredCustomSections(contextKey?: string): CustomCategoryItem[] {
  const key = contextKey ? `${CUSTOM_SECTIONS_KEY}_${contextKey}` : CUSTOM_SECTIONS_KEY;
  return getStoredItems(key);
}

export function saveStoredCustomSection(name: string, contextKey?: string): CustomCategoryItem {
  const key = contextKey ? `${CUSTOM_SECTIONS_KEY}_${contextKey}` : CUSTOM_SECTIONS_KEY;
  return saveStoredItem(key, name, "rewaa_custom_sections_updated");
}
