
import { DemandCreate } from "@/hooks/use-demands";
import { z } from "zod";

export const formSchema = z.object({
  title: z.string().min(2, { message: 'O título deve ter pelo menos 2 caracteres' }),
  description: z.string().optional(),
  area_id: z.string().min(1, { message: 'Selecione uma área' }),
  priority: z.string(),
  assigned_to: z.string().optional(),
  requested_by: z.string().optional(),
  due_date: z.date().optional(),
  status: z.string()
});

export type FormValues = z.infer<typeof formSchema>;

export interface DemandFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: DemandCreate) => Promise<boolean>;
  demand: DemandCreate | null;
}

export interface Area {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
}
