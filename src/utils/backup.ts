import type { BackupFile, DeviceOrigin, ImportMode, WordEntry } from "../types";
import { isFamiliarity, normalizeWord } from "./words";

function padDatePart(value: number): string {
  return value.toString().padStart(2, "0");
}

export function createBackupFileName(origin: DeviceOrigin, date = new Date()): string {
  const year = date.getFullYear();
  const month = padDatePart(date.getMonth() + 1);
  const day = padDatePart(date.getDate());
  const hour = padDatePart(date.getHours());
  const minute = padDatePart(date.getMinutes());

  return `wordcatcher-${origin.toLowerCase()}-${year}-${month}-${day}-${hour}-${minute}.json`;
}

export function exportWords(
  words: WordEntry[],
  deviceOrigin: DeviceOrigin,
  exportedAt = new Date()
): BackupFile {
  return {
    app: "WordCatcher",
    version: 1,
    exportedAt: exportedAt.toISOString(),
    deviceOrigin,
    words
  };
}

export function downloadBackup(words: WordEntry[], deviceOrigin: DeviceOrigin): void {
  const backup = exportWords(words, deviceOrigin);
  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = createBackupFileName(deviceOrigin);
  anchor.click();
  URL.revokeObjectURL(url);
}

function isWordEntry(value: unknown): value is WordEntry {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as WordEntry;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.english === "string" &&
    typeof candidate.portuguese === "string" &&
    isFamiliarity(candidate.familiarity) &&
    typeof candidate.createdAt === "string" &&
    typeof candidate.updatedAt === "string"
  );
}

export function parseBackupFile(value: unknown): BackupFile | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as BackupFile;
  const hasValidOrigin = candidate.deviceOrigin === "Mobile" || candidate.deviceOrigin === "Notebook";
  const hasValidWords = Array.isArray(candidate.words) && candidate.words.every(isWordEntry);

  if (
    candidate.app !== "WordCatcher" ||
    candidate.version !== 1 ||
    typeof candidate.exportedAt !== "string" ||
    !hasValidOrigin ||
    !hasValidWords
  ) {
    return null;
  }

  return candidate;
}

export function importWords(
  currentWords: WordEntry[],
  importedWords: WordEntry[],
  mode: ImportMode
): WordEntry[] {
  if (mode === "replace") {
    return dedupeImportedWords(importedWords);
  }

  const wordMap = new Map<string, WordEntry>();
  currentWords.forEach((word) => wordMap.set(normalizeWord(word.english), word));

  importedWords.forEach((word) => {
    const key = normalizeWord(word.english);
    const existingWord = wordMap.get(key);

    if (!existingWord) {
      wordMap.set(key, word);
      return;
    }

    if (mode === "merge") {
      wordMap.set(key, {
        ...existingWord,
        ...word,
        id: existingWord.id,
        createdAt: existingWord.createdAt
      });
    }
  });

  return Array.from(wordMap.values());
}

function dedupeImportedWords(words: WordEntry[]): WordEntry[] {
  const wordMap = new Map<string, WordEntry>();
  words.forEach((word) => {
    wordMap.set(normalizeWord(word.english), word);
  });
  return Array.from(wordMap.values());
}
