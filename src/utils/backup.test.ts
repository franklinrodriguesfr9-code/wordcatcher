import { describe, expect, it } from "vitest";
import type { WordEntry } from "../types";
import { createBackupFileName, exportWords, importWords, parseBackupFile } from "./backup";

const currentWords: WordEntry[] = [
  {
    id: "word-1",
    english: "house",
    portuguese: "home meaning",
    familiarity: "New",
    createdAt: "2026-05-29T22:00:00.000Z",
    updatedAt: "2026-05-29T22:00:00.000Z"
  },
  {
    id: "word-2",
    english: "book",
    portuguese: "reading item",
    familiarity: "Seen a few times",
    createdAt: "2026-05-29T22:10:00.000Z",
    updatedAt: "2026-05-29T22:10:00.000Z"
  }
];

const importedWords: WordEntry[] = [
  {
    id: "import-1",
    english: "HOUSE",
    portuguese: "dwelling meaning",
    familiarity: "Almost learned",
    createdAt: "2026-05-29T23:00:00.000Z",
    updatedAt: "2026-05-29T23:00:00.000Z"
  },
  {
    id: "import-2",
    english: "music",
    portuguese: "sound art",
    familiarity: "New",
    createdAt: "2026-05-29T23:10:00.000Z",
    updatedAt: "2026-05-29T23:10:00.000Z"
  }
];

describe("backup utilities", () => {
  it("exports words to a valid JSON shape", () => {
    const backup = exportWords(currentWords, "Mobile", new Date("2026-05-29T22:15:00.000Z"));

    expect(backup).toEqual({
      app: "WordCatcher",
      version: 1,
      exportedAt: "2026-05-29T22:15:00.000Z",
      deviceOrigin: "Mobile",
      words: currentWords
    });
    expect(createBackupFileName("Mobile", new Date("2026-05-29T22:15:00"))).toBe(
      "wordcatcher-mobile-2026-05-29-22-15.json"
    );
  });

  it("imports by replacing all words", () => {
    expect(importWords(currentWords, importedWords, "replace")).toEqual(importedWords);
  });

  it("imports by keeping current words and adding only new words", () => {
    const result = importWords(currentWords, importedWords, "add-new");

    expect(result).toHaveLength(3);
    expect(result.find((word) => word.english === "house")?.portuguese).toBe("home meaning");
    expect(result.find((word) => word.english === "music")?.portuguese).toBe("sound art");
  });

  it("imports by merging and updating existing words", () => {
    const result = importWords(currentWords, importedWords, "merge");

    expect(result).toHaveLength(3);
    expect(result.find((word) => word.english === "HOUSE")?.portuguese).toBe("dwelling meaning");
    expect(result.find((word) => word.english === "HOUSE")?.id).toBe("word-1");
  });

  it("blocks an invalid backup file", () => {
    expect(parseBackupFile({ app: "OtherApp", version: 1, words: [] })).toBeNull();
  });
});
