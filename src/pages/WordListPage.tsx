import { FormEvent, useMemo, useState } from "react";
import { Check, Pencil, RotateCcw, Search, Trash2 } from "lucide-react";
import { Button } from "../components/Button";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { FamiliarityBadge } from "../components/FamiliarityBadge";
import { FieldLabel, SelectInput, TextInput } from "../components/FormControls";
import { Message } from "../components/Message";
import { familiarityLevels, type Familiarity, type WordDraft, type WordEntry } from "../types";

type WordListPageProps = {
  words: WordEntry[];
  onEditWord: (id: string, draft: WordDraft) => { ok: true } | { ok: false; message: string };
  onDeleteWord: (id: string) => void;
  onSetFamiliarity: (id: string, familiarity: Familiarity) => void;
};

type DeleteTarget = {
  id: string;
  english: string;
} | null;

export function WordListPage({
  words,
  onEditWord,
  onDeleteWord,
  onSetFamiliarity
}: WordListPageProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Familiarity | "All">("All");
  const [editingWordId, setEditingWordId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState<WordDraft | null>(null);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"success" | "error" | "info">("info");
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);

  const visibleWords = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return words.filter((word) => {
      const matchesFilter = filter === "All" || word.familiarity === filter;
      const matchesQuery =
        !normalizedQuery ||
        word.english.toLowerCase().includes(normalizedQuery) ||
        word.portuguese.toLowerCase().includes(normalizedQuery);

      return matchesFilter && matchesQuery;
    });
  }, [filter, query, words]);

  function beginEdit(word: WordEntry) {
    setEditingWordId(word.id);
    setEditingDraft({
      english: word.english,
      portuguese: word.portuguese,
      familiarity: word.familiarity
    });
    setMessage("");
  }

  function cancelEdit() {
    setEditingWordId(null);
    setEditingDraft(null);
  }

  function handleEditSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingWordId || !editingDraft) {
      return;
    }

    const result = onEditWord(editingWordId, editingDraft);

    if (!result.ok) {
      setMessageTone("error");
      setMessage(result.message);
      return;
    }

    cancelEdit();
    setMessageTone("success");
    setMessage("Word updated.");
  }

  function confirmDelete() {
    if (!deleteTarget) {
      return;
    }

    onDeleteWord(deleteTarget.id);
    setDeleteTarget(null);
    setMessageTone("success");
    setMessage("Word deleted.");
  }

  function markAsLearned(word: WordEntry) {
    onSetFamiliarity(word.id, "Learned");
    setMessageTone("success");
    setMessage("Word marked as learned.");
  }

  function moveBackToReview(word: WordEntry) {
    onSetFamiliarity(word.id, "Almost learned");
    setMessageTone("success");
    setMessage("Word moved back to review.");
  }

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-6 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold tracking-normal text-white">Word List</h1>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Review, edit, and organize every saved word.
        </p>
      </div>

      <div className="grid gap-3 rounded-lg border border-ink-800 bg-ink-900 p-4 sm:grid-cols-[1fr_220px]">
        <div className="space-y-2">
          <FieldLabel htmlFor="word-search">Search</FieldLabel>
          <div className="relative">
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-3 text-slate-500" size={18} />
            <TextInput
              id="word-search"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search words"
              value={query}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <FieldLabel htmlFor="word-filter">Filter</FieldLabel>
          <SelectInput id="word-filter" onChange={(event) => setFilter(event.target.value as Familiarity | "All")} value={filter}>
            <option value="All">All levels</option>
            {familiarityLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </SelectInput>
        </div>
      </div>

      <Message message={message} tone={messageTone} />

      {visibleWords.length === 0 ? (
        <div className="rounded-lg border border-ink-800 bg-ink-900 p-5 text-sm leading-6 text-slate-300">
          No words found.
        </div>
      ) : (
        <div className="grid gap-4">
          {visibleWords.map((word) => {
            const isEditing = editingWordId === word.id && editingDraft;

            return (
              <article className="overflow-hidden rounded-lg border border-ink-800 bg-ink-900 p-4" key={word.id}>
                {isEditing ? (
                  <form className="space-y-4" onSubmit={handleEditSubmit}>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-2">
                        <FieldLabel htmlFor={`edit-english-${word.id}`}>English word</FieldLabel>
                        <TextInput
                          id={`edit-english-${word.id}`}
                          onChange={(event) =>
                            setEditingDraft((currentDraft) =>
                              currentDraft ? { ...currentDraft, english: event.target.value } : currentDraft
                            )
                          }
                          value={editingDraft.english}
                        />
                      </div>

                      <div className="space-y-2">
                        <FieldLabel htmlFor={`edit-portuguese-${word.id}`}>Portuguese translation</FieldLabel>
                        <TextInput
                          id={`edit-portuguese-${word.id}`}
                          onChange={(event) =>
                            setEditingDraft((currentDraft) =>
                              currentDraft ? { ...currentDraft, portuguese: event.target.value } : currentDraft
                            )
                          }
                          value={editingDraft.portuguese}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <FieldLabel htmlFor={`edit-familiarity-${word.id}`}>Familiarity level</FieldLabel>
                      <SelectInput
                        id={`edit-familiarity-${word.id}`}
                        onChange={(event) =>
                          setEditingDraft((currentDraft) =>
                            currentDraft
                              ? { ...currentDraft, familiarity: event.target.value as Familiarity }
                              : currentDraft
                          )
                        }
                        value={editingDraft.familiarity}
                      >
                        {familiarityLevels.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </SelectInput>
                    </div>

                    <div className="grid gap-3 sm:flex">
                      <Button type="submit">Save Changes</Button>
                      <Button onClick={cancelEdit} variant="secondary">
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 space-y-2">
                        <h2 className="break-words text-xl font-bold text-white">{word.english}</h2>
                        <p className="break-words text-base leading-6 text-slate-300">{word.portuguese}</p>
                      </div>
                      <FamiliarityBadge familiarity={word.familiarity} />
                    </div>

                    <div className="grid gap-2 sm:grid-cols-4">
                      <Button onClick={() => beginEdit(word)} variant="secondary">
                        <Pencil aria-hidden="true" size={17} />
                        Edit
                      </Button>

                      {word.familiarity === "Learned" ? (
                        <Button onClick={() => moveBackToReview(word)} variant="secondary">
                          <RotateCcw aria-hidden="true" size={17} />
                          Move Back to Review
                        </Button>
                      ) : (
                        <Button onClick={() => markAsLearned(word)} variant="secondary">
                          <Check aria-hidden="true" size={17} />
                          Mark as Learned
                        </Button>
                      )}

                      <SelectInput
                        aria-label={`Change familiarity for ${word.english}`}
                        onChange={(event) => onSetFamiliarity(word.id, event.target.value as Familiarity)}
                        value={word.familiarity}
                      >
                        {familiarityLevels.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </SelectInput>

                      <Button onClick={() => setDeleteTarget({ id: word.id, english: word.english })} variant="danger">
                        <Trash2 aria-hidden="true" size={17} />
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {deleteTarget ? (
        <ConfirmDialog
          confirmLabel="Delete Word"
          description={`Delete '${deleteTarget.english}' from WordCatcher? This action cannot be undone.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
          title="Delete word"
        />
      ) : null}
    </section>
  );
}
