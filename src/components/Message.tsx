type MessageProps = {
  message: string;
  tone?: "success" | "error" | "info";
};

const messageStyles = {
  success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-100",
  error: "border-rose-500/40 bg-rose-500/10 text-rose-100",
  info: "border-slate-500/40 bg-slate-500/10 text-slate-100"
};

export function Message({ message, tone = "info" }: MessageProps) {
  if (!message) {
    return null;
  }

  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${messageStyles[tone]}`} role="status">
      {message}
    </div>
  );
}
