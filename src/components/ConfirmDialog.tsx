import type { ReactNode } from "react";
import { Button } from "./Button";

type ConfirmDialogProps = {
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  children?: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  children,
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center" role="presentation">
      <div
        aria-modal="true"
        className="w-full max-w-lg rounded-xl border border-ink-800 bg-ink-900 p-5 shadow-2xl"
        role="dialog"
      >
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <p className="text-sm leading-6 text-slate-300">{description}</p>
          {children}
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Button onClick={onConfirm}>{confirmLabel}</Button>
          <Button onClick={onCancel} variant="secondary">
            {cancelLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
