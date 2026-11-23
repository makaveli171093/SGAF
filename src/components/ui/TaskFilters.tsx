import type { ReactNode } from "react";
export function FilterField({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block min-w-0 text-sm font-medium text-ink"><span className="block mb-1">{label}</span>{children}</label>;
}
export const filterInputClass = "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink focus-visible:outline-2 focus-visible:outline-brand";
