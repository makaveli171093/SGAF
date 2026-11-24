import { z } from "zod";

export function assignmentDateToISO(value: string): string {
  return new Date(`${value}:00-04:00`).toISOString();
}

export const assignmentSchema = z.object({
  title: z.string().trim().min(1, "Introduce el título"),
  instructions: z.string().trim().min(1, "Escribe las instrucciones"),
  dueDate: z
    .string()
    .min(1, "Selecciona la fecha y hora límite")
    .refine((value) => {
      if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
        return false;
      }

      const timestamp = new Date(`${value}:00-04:00`).getTime();

      const parsed = new Date(`${value}:00Z`);
      return Number.isFinite(timestamp) && Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 16) === value && timestamp > Date.now();
    }, "La fecha y hora deben ser posteriores al momento actual"),
});

export type AssignmentFormValues = z.infer<typeof assignmentSchema>;
