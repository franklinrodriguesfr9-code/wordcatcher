import { DatabaseBackup, ListChecks, PenLine, ScrollText } from "lucide-react";

export type TabKey = "add" | "list" | "prompt" | "backup";

type TabNavigationProps = {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
};

const tabs = [
  { key: "add", label: "Add Word", icon: PenLine },
  { key: "list", label: "Word List", icon: ListChecks },
  { key: "prompt", label: "Review Prompt", icon: ScrollText },
  { key: "backup", label: "Backup", icon: DatabaseBackup }
] as const;

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <nav aria-label="Main navigation" className="sticky top-0 z-20 border-b border-ink-800 bg-ink-950/95 backdrop-blur">
      <div className="mx-auto grid max-w-5xl grid-cols-4 gap-1 px-3 py-2 sm:gap-2 sm:px-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              aria-current={isActive ? "page" : undefined}
              className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg px-1.5 py-2 text-[0.72rem] font-semibold transition sm:min-h-12 sm:flex-row sm:text-sm ${
                isActive
                  ? "bg-violet-600 text-white"
                  : "text-slate-300 hover:bg-ink-850 hover:text-white"
              }`}
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              type="button"
            >
              <Icon aria-hidden="true" size={18} strokeWidth={2.2} />
              <span className="max-w-full text-center leading-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
