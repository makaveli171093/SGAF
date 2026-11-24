import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { act, cleanup, render, renderHook, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { useAuthenticatedQuery } from "../src/hooks/useAuthenticatedQuery";
import { useAuthStore } from "../src/stores/authStore";
import { RefreshContext } from "../src/lib/refreshContext";
import { useNow } from "../src/hooks/useNow";
import ErrorBoundary from "../src/components/ui/ErrorBoundary";

beforeEach(() => { useAuthStore.setState({accessToken:"test-token",user:null}); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.useRealTimers(); });

it("conserva resultados durante actualización y ante fallo de red", async () => {
  let reject!: (reason: Error) => void;
  const load = vi.fn().mockResolvedValueOnce(["fila"])
    .mockImplementationOnce(() => new Promise((_resolve,r) => { reject=r; }));
  const {result}=renderHook(()=>useAuthenticatedQuery(load));
  await waitFor(()=>expect(result.current.data).toEqual(["fila"]));
  act(()=>result.current.reload());
  expect(result.current.isLoading).toBe(true);
  expect(result.current.data).toEqual(["fila"]);
  await act(async()=>reject(new Error("sin conexión")));
  expect(result.current.isLoading).toBe(false);
  expect(result.current.error).toBeTruthy();
  expect(result.current.data).toEqual(["fila"]);
});
it("descarta respuestas de una sesión anterior", async () => {
  let resolve!: (value: string[]) => void;
  const load=vi.fn(()=>new Promise<string[]>(r=>{resolve=r;}));
  const {result}=renderHook(()=>useAuthenticatedQuery(load));
  act(()=>useAuthStore.getState().logout());
  await act(async()=>resolve(["datos privados"]));
  expect(result.current.data).toBeNull();
  expect(result.current.isLoading).toBe(false);
});
it("el contexto de actualización recarga todas las consultas hijas", async()=>{
  const a=vi.fn().mockResolvedValue(1), b=vi.fn().mockResolvedValue(2);
  function Queries(){useAuthenticatedQuery(a);useAuthenticatedQuery(b);return null;}
  const view=render(<RefreshContext.Provider value={0}><Queries/></RefreshContext.Provider>);
  await waitFor(()=>expect(a).toHaveBeenCalledTimes(1));
  view.rerender(<RefreshContext.Provider value={1}><Queries/></RefreshContext.Provider>);
  await waitFor(()=>{expect(a).toHaveBeenCalledTimes(2);expect(b).toHaveBeenCalledTimes(2);});
});
it("mantiene datos visibles al cambiar filtros y sustituye al recibir respuesta", async()=>{
  const first=vi.fn().mockResolvedValue(["primera"]);
  let resolve!: (value:string[])=>void;
  const second=vi.fn(()=>new Promise<string[]>(r=>{resolve=r;}));
  const {result,rerender}=renderHook(({load})=>useAuthenticatedQuery(load,true),{initialProps:{load:first}});
  await waitFor(()=>expect(result.current.data).toEqual(["primera"]));
  rerender({load:second});
  expect(result.current.data).toEqual(["primera"]);
  await act(async()=>resolve(["filtrada"]));
  expect(result.current.data).toEqual(["filtrada"]);
});
it("el reloj avanza sin volver a cargar la pantalla",()=>{
  vi.useFakeTimers();vi.setSystemTime(new Date("2026-11-24T10:00:00Z"));
  const {result,unmount}=renderHook(()=>useNow());
  const previous=result.current;
  act(()=>vi.advanceTimersByTime(30000));
  expect(result.current).toBe(previous+30000);
  unmount();expect(vi.getTimerCount()).toBe(0);
});
it("un error de renderizado muestra recuperación en lugar de una página vacía",()=>{
  vi.spyOn(console,"error").mockImplementation(()=>{});
  function Broken():ReactNode{throw new Error("datos inválidos");}
  render(<ErrorBoundary><Broken/></ErrorBoundary>);
  expect(screen.getByRole("alert").textContent).toContain("No pudimos mostrar esta pantalla");
  expect(screen.getByRole("button",{name:"Recargar aplicación"})).toBeTruthy();
});
