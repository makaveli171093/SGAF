import { useAuthenticatedQuery } from "./useAuthenticatedQuery";
import { enrollmentsService } from "../services/enrollments";
export function useEnrollments() {
  const query = useAuthenticatedQuery(enrollmentsService.getMine);
  return {...query, enrollments:query.data?.enrollments ?? []};
}
