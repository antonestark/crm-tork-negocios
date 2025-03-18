
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { useState } from "react";
import { serviceFormSchema, ServiceFormProps, ServiceFormValues } from "./types";
import { 
  TitleField, 
  DescriptionField, 
  StatusField, 
  AreaField, 
  AssignedUserField, 
  DueDateField 
} from "./FormFields";
import { FormButtons } from "./FormButtons";

export const ServiceForm = ({ areas, users, onSubmit, onCancel }: ServiceFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "pending",
    }
  });

  const handleSubmit = async (values: ServiceFormValues) => {
    setIsSubmitting(true);
    try {
      // Format date if it exists
      const formattedData = {
        ...values,
        due_date: values.due_date ? values.due_date : null,
      };

      await onSubmit(formattedData);
      form.reset();
    } catch (error) {
      console.error("Erro ao criar serviço:", error);
      toast.error("Erro ao criar serviço. Verifique os dados e tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <TitleField form={form} />
        <DescriptionField form={form} />
        <StatusField form={form} />
        <AreaField form={form} areas={areas} />
        <AssignedUserField form={form} users={users} />
        <DueDateField form={form} />
        <FormButtons isSubmitting={isSubmitting} onCancel={onCancel} />
      </form>
    </Form>
  );
};
