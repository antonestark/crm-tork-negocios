
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { useState } from "react";
import { format } from "date-fns";
import { maintenanceFormSchema, MaintenanceFormProps, MaintenanceFormValues } from "./types";
import { 
  TitleField, 
  DescriptionField, 
  TypeField, 
  AreaField, 
  ScheduledDateField,
  FrequencyField 
} from "./FormFields";
import { FormButtons } from "./FormButtons";

export const MaintenanceForm = ({ onSubmit, areas, setOpen }: MaintenanceFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [areasLoading, setAreasLoading] = useState(areas.length === 0);
  
  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceFormSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "preventive",
      status: "pending",
      frequency: "monthly"
    }
  });

  const handleSubmit = async (values: MaintenanceFormValues) => {
    setIsSubmitting(true);
    try {
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
        scheduled_date: formattedDate,
        frequency: values.frequency || "monthly"
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
        <TitleField form={form} />
        <DescriptionField form={form} />
        <TypeField form={form} />
        <FrequencyField form={form} />
        <AreaField form={form} areas={areas} areasLoading={areasLoading} />
        <ScheduledDateField form={form} />
        <FormButtons isSubmitting={isSubmitting} />
      </form>
    </Form>
  );
};
