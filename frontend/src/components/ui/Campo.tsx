import type { ReactNode } from "react";

export function Campo({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="block text-xs font-mono uppercase tracking-widest text-stone-600">
        {label}
      </span>
      {children}
      {hint && (
        <span className="block text-[10px] font-mono text-stone-400">
          {hint}
        </span>
      )}
    </label>
  );
}
