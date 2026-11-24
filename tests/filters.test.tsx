import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import TeacherAssignmentsPage from "../src/pages/TeacherAssignmentsPage";
import { assignmentsService } from "../src/services/assignments";
import { useAuthStore } from "../src/stores/authStore";

vi.mock("../src/services/assignments",()=>({assignmentsService:{getTeacherAssignments:vi.fn()}}));
beforeEach(()=>{useAuthStore.setState({accessToken:"test-token",user:null});});
afterEach(()=>{cleanup();vi.clearAllMocks();});
it("mantiene filtros utilizables cuando la búsqueda no devuelve resultados",async()=>{
  vi.mocked(assignmentsService.getTeacherAssignments).mockResolvedValue({message:"ok",assignments:[],pagination:{page:1,pageSize:10,total:0},filters:{groups:[],periods:[]}});
  render(<MemoryRouter><TeacherAssignmentsPage/></MemoryRouter>);
  const search=await screen.findByPlaceholderText("Título o materia");
  fireEvent.change(search,{target:{value:"sin coincidencias"}});
  await waitFor(()=>expect(assignmentsService.getTeacherAssignments).toHaveBeenLastCalledWith("test-token",expect.any(AbortSignal),expect.objectContaining({q:"sin coincidencias",page:1})));
  expect(screen.getByPlaceholderText("Título o materia")).toBe(search);
  fireEvent.change(search,{target:{value:""}});
  await waitFor(()=>expect(assignmentsService.getTeacherAssignments).toHaveBeenLastCalledWith("test-token",expect.any(AbortSignal),expect.objectContaining({q:""})));
});
