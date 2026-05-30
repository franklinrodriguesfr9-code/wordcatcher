import { useMemo, useState } from "react";
import { CheckSquare, Clipboard, FileText } from "lucide-react";
import { Button } from "../components/Button";
import { FamiliarityBadge } from "../components/FamiliarityBadge";
import { FieldLabel, SelectInput, TextAreaInput } from "../components/FormControls";
import { Message } from "../components/Message";
import { familiarityLevels, type Familiarity, type WordEntry } from "../types";
import { generatePrompt } from "../utils/prompt";

type ReviewPromptPageProps = {
  words: WordEntry[];
};

export function ReviewPromptPage({ words }: ReviewPromptPageProps) {
  const [filter, setFilter] = useState<Familiarity | "All">("All");
  const [includeLearned, setIncludeLearned] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [prompt, setPrompt] = useState("");
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"success" | "error" | "info">("info");

  const selectableWords = useMemo(() => {
    return words.filter((word) => {
      const matchesFilter = filter === "All" || word.familiarity === filter;
      const matchesLearned = includeLearned || word.familiarity !== "Learned";
      return matchesFilter && matchesLearned;
    });
  }, [filter, includeLearned, words]);

  const selectedWords = useMemo(
    () => words.filter((word) => selectedIds.has(word.id)),
    [selectedIds, words]
  );

  function toggleWord(id: string) {
    setSelectedIds((currentIds) => {
      const nextIds = new Set(currentIds);
      if (nextIds.has(id)) {
        nextIds.delete(id);
      } else {
        nextIds.add(id);
      }
      return nextIds;
    });
  }

  function selectAllVisible() {
    setSelectedIds(new Set(selectableWords.map((word) => word.id)));
  }

  function selectAllNotLearned() {
    setSelectedIds(new Set(words.filter((word) => word.familiarity !== "Learned").map((word) => word.id)));
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  function handleGeneratePrompt() {
    if (selectedWords.length === 0) {
      setPrompt("");
      setMessageTone("error");
      setMessage("Select at least one word.");
      return;
    }

    setPrompt(generatePrompt(selectedWords));
    setMessageTone("success");
    setMessage("Prompt generated.");
  }

  async function copyPrompt() {
    if (!prompt) {
      return;
    }

    await navigator.clipboard.writeText(prompt);
    setMessageTone("success");
    setMessage("Prompt copied.");
  }

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-6 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold tracking-normal text-white">Review Prompt</h1>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Pick words and create a study prompt for ChatGPT.
        </p>
      </div>

      <div className="grid gap-3 rounded-lg border border-ink-800 bg-ink-900 p-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="space-y-2">
          <FieldLabel htmlFor="prompt-filter">Filter before selecting</FieldLabel>
          <SelectInput id="prompt-filter" onChange={(event) => setFilter(event.target.value as Familiarity | "All")} value={filter}>
            <option value="All">All non-learned levels</option>
            {familiarityLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </SelectInput>
        </div>

        <label className="flex min-h-11 items-center gap-3 rounded-lg border border-ink-800 bg-ink-850 px-3 py-2 text-sm font-semibold text-slate-200">
          <input
            checked={includeLearned}
            className="h-5 w-5 accent-violet-500"
            onChange={(event) => setIncludeLearned(event.target.checked)}
            type="checkbox"
          />
          Include Learned
        </label>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <Button onClick={selectAllNotLearned} variant="secondary">
          <CheckSquare aria-hidden="true" size={17} />
          Select All Not Learned
        </Button>
        <Button onClick={selectAllVisible} variant="secondary">
          Select Visible
        </Button>
        <Button onClick={clearSelection} variant="ghost">
          Clear Selection
        </Button>
      </div>

      <div className="grid gap-3">
        {selectableWords.length === 0 ? (
          <div className="rounded-lg border border-ink-800 bg-ink-900 p-5 text-sm leading-6 text-slate-300">
            No words available for this filter.
          </div>
        ) : (
          selectableWords.map((word) => (
            <label
              className="flex min-w-0 items-start gap-3 rounded-lg border border-ink-800 bg-ink-900 p-4"
              key={word.id}
            >
              <input
                checked={selectedIds.has(word.id)}
                className="mt-1 h-5 w-5 shrink-0 accent-violet-500"
                onChange={() => toggleWord(word.id)}
                type="checkbox"
              />
              <span className="min-w-0 flex-1 space-y-2">
                <span className="block break-words text-base font-bold text-white">{word.english}</span>
                <span className="block break-words text-sm leading-6 text-slate-300">{word.portuguese}</span>
              </span>
              <FamiliarityBadge familiarity={word.familiarity} />
            </label>
          ))
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-[auto_auto_1fr]">
        <Button onClick={handleGeneratePrompt}>
          <FileText aria-hidden="true" size={18} />
          Generate Prompt
        </Button>
        <Button disabled={!prompt} onClick={copyPrompt} variant="secondary">
          <Clipboard aria-hidden="true" size={18} />
          Copy Prompt
        </Button>
        <div className="text-sm text-slate-400 sm:self-center">{selectedWords.length} selected</div>
      </div>

      <Message message={message} tone={messageTone} />

      <div className="space-y-2">
        <FieldLabel htmlFor="generated-prompt">Generated prompt</FieldLabel>
        <TextAreaInput id="generated-prompt" readOnly value={prompt} />
      </div>
    </section>
  );
}
