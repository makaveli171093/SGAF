import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ToastContext, type ToastKind } from "../../hooks/useToast";
type Toast = { id: number; kind: ToastKind; text: string };
export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const notify = useCallback((text: string, kind: ToastKind = "info") => {
    const id = ++counter.current;
    setToasts(current => [...current, { id, kind, text }].slice(-3));
    timers.current.push(setTimeout(() => setToasts(current => current.filter(t => t.id !== id)), 5000));
  }, []);
  return <ToastContext.Provider value={notify}>
    {children}
    <div className="fixed bottom-4 right-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2" aria-label="Notificaciones">
      {toasts.map(toast => <div key={toast.id} role={toast.kind === "error" ? "alert" : "status"} className={`rounded-xl border bg-surface p-4 shadow-lg ${toast.kind === "error" ? "border-danger text-danger" : toast.kind === "success" ? "border-success text-success" : "border-border text-ink"}`}>
        <div className="flex items-start justify-between gap-3"><p className="text-sm font-medium">{toast.text}</p><button type="button" aria-label="Cerrar notificación" className="px-1 font-bold" onClick={() => setToasts(current => current.filter(t=>t.id!==toast.id))}>×</button></div>
      </div>)}
    </div>
  </ToastContext.Provider>;
}
