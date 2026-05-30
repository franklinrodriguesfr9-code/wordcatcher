import { familiarityLevels, type Familiarity, type WordDraft, type WordEntry } from "../types";

export type WordValidationResult =
  | { ok: true }
  | { ok: false; message: string };

const duplicateMessage = "This word already exists.";

export function normalizeWord(value: string): string {
  return value.trim().toLowerCase();
}

export function isFamiliarity(value: unknown): value is Familiarity {
  return typeof value === "string" && familiarityLevels.includes(value as Familiarity);
}

export function validateWord(
  draft: WordDraft,
  existingWords: WordEntry[],
  currentWordId?: string
): WordValidationResult {
  const english = draft.english.trim();
  const portuguese = draft.portuguese.trim();

  if (!english) {
    return { ok: false, message: "English word is required." };
  }

  if (!portuguese) {
    return { ok: false, message: "Portuguese translation is required." };
  }

  const normalizedDraft = normalizeWord(english);
  const duplicate = existingWords.some(
    (word) => word.id !== currentWordId && normalizeWord(word.english) === normalizedDraft
  );

  if (duplicate) {
    return { ok: false, message: duplicateMessage };
  }

  return { ok: true };
}

export function createWordEntry(draft: WordDraft, now = new Date()): WordEntry {
  const timestamp = now.toISOString();

  return {
    id: crypto.randomUUID(),
    english: draft.english.trim(),
    portuguese: draft.portuguese.trim(),
    familiarity: draft.familiarity,
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

export function updateWordEntry(
  word: WordEntry,
  draft: WordDraft,
  now = new Date()
): WordEntry {
  return {
    ...word,
    english: draft.english.trim(),
    portuguese: draft.portuguese.trim(),
    familiarity: draft.familiarity,
    updatedAt: now.toISOString()
  };
}

export function sortWords(words: WordEntry[]): WordEntry[] {
  return [...words].sort((first, second) => second.updatedAt.localeCompare(first.updatedAt));
}
