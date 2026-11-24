import { useAuthenticatedQuery } from "./useAuthenticatedQuery";
import { groupsService } from "../services/groups";
export function useGroups() {
  const query = useAuthenticatedQuery(groupsService.getAll);
  return {...query, groups:query.data?.groups ?? []};
}
