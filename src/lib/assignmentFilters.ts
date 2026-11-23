import type { StudentAssignment, TeacherAssignment, TeacherSubmission } from "../types/assignments";
export type StudentTaskStatus = "all" | "pending" | "overdue" | "submitted" | "graded";
export type TaskOrder = "dueAsc" | "dueDesc" | "title";
export const TASK_PAGE_SIZE = 10;
export function paginate<T>(items: T[], page: number, size = TASK_PAGE_SIZE) {
  const pages = Math.max(1, Math.ceil(items.length / size));
  const current = Math.min(Math.max(1, page), pages);
  return { current, pages, items: items.slice((current - 1) * size, current * size) };
}
export function studentStatus(task: StudentAssignment, now: number): Exclude<StudentTaskStatus, "all"> {
  const submission = task.submissions[0];
  if (submission) return submission.grade !== null ? "graded" : "submitted";
  return new Date(task.dueDate).getTime() < now ? "overdue" : "pending";
}
export function filterStudentTasks(tasks: StudentAssignment[], query: string, group: string, status: StudentTaskStatus, order: TaskOrder, now: number) {
  const term = query.trim().toLocaleLowerCase("es");
  return tasks.filter(task => (group === "all" || task.group.id === group) &&
    (status === "all" || studentStatus(task, now) === status) &&
    [task.tittle,task.instructions,task.group.subject.name,task.group.name].some(v => v.toLocaleLowerCase("es").includes(term)))
    .sort((a,b) => order === "title" ? a.tittle.localeCompare(b.tittle,"es") : order === "dueDesc" ? Date.parse(b.dueDate)-Date.parse(a.dueDate) : Date.parse(a.dueDate)-Date.parse(b.dueDate));
}
export function filterTeacherTasks(tasks: TeacherAssignment[], query: string, group: string, period: string, order: TaskOrder) {
  const term = query.trim().toLocaleLowerCase("es");
  return tasks.filter(task => (group === "all" || task.group.id === group) && (period === "all" || task.group.academicPeriod.name === period) &&
    [task.tittle,task.instructions,task.group.subject.name,task.group.name].some(v => v.toLocaleLowerCase("es").includes(term)))
    .sort((a,b) => order === "title" ? a.tittle.localeCompare(b.tittle,"es") : order === "dueDesc" ? Date.parse(b.dueDate)-Date.parse(a.dueDate) : Date.parse(a.dueDate)-Date.parse(b.dueDate));
}
export function filterSubmissions(submissions: TeacherSubmission[], query: string, status: "all"|"ungraded"|"graded") {
  const term=query.trim().toLocaleLowerCase("es");
  return submissions.filter(s => (status === "all" || (status === "graded" ? s.grade !== null : s.grade === null)) &&
    [s.student.user.firstName,s.student.user.lastName,s.student.enrollmentCode].some(v => v.toLocaleLowerCase("es").includes(term)));
}
