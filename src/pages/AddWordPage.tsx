import { FormEvent, useState } from "react";
import { Save } from "lucide-react";
import { Button } from "../components/Button";
import { FieldLabel, SelectInput, TextInput } from "../components/FormControls";
import { Message } from "../components/Message";
import { familiarityLevels, type Familiarity, type WordDraft } from "../types";

type AddWordPageProps = {
  onAddWord: (draft: WordDraft) => { ok: true } | { ok: false; message: string };
};

const emptyDraft: WordDraft = {
  english: "",
  portuguese: "",
  familiarity: "New"
};

export function AddWordPage({ onAddWord }: AddWordPageProps) {
  const [draft, setDraft] = useState<WordDraft>(emptyDraft);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"success" | "error">("success");

  function updateDraft(field: keyof WordDraft, value: string) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [field]: value
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = onAddWord(draft);

    if (!result.ok) {
      setMessageTone("error");
      setMessage(result.message);
      return;
    }

    setDraft(emptyDraft);
    setMessageTone("success");
    setMessage("Word saved.");
  }

  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-4 py-6 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold tracking-normal text-white">Add Word</h1>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Save a word you keep hearing and want to practice later.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <FieldLabel htmlFor="english">English word</FieldLabel>
          <TextInput
            autoComplete="off"
            id="english"
            onChange={(event) => updateDraft("english", event.target.value)}
            placeholder="house"
            value={draft.english}
          />
        </div>

        <div className="space-y-2">
          <FieldLabel htmlFor="portuguese">Portuguese translation</FieldLabel>
          <TextInput
            autoComplete="off"
            id="portuguese"
            onChange={(event) => updateDraft("portuguese", event.target.value)}
            placeholder="translation"
            value={draft.portuguese}
          />
        </div>

        <div className="space-y-2">
          <FieldLabel htmlFor="familiarity">Familiarity level</FieldLabel>
          <SelectInput
            id="familiarity"
            onChange={(event) => updateDraft("familiarity", event.target.value as Familiarity)}
            value={draft.familiarity}
          >
            {familiarityLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </SelectInput>
        </div>

        <Button className="w-full sm:w-auto" type="submit">
          <Save aria-hidden="true" size={18} />
          Save Word
        </Button>
      </form>

      <Message message={message} tone={messageTone} />
    </section>
  );
}
