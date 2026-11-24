import { useCallback } from "react";
import { useAuthenticatedQuery } from "./useAuthenticatedQuery";
import { assignmentsService } from "../services/assignments";
import type { TaskQuery, StudentSubmission } from "../types/assignments";
export function useMyAssignments(params: TaskQuery = {}) {
  const { page, pageSize, q, group, status, order } = params;
  const load = useCallback(
    async (token: string, signal: AbortSignal) => ({
      ...(await assignmentsService.getMine(token, signal, {
        page,
        pageSize,
        q,
        group,
        status,
        order,
      })),
      checkedAt: Date.now(),
    }),
    [page, pageSize, q, group, status, order],
  );
  const query = useAuthenticatedQuery(load, true);
  function registerSubmission(
    assignmentId: string,
    submission: StudentSubmission,
  ) {
    query.updateData((current) => ({
      ...current,
      assignments: current.assignments.map((a) =>
        a.id === assignmentId ? { ...a, submissions: [submission] } : a,
      ),
    }));
    query.reload();
  }
  return {
    ...query,
    assignments: query.data?.assignments ?? [],
    checkedAt: query.data?.checkedAt ?? 0,
    pagination: query.data?.pagination,
    filters: query.data?.filters,
    registerSubmission,
  };
}
