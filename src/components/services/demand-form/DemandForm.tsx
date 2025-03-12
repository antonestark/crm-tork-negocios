
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { DemandCreate } from '@/types/demands';
import { formSchema, FormValues, DemandFormProps } from './types';
import { useFormData } from './useFormData';
import { BasicInfoFields } from './BasicInfoFields';
import { UserAssignmentFields } from './UserAssignmentFields';
import { MetadataFields } from './MetadataFields';
import { DescriptionField } from './DescriptionField';
import { toast } from 'sonner';

export const DemandForm: React.FC<DemandFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  demand
}) => {
  const { areas, users, loading } = useFormData(open);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: demand?.title || '',
      description: demand?.description || '',
      area_id: demand?.area_id || '',
      priority: demand?.priority || 'medium',
      assigned_to: demand?.assigned_to || '',
      requested_by: demand?.requested_by || '',
      due_date: demand?.due_date ? new Date(demand.due_date) : undefined,
      status: demand?.status || 'pending'
    }
  });
  
  // Reset form when demand changes or dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        title: demand?.title || '',
        description: demand?.description || '',
        area_id: demand?.area_id || '',
        priority: demand?.priority || 'medium',
        assigned_to: demand?.assigned_to || '',
        requested_by: demand?.requested_by || '',
        due_date: demand?.due_date ? new Date(demand.due_date) : undefined,
        status: demand?.status || 'pending'
      });
    }
  }, [open, demand, form]);
  
  const handleSubmit = async (values: FormValues) => {
    try {
      console.log("Submitting demand form values:", values);
      
      const demandData: DemandCreate = {
        ...(demand?.id ? { id: demand.id } : {}),
        title: values.title,
        description: values.description,
        area_id: values.area_id,
        priority: values.priority,
        assigned_to: values.assigned_to || null,
        requested_by: values.requested_by || null,
        due_date: values.due_date,
        status: values.status
      };

      console.log("Prepared demand data:", demandData);
      const success = await onSubmit(demandData);
      
      if (success) {
        toast.success(demand?.id ? "Demanda atualizada com sucesso" : "Demanda criada com sucesso");
        form.reset();
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error submitting demand:", error);
      toast.error("Ocorreu um erro ao salvar a demanda");
    }
  };

  const isEditing = !!demand?.id;

  if (loading) {
    return <div className="p-4 text-center">Carregando formulário...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <BasicInfoFields form={form} areas={areas} />
        <UserAssignmentFields form={form} users={users} />
        <MetadataFields form={form} />
        <DescriptionField form={form} />
        
        <DialogFooter>
          <Button type="submit">{isEditing ? 'Salvar Alterações' : 'Criar Demanda'}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
