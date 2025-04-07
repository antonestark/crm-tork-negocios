
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { CreateAreaForm } from "./CreateAreaForm";
import { ServiceArea } from "@/hooks/use-service-areas-data";
import { supabase } from "@/integrations/supabase/client";
import { AreaSubmitData } from "./hooks/useAreaForm";

interface EditAreaDialogProps {
  area: ServiceArea | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => void;
}

export function EditAreaDialog({ area, open, onOpenChange, onUpdated }: EditAreaDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState<AreaSubmitData | null>(null);
  
  // Reset form values when area changes or dialog opens/closes
  useEffect(() => {
    if (area && open) {
      setFormValues({
        name: area.name,
        description: area.description || "",
        status: area.status as 'active' | 'inactive',
        type: area.type || ""
      });
    } else if (!open) {
      // Reset submitting state when dialog closes
      setIsSubmitting(false);
      
      // Clean up form values when dialog closes
      setTimeout(() => {
        setFormValues(null);
      }, 300); // Small delay to ensure dialog animation completes
    }
  }, [area, open]);

  const handleSubmit = async (values: AreaSubmitData) => {
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
      
      // Properly close the dialog with a clean state
      handleClose();
    } catch (error) {
      console.error("Error updating area:", error);
      toast.error("Erro ao atualizar área");
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isSubmitting) return; // Prevent cancellation while submitting
    handleClose();
  };

  const handleClose = () => {
    // First update the state
    setIsSubmitting(false);
    
    // Then close the dialog through the parent component
    onOpenChange(false);
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(newOpen) => {
        if (!isSubmitting) {
          onOpenChange(newOpen);
        }
      }}
    >
      <DialogContent 
        className="sm:max-w-md" 
        onInteractOutside={(e) => {
          // Prevent interaction outside when submitting
          if (isSubmitting) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          // Prevent escape key closing when submitting
          if (isSubmitting) {
            e.preventDefault();
          }
        }}
      >
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
