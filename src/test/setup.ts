import "@testing-library/jest-dom/vitest";
import { beforeEach, vi } from "vitest";
import { clearStoredWords } from "../utils/storage";

beforeEach(() => {
  clearStoredWords();
  vi.restoreAllMocks();
});
