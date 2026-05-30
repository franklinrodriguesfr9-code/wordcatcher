import type { WordEntry } from "../types";

const storageKey = "wordcatcher.words.v1";

export function loadStoredWords(): WordEntry[] {
  try {
    const rawValue = localStorage.getItem(storageKey);
    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue);
    return Array.isArray(parsedValue) ? (parsedValue as WordEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveStoredWords(words: WordEntry[]): void {
  localStorage.setItem(storageKey, JSON.stringify(words));
}

export function clearStoredWords(): void {
  localStorage.removeItem(storageKey);
}
