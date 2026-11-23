import { useCallback } from "react";
import { Link } from "react-router";
import type { UserRole } from "../../types/auth";
import { useAuthenticatedQuery } from "../../hooks/useAuthenticatedQuery";
import { groupsService } from "../../services/groups";
import { enrollmentsService } from "../../services/enrollments";
import { scheduleDayLabels } from "../../constants/scheduleLabels";
import Skeleton from "../ui/Skeleton";
import AppIcon from "../ui/AppIcon";

const dayOrder = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
export default function WeeklySchedule({ role }: { role: UserRole }) {
  const load = useCallback(async (token: string, signal: AbortSignal) => {
    const groups = role === "STUDENT"
      ? (await enrollmentsService.getMine(token, signal)).enrollments.filter(enrollment => enrollment.status === "ACTIVE").map(enrollment => enrollment.group)
      : role === "TEACHER" ? (await groupsService.getMine(token, signal)).groups : (await groupsService.getAll(token, signal)).groups;
    return groups.filter(group => group.academicPeriod.status === "ACTIVE").flatMap(group => group.scheduleBlocks.map(block => ({ ...block, subject: group.subject.name, group: group.name })))
      .sort((a, b) => dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek) || a.startTime.localeCompare(b.startTime));
  }, [role]);
  const { data, isLoading, error, reload } = useAuthenticatedQuery(load);
  const href = role === "STUDENT" ? "/mis-inscripciones" : role === "TEACHER" ? "/docente/grupos" : "/grupos";
  return <section className="editorial-panel schedule-panel" aria-labelledby="schedule-title">
    <div className="panel-title"><div><span className="section-label">Período activo</span><h2 id="schedule-title">Horario semanal</h2></div><AppIcon name="calendar" /></div>
    {isLoading && <Skeleton lines={3} />}
    {error && <div role="alert" className="panel-empty"><p>No pudimos consultar el horario.</p><button className="text-action" onClick={reload}>Reintentar</button></div>}
    {data?.length === 0 && <p className="panel-empty">Todavía no hay clases programadas en un período activo.</p>}
    {data && data.length > 0 && <ol className="schedule-list">{data.slice(0, 5).map((block, index) => <li key={`${block.group}-${block.dayOfWeek}-${block.startTime}-${index}`}><div className="schedule-time"><span>{scheduleDayLabels[block.dayOfWeek]}</span><time>{block.startTime.slice(0, 5)}</time></div><div><strong>{block.subject}</strong><span>{block.group} · hasta {block.endTime.slice(0, 5)}</span></div></li>)}</ol>}
    <Link className="panel-footer-link" to={href}>Ver todos los horarios <AppIcon name="arrow" /></Link>
  </section>;
}
