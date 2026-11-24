import { useAuthenticatedQuery } from "./useAuthenticatedQuery";
import { paymentsService } from "../services/payments";
import { useAuthStore } from "../stores/authStore";
async function load(token:string,signal:AbortSignal) {
  const response=await paymentsService.getMyHistory(token,signal);
  const session=useAuthStore.getState();
  if(!signal.aborted && session.accessToken === token && session.user && session.user.status !== response.userStatus) session.setSession(token,{...session.user,status:response.userStatus});
  return {...response,checkedAt:Date.now()};
}
export function useFinancialHistory() {
  const query=useAuthenticatedQuery(load);
  return {...query,obligations:query.data?.financialHistory ?? [],checkedAt:query.data?.checkedAt ?? 0};
}
