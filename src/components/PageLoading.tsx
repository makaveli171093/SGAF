export default function PageLoading() {
  return <div role="status" aria-live="polite" aria-busy="true" className="flex min-h-48 items-center justify-center p-8">
    <div className="flex items-center gap-4">
      <span aria-hidden="true" className="inline-flex h-12 w-12 items-center justify-center rounded-full border-4 border-border border-t-brand animate-spin motion-reduce:animate-none" />
      <div><p className="font-semibold text-brand">NEXORA</p><p className="text-sm text-ink/70">Preparando contenido…</p></div>
    </div>
  </div>;
}
