import { useState } from "react";
import { AddWordPage } from "./pages/AddWordPage";
import { BackupPage } from "./pages/BackupPage";
import { ReviewPromptPage } from "./pages/ReviewPromptPage";
import { WordListPage } from "./pages/WordListPage";
import { TabNavigation, type TabKey } from "./components/TabNavigation";
import { Message } from "./components/Message";
import { useWords } from "./hooks/useWords";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("add");
  const { words, addWord, editWord, deleteWord, setFamiliarity, replaceWords, storageError } = useWords();

  return (
    <div className="min-h-screen overflow-x-hidden bg-ink-950 text-slate-100">
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main>
        {storageError ? (
          <div className="mx-auto max-w-5xl px-4 pt-4 sm:px-6">
            <Message message={storageError} tone="error" />
          </div>
        ) : null}

        {activeTab === "add" ? <AddWordPage onAddWord={addWord} /> : null}

        {activeTab === "list" ? (
          <WordListPage
            onDeleteWord={deleteWord}
            onEditWord={editWord}
            onSetFamiliarity={setFamiliarity}
            words={words}
          />
        ) : null}

        {activeTab === "prompt" ? <ReviewPromptPage words={words} /> : null}

        {activeTab === "backup" ? <BackupPage onReplaceWords={replaceWords} words={words} /> : null}
      </main>
    </div>
  );
}
