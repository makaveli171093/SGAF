const test = require("node:test");
const assert = require("node:assert/strict");
const { scheduleTime, upcomingSchedule } = require("../src/lib/schedule.ts");
const {
  assignmentSchema,
  assignmentDateToISO,
} = require("../src/schemas/assignmentSchema.ts");
const { validateApiResponse } = require("../src/lib/apiContracts.ts");
test("horas de PostgreSQL se muestran como horas, no como año", () => {
  assert.equal(scheduleTime("1970-01-01T08:30:00.000Z"), "08:30");
  assert.equal(scheduleTime("17:45:00"), "17:45");
});
test("agenda prioriza próximas clases en Bolivia sin mutar el origen", () => {
  const blocks = [
    { dayOfWeek: "MONDAY", startTime: "08:00" },
    { dayOfWeek: "TUESDAY", startTime: "09:00" },
    { dayOfWeek: "MONDAY", startTime: "15:00" },
  ];
  assert.deepEqual(
    upcomingSchedule(blocks, Date.parse("2026-11-23T17:00:00Z")),
    [blocks[2], blocks[1], blocks[0]],
  );
  assert.equal(blocks[0].startTime, "08:00");
});
test("validador rechaza días inexistentes y conserva año bisiesto", () => {
  const input = (dueDate) => ({
    title: "Actividad",
    instructions: "Responder",
    dueDate,
  });
  assert.equal(
    assignmentSchema.safeParse(input("2099-02-30T12:00")).success,
    false,
  );
  assert.equal(
    assignmentSchema.safeParse(input("2099-02-29T12:00")).success,
    false,
  );
  assert.equal(
    assignmentSchema.safeParse(input("2096-02-29T12:00")).success,
    true,
  );
  assert.equal(
    assignmentDateToISO("2096-02-29T12:00"),
    "2096-02-29T16:00:00.000Z",
  );
});
test("contratos detectan respuestas rotas antes de renderizar", () => {
  assert.throws(
    () => validateApiResponse("/account/summary", { cards: null }),
    /incompletos/,
  );
  assert.throws(
    () =>
      validateApiResponse("/assignments/my-assignments", {
        assignments: [{ id: "1" }],
      }),
    /incompletos/,
  );
  assert.doesNotThrow(() =>
    validateApiResponse("/assignments/my-assignments", { assignments: [] }),
  );
  assert.doesNotThrow(() =>
    validateApiResponse("/account/summary", {
      cards: [],
      generatedAt: "2026-11-23T12:00:00Z",
    }),
  );
});
