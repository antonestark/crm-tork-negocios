
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { createService } from '@/services/service';
import { toast } from 'sonner';
import { DialogServiceFormProps } from './types';
import { useServiceForm } from './useServiceForm';
import { 
  TitleField, 
  DescriptionField, 
  StatusField, 
  AreaField,
  DateField 
} from './DialogFormFields';
import { DialogFooterButtons } from './DialogFooterButtons';

export function ServiceFormDialog({ open, setOpen, onSuccess }: DialogServiceFormProps) {
  const {
    title, setTitle,
    description, setDescription,
    status, setStatus,
    areaId, setAreaId,
    assignedTo, setAssignedTo,
    dueDate, setDueDate,
    areas, loading, setLoading,
    areasLoading, resetForm
  } = useServiceForm(open);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('O título é obrigatório');
      return;
    }

    try {
      setLoading(true);
      
      const serviceData = {
        title,
        description,
        status,
        area_id: areaId || null,
        assigned_to: assignedTo || null,
        due_date: dueDate ? dueDate.toISOString() : null
      };

      await createService(serviceData);
      
      toast.success('Serviço criado com sucesso');
      resetForm();
      setOpen(false);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating service:', error);
      toast.error('Erro ao criar serviço');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) {
        resetForm();
      }
      setOpen(newOpen);
    }}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Novo Serviço</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para criar um novo serviço.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <TitleField title={title} setTitle={setTitle} />
          <DescriptionField description={description} setDescription={setDescription} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatusField status={status} setStatus={setStatus} />
            <AreaField 
              areaId={areaId} 
              setAreaId={setAreaId} 
              areas={areas} 
              areasLoading={areasLoading} 
            />
          </div>
          
          <DateField dueDate={dueDate} setDueDate={setDueDate} />
          
          <DialogFooterButtons loading={loading} onCancel={() => setOpen(false)} />
        </form>
      </DialogContent>
    </Dialog>
  );
}
