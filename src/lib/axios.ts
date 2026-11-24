import axios from "axios";
import { validateApiResponse } from "./apiContracts";

const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
  throw new Error("VITE_API_URL no esta configurada.");
}

export const api = axios.create({
  baseURL: apiUrl,
  timeout: 60000, // 60 segundos
});
api.interceptors.response.use(response => {
  if (response.config.method === "get") validateApiResponse((response.config.url ?? "").split("?")[0], response.data);
  return response;
});
