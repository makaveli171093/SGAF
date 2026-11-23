import LoadingButton from "../components/ui/LoadingButton";
import { useMemo, useState } from "react";
import Skeleton from "../components/ui/Skeleton";
import Pagination from "../components/ui/Pagination";
import { FilterField, filterInputClass } from "../components/ui/TaskFilters";
import { filterTeacherTasks, paginate, TASK_PAGE_SIZE, type TaskOrder } from "../lib/assignmentFilters";
import { Link } from "react-router";
import { useAuthenticatedQuery } from "../hooks/useAuthenticatedQuery";
import { assignmentsService } from "../services/assignments";

const dateFormatter = new Intl.DateTimeFormat("es-BO", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/La_Paz",
});

export default function TeacherAssignmentsPage() {
  const { data, isLoading, error, reload } = useAuthenticatedQuery(
    assignmentsService.getTeacherAssignments,
  );

  const [query,setQuery] = useState("");
  const [group,setGroup] = useState("all");
  const [period,setPeriod] = useState("all");
  const [order,setOrder] = useState<TaskOrder>("dueDesc");
  const [page,setPage] = useState(1);
  const tasks = useMemo(() => data?.assignments ?? [], [data]);
  const groups = useMemo(() => Array.from(new Map(tasks.map(a => [a.group.id,{id:a.group.id,label:`${a.group.subject.name} · ${a.group.name}`}] as const)).values()),[tasks]);
  const periods = useMemo(() => Array.from(new Set(tasks.map(a=>a.group.academicPeriod.name))),[tasks]);
  const filtered = useMemo(() => filterTeacherTasks(tasks,query,group,period,order),[tasks,query,group,period,order]);
  const result = paginate(filtered,page,TASK_PAGE_SIZE);
  return (
    <section aria-labelledby="teacher-assignments-title">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1
            id="teacher-assignments-title"
            className="text-2xl font-bold text-brand sm:text-3xl"
          >
            Tareas publicadas
          </h1>

          <p className="mt-2 text-ink/70">
            Consulta tus actividades y revisa las entregas.
          </p>
        </div>

        <LoadingButton
          loading={isLoading}
          type="button"
          onClick={reload}
          disabled={isLoading}
          className="rounded-lg border border-brand px-4 py-2 font-medium text-brand hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50"
        >
          {isLoading ? "Cargando…" : "Actualizar"}
        </LoadingButton>
      </div>

      <Link
        to="/docente/grupos"
        className="mb-6 inline-block font-medium text-brand underline underline-offset-4"
      >
        Ir a mis grupos para publicar una tarea
      </Link>

      {isLoading && !data && <Skeleton />}

      {error && (
        <div role="alert" className="rounded-xl bg-danger-soft p-6 text-danger">
          <p>{error}</p>

          <button
            type="button"
            onClick={reload}
            className="mt-3 rounded-lg border border-current px-4 py-2"
          >
            Reintentar
          </button>
        </div>
      )}

      {data && data.assignments.length === 0 && (
        <p role="status" className="rounded-xl bg-surface p-6">
          Todavía no tienes tareas publicadas.
        </p>
      )}

      {data && tasks.length > 0 && <div className="mb-5 grid gap-3 rounded-xl border border-border bg-surface p-4 sm:grid-cols-2 lg:grid-cols-4">
        <FilterField label="Buscar tarea"><input className={filterInputClass} value={query} placeholder="Título o materia" onChange={e=>{setQuery(e.target.value);setPage(1)}} /></FilterField>
        <FilterField label="Grupo"><select className={filterInputClass} value={group} onChange={e=>{setGroup(e.target.value);setPage(1)}}><option value="all">Todos</option>{groups.map(g=><option key={g.id} value={g.id}>{g.label}</option>)}</select></FilterField>
        <FilterField label="Período"><select className={filterInputClass} value={period} onChange={e=>{setPeriod(e.target.value);setPage(1)}}><option value="all">Todos</option>{periods.map(v=><option key={v} value={v}>{v}</option>)}</select></FilterField>
        <FilterField label="Orden"><select className={filterInputClass} value={order} onChange={e=>{setOrder(e.target.value as TaskOrder);setPage(1)}}><option value="dueDesc">Más recientes</option><option value="dueAsc">Próximo vencimiento</option><option value="title">Título A-Z</option></select></FilterField>
      </div>}
      {data && tasks.length > 0 && (
        <>
        {filtered.length === 0 && <p role="status" className="rounded-xl border border-border bg-surface p-6">No hay tareas con estos filtros.</p>}
        <div className="space-y-5">
          {result.items.map((assignment) => (
            <article
              key={assignment.id}
              className="rounded-2xl border border-border bg-surface p-6"
            >
              <p className="break-words text-sm text-ink/70">
                {assignment.group.subject.name}
                {" · "}Grupo {assignment.group.name}
                {" · "}
                {assignment.group.academicPeriod.name}
              </p>

              <h2 className="mt-2 break-words text-xl font-semibold text-brand">
                {assignment.tittle}
              </h2>

              <p className="mt-3 whitespace-pre-wrap break-words">
                {assignment.instructions}
              </p>

              <p className="mt-4 text-sm text-ink/70">
                Fecha límite:{" "}
                {dateFormatter.format(new Date(assignment.dueDate))}
                {" · "}Hora de Bolivia
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <p className="font-medium">
                  Entregas recibidas: {assignment._count.submissions}
                </p>

                <Link
                  to={`/docente/tareas/${assignment.id}/entregas`}
                  state={{ assignmentTitle: assignment.tittle }}
                  className="rounded-lg bg-brand px-4 py-2 font-medium text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  Revisar entregas
                </Link>
              </div>
            </article>
          ))}
        </div>
        <Pagination page={result.current} total={filtered.length} size={TASK_PAGE_SIZE} onChange={setPage} />
        </>
      )}
    </section>
  );
}
