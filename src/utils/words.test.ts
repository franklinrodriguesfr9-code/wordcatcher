import { describe, expect, it, vi } from "vitest";
import type { WordEntry } from "../types";
import { createWordEntry, updateWordEntry, validateWord } from "./words";

const baseWord: WordEntry = {
  id: "word-1",
  english: "house",
  portuguese: "home meaning",
  familiarity: "New",
  createdAt: "2026-05-29T22:00:00.000Z",
  updatedAt: "2026-05-29T22:00:00.000Z"
};

describe("word utilities", () => {
  it("adds a valid word", () => {
    vi.stubGlobal("crypto", { randomUUID: () => "word-2" });

    const word = createWordEntry(
      { english: "  book ", portuguese: " reading item ", familiarity: "Seen a few times" },
      new Date("2026-05-29T22:15:00.000Z")
    );

    expect(word).toEqual({
      id: "word-2",
      english: "book",
      portuguese: "reading item",
      familiarity: "Seen a few times",
      createdAt: "2026-05-29T22:15:00.000Z",
      updatedAt: "2026-05-29T22:15:00.000Z"
    });
  });

  it("blocks an empty English word", () => {
    expect(validateWord({ english: " ", portuguese: "home meaning", familiarity: "New" }, [])).toEqual({
      ok: false,
      message: "English word is required."
    });
  });

  it("blocks an empty Portuguese translation", () => {
    expect(validateWord({ english: "house", portuguese: " ", familiarity: "New" }, [])).toEqual({
      ok: false,
      message: "Portuguese translation is required."
    });
  });

  it("blocks duplicate words while ignoring case and edge spaces", () => {
    expect(
      validateWord({ english: " HOUSE ", portuguese: "dwelling meaning", familiarity: "New" }, [baseWord])
    ).toEqual({
      ok: false,
      message: "This word already exists."
    });
  });

  it("edits a word successfully", () => {
    expect(
      updateWordEntry(
        baseWord,
        { english: "home", portuguese: "dwelling meaning", familiarity: "Almost learned" },
        new Date("2026-05-29T22:30:00.000Z")
      )
    ).toEqual({
      ...baseWord,
      english: "home",
      portuguese: "dwelling meaning",
      familiarity: "Almost learned",
      updatedAt: "2026-05-29T22:30:00.000Z"
    });
  });

  it("blocks editing when it creates a duplicate", () => {
    const words: WordEntry[] = [
      baseWord,
      { ...baseWord, id: "word-2", english: "book", portuguese: "reading item" }
    ];

    expect(
      validateWord({ english: " HOUSE ", portuguese: "dwelling meaning", familiarity: "New" }, words, "word-2")
    ).toEqual({
      ok: false,
      message: "This word already exists."
    });
  });
});
