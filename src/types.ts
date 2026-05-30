export const familiarityLevels = [
  "New",
  "Seen a few times",
  "Almost learned",
  "Learned"
] as const;

export type Familiarity = (typeof familiarityLevels)[number];

export type WordEntry = {
  id: string;
  english: string;
  portuguese: string;
  familiarity: Familiarity;
  createdAt: string;
  updatedAt: string;
};

export type WordDraft = {
  english: string;
  portuguese: string;
  familiarity: Familiarity;
};

export type DeviceOrigin = "Mobile" | "Notebook";

export type ImportMode = "replace" | "add-new" | "merge";

export type BackupFile = {
  app: "WordCatcher";
  version: 1;
  exportedAt: string;
  deviceOrigin: DeviceOrigin;
  words: WordEntry[];
};
