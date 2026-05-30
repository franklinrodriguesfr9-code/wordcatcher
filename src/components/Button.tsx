import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "border-violet-500 bg-violet-600 text-white shadow-lg shadow-violet-950/20 hover:bg-violet-500 focus-visible:ring-violet-300",
  secondary:
    "border-ink-800 bg-ink-850 text-slate-100 hover:bg-ink-800 focus-visible:ring-slate-300",
  danger:
    "border-rose-500/60 bg-rose-600/15 text-rose-100 hover:bg-rose-600/25 focus-visible:ring-rose-300",
  ghost:
    "border-transparent bg-transparent text-slate-300 hover:bg-ink-850 focus-visible:ring-slate-300"
};

export function Button({ className = "", variant = "primary", type = "button", children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
