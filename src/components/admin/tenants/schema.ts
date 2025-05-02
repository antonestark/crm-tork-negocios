import { z } from 'zod';

// Basic schema for adding a new tenant
export const addTenantSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  // identity field removed as schema_name is no longer needed for RLS approach
  user_limit: z.coerce.number().int().positive({ message: "Limite de usuários deve ser um número positivo." }).optional().default(1),
  connection_limit: z.coerce.number().int().positive({ message: "Limite de conexão deve ser um número positivo." }).optional().default(1),
  status: z.enum(['active', 'inactive', 'trial']).optional().default('inactive'),
  tier: z.string().optional(), // Pricing plan/level
  trial_days: z.coerce.number().int().nonnegative({ message: "Dias de teste deve ser um número não negativo." }).optional(),

  // Optional SMTP fields
  smtp_host: z.string().optional(),
  smtp_port: z.coerce.number().int().positive().optional(),
  smtp_user: z.string().optional(),
  smtp_password: z.string().optional(), // Consider security implications
  smtp_secure: z.boolean().optional().default(true),

  // Optional Asaas fields
  asaas_token: z.string().optional(),
  customer_id: z.string().optional(),
  asaas_status: z.string().optional(), // Add asaas_status field
});

export type AddTenantFormValues = z.infer<typeof addTenantSchema>;
