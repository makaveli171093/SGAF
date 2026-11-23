import { createContext, useContext } from "react";
export type ToastKind = "success" | "error" | "info";
export const ToastContext = createContext<((text: string, kind?: ToastKind) => void) | null>(null);
export function useToast() {
  const notify = useContext(ToastContext);
  if (!notify) throw new Error("useToast requiere ToastProvider");
  return notify;
}
