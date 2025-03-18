
import { z } from "zod";

// Define the schema
export const serviceFormSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  status: z.string().default("pending"),
  area_id: z.string().uuid().optional(),
  due_date: z.date().optional(),
  assigned_to: z.string().uuid().optional(),
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;

export interface ServiceFormProps {
  areas: any[];
  users: any[];
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export interface DialogServiceFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess?: () => void;
}
