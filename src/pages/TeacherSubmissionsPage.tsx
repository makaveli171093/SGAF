import LoadingButton from "../components/ui/LoadingButton";
import { useMemo, useState } from "react";
import Skeleton from "../components/ui/Skeleton";
import Pagination from "../components/ui/Pagination";
import { FilterField, filterInputClass } from "../components/ui/TaskFilters";
import { filterSubmissions, paginate, TASK_PAGE_SIZE } from "../lib/assignmentFilters";
import { useCallback } from "react";
import { Link, useLocation, useParams } from "react-router";
import { useAuthenticatedQuery } from "../hooks/useAuthenticatedQuery";
import { submissionsService } from "../services/submissions";
import GradeSubmissionForm from "../components/assignments/GradeSubmissionForm";

const dateFormatter = new Intl.DateTimeFormat("es-BO", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/La_Paz",
});

function getWebUrl(value: string | null): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);

    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return null;
    }

    if (url.username || url.password) return null;

    return url.href;
  } catch {
    return null;
  }
}

function getAssignmentTitle(state: unknown): string | null {
  if (
    typeof state === "object" &&
    state !== null &&
    "assignmentTitle" in state &&
    typeof state.assignmentTitle === "string"
  ) {
    return state.assignmentTitle;
  }

  return null;
}

export default function TeacherSubmissionsPage() {
  const { assignmentId } = useParams();
  const location = useLocation();

  if (!assignmentId) {
    return <p role="alert">No se indicó una tarea.</p>;
  }

  return (
    <SubmissionsContent
      key={assignmentId}
      assignmentId={assignmentId}
      title={getAssignmentTitle(location.state)}
    />
  );
}

interface SubmissionsContentProps {
  assignmentId: string;
  title: string | null;
}

function SubmissionsContent({ assignmentId, title }: SubmissionsContentProps) {
  const loadSubmissions = useCallback(
    (token: string, signal: AbortSignal) =>
      submissionsService.getByAssignment(token, assignmentId, signal),
    [assignmentId],
  );

  const { data, isLoading, error, reload, updateData } =
    useAuthenticatedQuery(loadSubmissions);

  const [query,setQuery] = useState("");
  const [status,setStatus] = useState<"all"|"ungraded"|"graded">("all");
  const [page,setPage] = useState(1);
  const filtered = useMemo(() => filterSubmissions(data?.submissions ?? [],query,status),[data,query,status]);
  const result = paginate(filtered,page,TASK_PAGE_SIZE);
  const pending = data?.submissions.filter(s=>s.grade===null).length ?? 0;
  return (
    <section aria-labelledby="submissions-title">
      <Link
        to="/docente/tareas"
        className="mb-5 inline-block font-medium text-brand underline underline-offset-4"
      >
        Volver a tareas publicadas
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1
            id="submissions-title"
            className="text-2xl font-bold text-brand sm:text-3xl"
          >
            Entregas de la tarea
          </h1>

          {title && <p className="mt-2 break-words text-ink/70">{title}</p>}
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

      {data && data.submissions.length === 0 && (
        <p role="status" className="rounded-xl bg-surface p-6">
          Todavía no hay entregas registradas para esta tarea.
        </p>
      )}

      {data && data.submissions.length > 0 && <div className="mb-5 space-y-3">
        <p className="text-sm text-ink/70">{pending} pendientes de calificación de {data.submissions.length} entregas</p>
        <div className="grid gap-3 rounded-xl border border-border bg-surface p-4 sm:grid-cols-2">
          <FilterField label="Buscar estudiante o matrícula"><input className={filterInputClass} value={query} placeholder="Nombre o matrícula" onChange={e=>{setQuery(e.target.value);setPage(1)}} /></FilterField>
          <FilterField label="Calificación"><select className={filterInputClass} value={status} onChange={e=>{setStatus(e.target.value as "all"|"ungraded"|"graded");setPage(1)}}><option value="all">Todas las entregas</option><option value="ungraded">Sin calificar</option><option value="graded">Calificadas</option></select></FilterField>
        </div>
      </div>}
      {data && data.submissions.length > 0 && (
        <>
        {filtered.length === 0 && <p role="status" className="rounded-xl border border-border bg-surface p-6">Sin resultados para estos filtros.</p>}
        <div className="space-y-5">
          {result.items.map((submission) => {
            const fileUrl = getWebUrl(submission.fileUrl);

            return (
              <article
                key={submission.id}
                className="rounded-2xl border border-border bg-surface p-6"
              >
                <h2 className="break-words text-xl font-semibold text-brand">
                  {submission.student.user.firstName}{" "}
                  {submission.student.user.lastName}
                </h2>

                <p className="mt-1 text-sm text-ink/70">
                  Matrícula: {submission.student.enrollmentCode}
                </p>

                <p className="mt-2 text-sm text-ink/70">
                  Entregada:{" "}
                  {dateFormatter.format(new Date(submission.submittedAt))}
                  {" · "}Hora de Bolivia
                </p>

                {submission.textContent && (
                  <p className="mt-4 whitespace-pre-wrap break-words rounded-lg bg-canvas p-4">
                    {submission.textContent}
                  </p>
                )}

                {fileUrl && (
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block font-medium text-brand underline underline-offset-4"
                  >
                    Abrir archivo o enlace entregado
                  </a>
                )}

                {submission.fileUrl && !fileUrl && (
                  <p className="mt-4 text-sm text-warning">
                    El enlace registrado no tiene un formato válido.
                  </p>
                )}

                <div className="mt-5 border-t border-border pt-4">
                  <p className="font-semibold">
                    {submission.grade !== null
                      ? `Calificación: ${submission.grade} / 100`
                      : "Pendiente de calificación"}
                  </p>

                  {submission.feedback && (
                    <p className="mt-2 whitespace-pre-wrap break-words">
                      Comentarios: {submission.feedback}
                    </p>
                  )}
                </div>
                <details className="mt-5 border-t border-border pt-4">
                  <summary className="cursor-pointer rounded font-semibold text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                    {submission.grade === null
                      ? "Calificar entrega"
                      : "Actualizar calificación"}
                  </summary>

                  <GradeSubmissionForm
                    submission={submission}
                    onGraded={(gradedSubmission) => {
                      updateData((current) => ({
                        ...current,
                        submissions: current.submissions.map((item) =>
                          item.id === gradedSubmission.id
                            ? {
                                ...item,
                                grade: gradedSubmission.grade,
                                feedback: gradedSubmission.feedback,
                                gradedAt: gradedSubmission.gradedAt,
                              }
                            : item,
                        ),
                      }));
                    }}
                  />
                </details>
              </article>
            );
          })}
        </div>
        <Pagination page={result.current} total={filtered.length} size={TASK_PAGE_SIZE} onChange={setPage} />
        </>
      )}
    </section>
  );
}
