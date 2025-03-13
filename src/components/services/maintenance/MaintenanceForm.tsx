
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import { useState } from "react";

// Define the schema
const maintenanceFormSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  type: z.string(),
  area_id: z.string().uuid().optional(),
  scheduled_date: z.date().optional(),
  status: z.string().default("pending")
});

interface MaintenanceFormProps {
  onSubmit: (formData: any) => Promise<void>;
  areas: any[];
  setOpen: (open: boolean) => void;
}

export const MaintenanceForm = ({ onSubmit, areas, setOpen }: MaintenanceFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof maintenanceFormSchema>>({
    resolver: zodResolver(maintenanceFormSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "preventive",
      status: "pending"
    }
  });

  const handleSubmit = async (values: z.infer<typeof maintenanceFormSchema>) => {
    setIsSubmitting(true);
    try {
      // Make sure required fields are defined
      if (!values.title) {
        toast.error("Título é obrigatório");
        return;
      }
      
      if (!values.type) {
        toast.error("Tipo de manutenção é obrigatório");
        return;
      }
      
      // Create a formatted date string if scheduled_date exists
      const formattedDate = values.scheduled_date 
        ? format(values.scheduled_date, 'yyyy-MM-dd')
        : null;
        
      console.log("Submitting maintenance with scheduled date:", formattedDate);
      
      // Prepare data for insertion
      const maintenanceData = {
        title: values.title,
        description: values.description || null,
        type: values.type,
        area_id: values.area_id || null,
        status: values.status || "pending",
        scheduled_date: formattedDate
      };

      await onSubmit(maintenanceData);
      
      form.reset();
    } catch (error) {
      console.error("Erro ao criar manutenção:", error);
      toast.error("Erro ao criar manutenção. Verifique os dados e tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Título da manutenção" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea placeholder="Descrição (opcional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="preventive">Preventiva</SelectItem>
                  <SelectItem value="corrective">Corretiva</SelectItem>
                  <SelectItem value="scheduled">Programada</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="area_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Área</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a área" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {areas.map(area => (
                    <SelectItem key={area.id} value={area.id}>{area.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="scheduled_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data Programada</FormLabel>
              <DatePicker
                date={field.value}
                setDate={(date) => {
                  console.log("Setting scheduled date:", date);
                  field.onChange(date);
                }}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Agendar Manutenção"}
        </Button>
      </form>
    </Form>
  );
};
