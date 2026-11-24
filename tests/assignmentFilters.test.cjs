const test = require("node:test");
const assert = require("node:assert/strict");
const {
  paginate,
  studentStatus,
  filterStudentTasks,
  filterTeacherTasks,
  filterSubmissions,
} = require("../src/lib/assignmentFilters.ts");
const task = (id, dueDate, submissions = [], group = "g1") => ({
  id,
  tittle: `Tarea ${id}`,
  instructions: "Practicar SQL",
  dueDate,
  submissions,
  group: { id: group, name: "A", subject: { name: "Base de datos" } },
});
const teacher = (id, period = "2026-A") => ({
  ...task(id, "2026-11-25T18:00:00Z"),
  group: {
    id: "g1",
    name: "A",
    subject: { name: "Base de datos" },
    academicPeriod: { name: period },
  },
});
const submission = (id, grade, name) => ({
  id,
  grade,
  student: { enrollmentCode: id, user: { firstName: name, lastName: "Pérez" } },
});
test("paginación conserva total, limita y corrige página fuera de rango", () => {
  const items = Array.from({ length: 25 }, (_, i) => i);
  assert.deepEqual(paginate(items, 2, 10).items, items.slice(10, 20));
  assert.equal(paginate(items, 20, 10).current, 3);
  assert.equal(paginate([], 1, 10).pages, 1);
});
test("prioridad de estado: calificada > entregada > vencida > pendiente", () => {
  const now = Date.parse("2026-11-23T12:00:00Z");
  assert.equal(
    studentStatus(task("1", "2026-11-22T10:00:00Z", [{ grade: 85 }]), now),
    "graded",
  );
  assert.equal(
    studentStatus(task("2", "2026-11-22T10:00:00Z", [{ grade: null }]), now),
    "submitted",
  );
  assert.equal(
    studentStatus(task("3", "2026-11-22T10:00:00Z"), now),
    "overdue",
  );
  assert.equal(
    studentStatus(task("4", "2026-11-24T10:00:00Z"), now),
    "pending",
  );
});
test("filtro de estudiante busca, filtra estado y ordena sin mutar fuente", () => {
  const now = Date.parse("2026-11-23T12:00:00Z");
  const source = [
    task("1", "2026-11-25T10:00:00Z"),
    task("2", "2026-11-22T10:00:00Z"),
  ];
  assert.deepEqual(
    filterStudentTasks(source, "SQL", "all", "overdue", "dueAsc", now).map(
      (v) => v.id,
    ),
    ["2"],
  );
  assert.deepEqual(
    source.map((v) => v.id),
    ["1", "2"],
  );
});
test("filtro docente limita por periodo y búsqueda", () => {
  assert.deepEqual(
    filterTeacherTasks(
      [teacher("1", "2026-A"), teacher("2", "2026-B")],
      "tarea",
      "all",
      "2026-B",
      "title",
    ).map((v) => v.id),
    ["2"],
  );
});
test("entregas distinguen pendientes y calificadas", () => {
  const list = [submission("A", null, "Ana"), submission("B", 78, "Luis")];
  assert.deepEqual(
    filterSubmissions(list, "Ana", "ungraded").map((v) => v.id),
    ["A"],
  );
  assert.deepEqual(
    filterSubmissions(list, "", "graded").map((v) => v.id),
    ["B"],
  );
});
