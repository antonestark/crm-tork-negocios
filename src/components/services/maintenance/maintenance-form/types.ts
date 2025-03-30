
import { z } from "zod";

// Define the schema
export const maintenanceFormSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  type: z.string(),
  area_id: z.string().uuid().optional(),
  scheduled_date: z.date().optional(),
  status: z.string().default("pending"),
  frequency: z.string().default("monthly")
});

export type MaintenanceFormValues = z.infer<typeof maintenanceFormSchema>;

export interface MaintenanceFormProps {
  onSubmit: (formData: any) => Promise<void>;
  areas: any[];
  setOpen: (open: boolean) => void;
}
