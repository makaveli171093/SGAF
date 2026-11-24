import { z } from "zod";

const text = z.string();
const date = text.refine((value) => Number.isFinite(Date.parse(value)));
const money = z.union([z.number(), text.regex(/^\d+(\.\d+)?$/)]);
const person = z.object({ firstName: text, lastName: text });
const subject = z.object({ name: text, code: text });
const submission = z.object({
  id: text,
  textContent: text.nullable(),
  fileUrl: text.nullable(),
  grade: money.nullable(),
  feedback: text.nullable(),
  gradedAt: date.nullable(),
  submittedAt: date,
});
const task = z.object({
  id: text,
  tittle: text,
  instructions: text,
  dueDate: date,
});
const payment = z.object({
  id: text,
  amount: money,
  method: z.enum(["CASH", "BANK_TRANSFER", "ONLINE"]),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
  createdAt: date,
  receiptNumber: text.nullable(),
});
const obligation = z.object({
  id: text,
  amount: money,
  type: z.enum(["ENROLLMENT", "MONTHLY_FEE", "OTHER"]),
  status: z.enum(["PENDING", "PAID", "OVERDUE", "CACELLED"]),
  description: text,
  dueDate: date,
  payments: z.array(payment),
});
const schedule = z.array(
  z.object({
    dayOfWeek: z.enum([
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ]),
    startTime: text.regex(/^(?:\d{4}-\d{2}-\d{2}T)?(?:[01]\d|2[0-3]):[0-5]\d/),
    endTime: text.regex(/^(?:\d{4}-\d{2}-\d{2}T)?(?:[01]\d|2[0-3]):[0-5]\d/),
  }),
);
const group = z.object({
  name: text,
  subject,
  academicPeriod: z.object({
    name: text,
    status: z.enum(["ACTIVE", "PLANNED", "CLOSED"]),
  }),
  scheduleBlocks: schedule,
});
const contracts: Record<string, z.ZodType> = {
  "/account/summary": z.object({
    cards: z.array(
      z.object({
        label: text,
        value: z.number().finite(),
        href: text.regex(/^\/(?!\/)/),
      }),
    ),
    generatedAt: date,
  }),
  "/assignments/my-assignments": z.object({
    assignments: z.array(
      task.extend({
        group: z.object({
          id: text,
          name: text,
          subject,
          teacher: z.object({ user: person }),
        }),
        submissions: z.array(submission),
      }),
    ),
  }),
  "/assignments/teacher": z.object({
    assignments: z.array(
      task.extend({
        group: z.object({
          id: text,
          name: text,
          subject,
          academicPeriod: z.object({ name: text }),
        }),
        _count: z.object({ submissions: z.number().int().nonnegative() }),
      }),
    ),
  }),
  "/payments/my-history": z.object({
    financialHistory: z.array(obligation),
    userStatus: z.enum([
      "ACTIVE",
      "INACTIVE",
      "PENDING_APPROVAL",
      "SUSPEND_FOR_DEBT",
    ]),
  }),
  "/groups": z.object({ groups: z.array(group) }),
  "/groups/my-groups": z.object({ groups: z.array(group) }),
  "/enrollments/my-enrollments": z.object({
    enrollments: z.array(
      z.object({ id: text, status: z.enum(["ACTIVE", "CANCELLED"]), group }),
    ),
  }),
};
export class ApiContractError extends Error {
  constructor() {
    super(
      "El servidor devolvió datos incompletos o incompatibles. Intenta actualizar; si continúa, contacta al administrador.",
    );
  }
}
export function validateApiResponse(path: string, data: unknown): void {
  const schema =
    contracts[path] ??
    (path.startsWith("/submissions/assignment/")
      ? z.object({
          submissions: z.array(
            submission.extend({
              student: z.object({
                id: text,
                enrollmentCode: text,
                user: person,
              }),
            }),
          ),
        })
      : undefined);
  if (schema && !schema.safeParse(data).success) throw new ApiContractError();
}
