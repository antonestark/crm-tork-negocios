
import * as z from 'zod';

// Define CPF and CNPJ masks
export const CPF_MASK = '999.999.999-99';
export const CNPJ_MASK = '99.999.999/9999-99';

// Schema for input validation
export const clientFormSchema = z.object({
  company_name: z.string().min(2, {
    message: "Nome da empresa deve ter pelo menos 2 caracteres.",
  }),
  razao_social: z.string().optional(),
  document: z.string().optional(),
  birth_date: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  status: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;
