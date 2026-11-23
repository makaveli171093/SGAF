import { Link } from "react-router";
import { useMyAssignments } from "../../hooks/useMyAssignments";
import { studentStatus } from "../../lib/assignmentFilters";
import Skeleton from "../ui/Skeleton";
export default function StudentDueTasks() {
  const { assignments, isLoading, error, checkedAt } = useMyAssignments();
  const now = checkedAt;
  const upcoming = assignments.filter(a => studentStatus(a, now) === "pending" && Date.parse(a.dueDate) >= now && Date.parse(a.dueDate) <= now + 48 * 60 * 60 * 1000)
    .sort((a,b) => Date.parse(a.dueDate)-Date.parse(b.dueDate));
  return <section className="mt-7 rounded-2xl border border-border bg-surface p-6" aria-labelledby="upcoming-title">
    <h2 id="upcoming-title" className="text-lg font-semibold text-brand">Próximas entregas (48 horas)</h2>
    {isLoading && assignments.length === 0 && <div className="mt-4"><Skeleton lines={1} /></div>}
    {error && <p className="mt-3 text-sm text-danger">No se pudieron consultar las próximas tareas.</p>}
    {!isLoading && !error && upcoming.length === 0 && <p className="mt-3 text-sm text-ink/70">No tienes entregas pendientes en las próximas 48 horas.</p>}
    {upcoming.length > 0 && <ul className="mt-4 divide-y divide-border">{upcoming.slice(0,5).map(task=><li key={task.id} className="flex flex-wrap items-center justify-between gap-2 py-3"><span><strong>{task.tittle}</strong><span className="block text-sm text-ink/70">{task.group.subject.name} · {new Date(task.dueDate).toLocaleString("es-BO",{timeZone:"America/La_Paz",dateStyle:"medium",timeStyle:"short"})}</span></span><Link className="font-medium text-brand underline" to="/mis-tareas">Ver tarea</Link></li>)}</ul>}
    <Link className="mt-4 inline-block text-sm font-semibold text-brand underline" to="/mis-tareas">Todas mis tareas</Link>
  </section>;
}
