import { z } from "zod";

export const visitorFormSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  document: z.string().optional().nullable(),
  client_id: z.string().uuid({
    message: "Selecione um cliente válido.",
  }),
  visit_time: z.string().refine((value) => {
    // Basic validation for non-empty string, more robust date validation can be added
    return value.length > 0;
  }, {
    message: "Selecione a data e hora da visita.",
  }),
  notes: z.string().optional().nullable(),
});

export type VisitorFormValues = z.infer<typeof visitorFormSchema>;
