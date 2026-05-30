import type { Familiarity } from "../types";

type FamiliarityBadgeProps = {
  familiarity: Familiarity;
};

const badgeStyles: Record<Familiarity, string> = {
  New: "border-sky-400/40 bg-sky-500/15 text-sky-100",
  "Seen a few times": "border-amber-400/40 bg-amber-500/15 text-amber-100",
  "Almost learned": "border-violet-400/50 bg-violet-500/20 text-violet-100",
  Learned: "border-emerald-400/50 bg-emerald-500/20 text-emerald-100"
};

export function FamiliarityBadge({ familiarity }: FamiliarityBadgeProps) {
  return (
    <span
      className={`inline-flex max-w-full items-center rounded-full border px-3 py-1 text-xs font-bold ${badgeStyles[familiarity]}`}
    >
      <span className="min-w-0 break-words">{familiarity}</span>
    </span>
  );
}
