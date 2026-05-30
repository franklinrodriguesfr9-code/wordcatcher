import { ChangeEvent, useRef, useState } from "react";
import { Download, Upload } from "lucide-react";
import { Button } from "../components/Button";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { FieldLabel, SelectInput } from "../components/FormControls";
import { Message } from "../components/Message";
import type { BackupFile, DeviceOrigin, ImportMode, WordEntry } from "../types";
import { downloadBackup, importWords, parseBackupFile } from "../utils/backup";

type BackupPageProps = {
  words: WordEntry[];
  onReplaceWords: (words: WordEntry[]) => void;
};

const importModeLabels: Record<ImportMode, string> = {
  merge: "Merge and update existing words",
  "add-new": "Keep current and add new words only",
  replace: "Replace all words"
};

const importModeDescriptions: Record<ImportMode, string> = {
  merge: "Keep current words, add new words, and update existing words with imported data.",
  "add-new": "Keep current words and add only words that do not already exist.",
  replace: "Delete all current words and replace them with the imported file."
};

export function BackupPage({ words, onReplaceWords }: BackupPageProps) {
  const [deviceOrigin, setDeviceOrigin] = useState<DeviceOrigin>("Mobile");
  const [pendingBackup, setPendingBackup] = useState<BackupFile | null>(null);
  const [importMode, setImportMode] = useState<ImportMode>("merge");
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"success" | "error" | "info">("info");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleExport() {
    downloadBackup(words, deviceOrigin);
    setMessageTone("success");
    setMessage("Words exported.");
  }

  async function handleImportFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith(".json")) {
      setMessageTone("error");
      setMessage("Invalid backup file.");
      return;
    }

    try {
      const fileText = await file.text();
      const parsedValue = JSON.parse(fileText);
      const backup = parseBackupFile(parsedValue);

      if (!backup) {
        setMessageTone("error");
        setMessage("Invalid backup file.");
        return;
      }

      setImportMode("merge");
      setPendingBackup(backup);
      setMessage("");
    } catch {
      setMessageTone("error");
      setMessage("Invalid backup file.");
    }
  }

  function confirmImport() {
    if (!pendingBackup) {
      return;
    }

    onReplaceWords(importWords(words, pendingBackup.words, importMode));
    setPendingBackup(null);
    setMessageTone("success");
    setMessage("Words imported.");
  }

  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-4 py-6 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold tracking-normal text-white">Backup</h1>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Export or import your local WordCatcher words.
        </p>
      </div>

      <div className="space-y-2">
        <FieldLabel htmlFor="device-origin">Device origin</FieldLabel>
        <SelectInput
          id="device-origin"
          onChange={(event) => setDeviceOrigin(event.target.value as DeviceOrigin)}
          value={deviceOrigin}
        >
          <option value="Mobile">Mobile</option>
          <option value="Notebook">Notebook</option>
        </SelectInput>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button onClick={handleExport}>
          <Download aria-hidden="true" size={18} />
          Export Words
        </Button>
        <Button onClick={() => fileInputRef.current?.click()} variant="secondary">
          <Upload aria-hidden="true" size={18} />
          Import Words
        </Button>
      </div>

      <input
        accept="application/json,.json"
        className="hidden"
        onChange={handleImportFile}
        ref={fileInputRef}
        type="file"
      />

      <Message message={message} tone={messageTone} />

      {pendingBackup ? (
        <ConfirmDialog
          confirmLabel="Import Words"
          description="Choose how WordCatcher should handle the imported backup."
          onCancel={() => setPendingBackup(null)}
          onConfirm={confirmImport}
          title="Import backup"
        >
          <div className="space-y-3">
            {(Object.keys(importModeLabels) as ImportMode[]).map((mode) => (
              <label
                className={`block rounded-lg border p-3 ${
                  importMode === mode
                    ? "border-violet-400 bg-violet-500/15"
                    : "border-ink-800 bg-ink-850"
                }`}
                key={mode}
              >
                <span className="flex items-start gap-3">
                  <input
                    checked={importMode === mode}
                    className="mt-1 h-5 w-5 accent-violet-500"
                    onChange={() => setImportMode(mode)}
                    type="radio"
                  />
                  <span className="space-y-1">
                    <span className="block text-sm font-bold text-white">
                      {importModeLabels[mode]}
                      {mode === "merge" ? " (Recommended)" : ""}
                    </span>
                    <span className="block text-sm leading-5 text-slate-300">
                      {importModeDescriptions[mode]}
                    </span>
                  </span>
                </span>
              </label>
            ))}
          </div>
        </ConfirmDialog>
      ) : null}
    </section>
  );
}
