import { describe, expect, it } from "vitest";
import type { WordEntry } from "../types";
import { generatePrompt } from "./prompt";

const words: WordEntry[] = [
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
    familiarity: "Almost learned",
    createdAt: "2026-05-29T22:10:00.000Z",
    updatedAt: "2026-05-29T22:10:00.000Z"
  }
];

describe("generatePrompt", () => {
  it("generates a prompt for one word", () => {
    const prompt = generatePrompt([words[0]]);

    expect(prompt).toContain("Help me learn the English word 'house'");
    expect(prompt).toContain("which means 'home meaning' in Portuguese");
    expect(prompt).toContain("One short and easy sentence I can repeat out loud");
  });

  it("generates a prompt for multiple words", () => {
    const prompt = generatePrompt(words);

    expect(prompt).toContain("Help me learn these English words");
    expect(prompt).toContain("1. 'house', which means 'home meaning' in Portuguese.");
    expect(prompt).toContain("2. 'book', which means 'reading item' in Portuguese.");
  });
});
