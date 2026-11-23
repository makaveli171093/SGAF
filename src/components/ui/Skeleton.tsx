export default function Skeleton({ lines = 3 }: { lines?: number }) {
  return <div role="status" aria-label="Cargando contenido" className="space-y-4" aria-busy="true">
    {Array.from({ length: lines }, (_, index) => <div key={index} className="rounded-2xl border border-border bg-surface p-6 space-y-4">
      <div className="skeleton h-4 w-1/3 rounded" />
      <div className="skeleton h-6 w-3/4 rounded" />
      <div className="skeleton h-4 w-full rounded" />
      <div className="skeleton h-4 w-2/3 rounded" />
    </div>)}
    <span className="sr-only">Cargando datos…</span>
  </div>;
}
