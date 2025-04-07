
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { toast } from "sonner";
import { CreateAreaForm } from "./CreateAreaForm";
import { ServiceArea } from "@/hooks/use-service-areas-data";
import { supabase } from "@/integrations/supabase/client";
import { AreaSubmitData } from "./hooks/useAreaForm";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface EditAreaDialogProps {
  area: ServiceArea | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => void;
}

export function EditAreaDialog({ area, open, onOpenChange, onUpdated }: EditAreaDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState<AreaSubmitData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Reset form values when area changes or dialog opens/closes
  useEffect(() => {
    if (area && open) {
      setFormValues({
        name: area.name,
        description: area.description || "",
        status: area.status as 'active' | 'inactive',
        type: area.type || ""
      });
      // Clear any previous errors
      setError(null);
    } else if (!open) {
      // Reset submitting state immediately when dialog closes
      setIsSubmitting(false);
      setError(null);
      
      // Clean up form values with a delay to ensure smooth transition
      setTimeout(() => {
        setFormValues(null);
      }, 300); // Small delay to ensure dialog animation completes
    }
  }, [area, open]);

  // Make sure isSubmitting is reset if component unmounts
  useEffect(() => {
    return () => {
      setIsSubmitting(false);
      setError(null);
      setFormValues(null);
    };
  }, []);

  const handleSubmit = async (values: AreaSubmitData) => {
    try {
      if (!area) return;
      
      setIsSubmitting(true);
      setError(null);
      
      const { error: updateError } = await supabase
        .from('service_areas')
        .update({
          name: values.name,
          description: values.description,
          status: values.status,
          type: values.type
        })
        .eq('id', area.id);

      if (updateError) throw updateError;
      
      toast.success("Área atualizada com sucesso");
      onUpdated();
      
      // Close the dialog with a clean state
      handleClose();
    } catch (error) {
      console.error("Error updating area:", error);
      
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Erro ao atualizar área");
      }
      
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
    setError(null);
    
    // Then close the dialog through the parent component
    onOpenChange(false);
  };

  // Force close function (for emergency closing)
  const forceClose = () => {
    setIsSubmitting(false);
    setError(null);
    setFormValues(null);
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
        <div className="absolute right-4 top-4 flex items-center gap-2">
          {isSubmitting && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={forceClose}
              className="px-2 h-6 text-xs"
            >
              Forçar fechar
            </Button>
          )}
          <DialogClose asChild>
            <Button 
              variant="ghost" 
              className="h-6 w-6 p-0 rounded-md" 
              disabled={isSubmitting}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </div>
        
        <DialogHeader>
          <DialogTitle>Editar Área</DialogTitle>
        </DialogHeader>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}
        
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
