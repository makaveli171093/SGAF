import {
  filterStudentTasks,
  filterTeacherTasks,
  filterSubmissions,
  paginate,
  type StudentTaskStatus,
  type TaskOrder,
} from "./assignmentFilters";
import type {
  MyAssignmentsResponse,
  TeacherAssignmentsResponse,
  AssignmentSubmissionsResponse,
  TaskQuery,
} from "../types/assignments";
// Transitional compatibility: older servers return full lists without metadata.
function page<T>(items: T[], query: TaskQuery) {
  const result = paginate(items, query.page ?? 1, query.pageSize ?? 10);
  return {
    items: result.items,
    pagination: {
      total: items.length,
      page: result.current,
      pageSize: query.pageSize ?? 10,
    },
  };
}
export function studentPage(
  data: MyAssignmentsResponse,
  query: TaskQuery,
): MyAssignmentsResponse {
  if (!query.page || data.pagination) return data;
  const result = page(
    filterStudentTasks(
      data.assignments,
      query.q ?? "",
      query.group ?? "all",
      (query.status ?? "all") as StudentTaskStatus,
      (query.order ?? "dueAsc") as TaskOrder,
      Date.now(),
    ),
    query,
  );
  return {
    ...data,
    assignments: result.items,
    pagination: result.pagination,
    filters: {
      groups: [
        ...new Map(
          data.assignments.map((a) => [
            a.group.id,
            {
              id: a.group.id,
              label: `${a.group.subject.name} · ${a.group.name}`,
            },
          ]),
        ).values(),
      ],
    },
  };
}
export function teacherPage(
  data: TeacherAssignmentsResponse,
  query: TaskQuery,
): TeacherAssignmentsResponse {
  if (!query.page || data.pagination) return data;
  const result = page(
    filterTeacherTasks(
      data.assignments,
      query.q ?? "",
      query.group ?? "all",
      query.period ?? "all",
      (query.order ?? "dueAsc") as TaskOrder,
    ),
    query,
  );
  return {
    ...data,
    assignments: result.items,
    pagination: result.pagination,
    filters: {
      groups: [
        ...new Map(
          data.assignments.map((a) => [
            a.group.id,
            {
              id: a.group.id,
              label: `${a.group.subject.name} · ${a.group.name}`,
            },
          ]),
        ).values(),
      ],
      periods: [
        ...new Set(data.assignments.map((a) => a.group.academicPeriod.name)),
      ],
    },
  };
}
export function submissionPage(
  data: AssignmentSubmissionsResponse,
  query: TaskQuery,
): AssignmentSubmissionsResponse {
  if (!query.page || data.pagination) return data;
  const result = page(
    filterSubmissions(
      data.submissions,
      query.q ?? "",
      (query.status ?? "all") as "all" | "graded" | "ungraded",
    ),
    query,
  );
  return {
    ...data,
    submissions: result.items,
    pagination: result.pagination,
    pending: data.submissions.filter((s) => s.grade === null).length,
  };
}
