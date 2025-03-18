
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { CreateAreaForm } from "./CreateAreaForm";
import { ServiceArea } from "@/hooks/use-service-areas-data";
import { supabase } from "@/integrations/supabase/client";

interface AreaFormData {
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  type: string;
}

interface EditAreaDialogProps {
  area: ServiceArea | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => void;
}

export function EditAreaDialog({ area, open, onOpenChange, onUpdated }: EditAreaDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState<AreaFormData | null>(null);
  
  useEffect(() => {
    if (area) {
      setFormValues({
        name: area.name,
        description: area.description || "",
        status: area.status as 'active' | 'inactive',
        type: area.type || ""
      });
    }
  }, [area]);

  const handleSubmit = async (values: AreaFormData) => {
    try {
      if (!area) return;
      
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('service_areas')
        .update({
          name: values.name,
          description: values.description,
          status: values.status,
          type: values.type
        })
        .eq('id', area.id);

      if (error) throw error;
      
      toast.success("Área atualizada com sucesso");
      onUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating area:", error);
      toast.error("Erro ao atualizar área");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Área</DialogTitle>
        </DialogHeader>
        
        {formValues && (
          <CreateAreaForm 
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            initialValues={formValues}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
