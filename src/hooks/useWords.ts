import { useEffect, useMemo, useState } from "react";
import type { Familiarity, WordDraft, WordEntry } from "../types";
import { createWordEntry, sortWords, updateWordEntry, validateWord } from "../utils/words";
import { loadStoredWords, saveStoredWords } from "../utils/storage";

type WordActionResult = { ok: true } | { ok: false; message: string };

export function useWords() {
  const [words, setWords] = useState<WordEntry[]>(() => sortWords(loadStoredWords()));
  const [storageError, setStorageError] = useState("");

  useEffect(() => {
    try {
      saveStoredWords(words);
      setStorageError("");
    } catch {
      setStorageError("Words could not be saved in this browser.");
    }
  }, [words]);

  const sortedWords = useMemo(() => sortWords(words), [words]);

  function addWord(draft: WordDraft): WordActionResult {
    const validation = validateWord(draft, words);

    if (!validation.ok) {
      return validation;
    }

    setWords((currentWords) => sortWords([createWordEntry(draft), ...currentWords]));
    return { ok: true };
  }

  function editWord(id: string, draft: WordDraft): WordActionResult {
    const validation = validateWord(draft, words, id);

    if (!validation.ok) {
      return validation;
    }

    setWords((currentWords) =>
      sortWords(
        currentWords.map((word) => (word.id === id ? updateWordEntry(word, draft) : word))
      )
    );
    return { ok: true };
  }

  function deleteWord(id: string): void {
    setWords((currentWords) => currentWords.filter((word) => word.id !== id));
  }

  function setFamiliarity(id: string, familiarity: Familiarity): void {
    setWords((currentWords) =>
      sortWords(
        currentWords.map((word) =>
          word.id === id ? { ...word, familiarity, updatedAt: new Date().toISOString() } : word
        )
      )
    );
  }

  function replaceWords(nextWords: WordEntry[]): void {
    setWords(sortWords(nextWords));
  }

  return {
    words: sortedWords,
    addWord,
    editWord,
    deleteWord,
    setFamiliarity,
    replaceWords,
    storageError
  };
}
