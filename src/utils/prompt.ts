import type { WordEntry } from "../types";

function promptForWord(word: WordEntry): string {
  return `Help me learn the English word '${word.english}', which means '${word.portuguese}' in Portuguese.

Explain it in a simple way for a Brazilian beginner learning English.

Please include:

1. The main meaning of the word.
2. An approximate pronunciation using Portuguese sounds.
3. When to use this word.
4. When not to use this word.
5. Simple example sentences in English with Portuguese translation.
6. Common mistakes Brazilians make with this word.
7. Memory tips, associations, or tricks to help me remember this word.
8. One short and easy sentence I can repeat out loud for shadowing practice.`;
}

export function generatePrompt(words: WordEntry[]): string {
  if (words.length === 0) {
    return "";
  }

  if (words.length === 1) {
    return promptForWord(words[0]);
  }

  const wordList = words
    .map((word, index) => `${index + 1}. '${word.english}', which means '${word.portuguese}' in Portuguese.`)
    .join("\n");

  return `Help me learn these English words:

${wordList}

Explain each word in a simple way for a Brazilian beginner learning English.

For each word, please include:

1. The main meaning of the word.
2. An approximate pronunciation using Portuguese sounds.
3. When to use this word.
4. When not to use this word.
5. Simple example sentences in English with Portuguese translation.
6. Common mistakes Brazilians make with this word.
7. Memory tips, associations, or tricks to help me remember this word.
8. One short and easy sentence I can repeat out loud for shadowing practice.`;
}
