
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Lock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateAreaForm } from "./CreateAreaForm";
import { ServiceArea } from "@/hooks/use-service-areas-data";
import { toast } from "sonner";

interface CreateAreaDialogProps {
  onCreateArea: (data: Omit<ServiceArea, 'id' | 'task_count' | 'pending_tasks' | 'delayed_tasks'>) => Promise<void>;
  isSubmitting: boolean;
  isAuthenticated: boolean;
}

export const CreateAreaDialog = ({ onCreateArea, isSubmitting, isAuthenticated }: CreateAreaDialogProps) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && !isAuthenticated) {
      toast.error("Você precisa estar autenticado para criar uma área");
      return;
    }
    
    setOpen(newOpen);
    if (!newOpen) {
      setError(null); // Clear error when dialog is closed
    }
  };
  
  const handleSubmit = async (values: Omit<ServiceArea, 'id' | 'task_count' | 'pending_tasks' | 'delayed_tasks'>) => {
    try {
      if (!isAuthenticated) {
        setError("Você precisa estar autenticado para criar uma área.");
        return;
      }
      
      setError(null);
      console.log("Submitting form with values:", values);
      await onCreateArea(values);
      setOpen(false);
    } catch (err) {
      console.error("Error in dialog submit:", err);
      
      if (err instanceof Error) {
        if (err.message.includes("auth") || 
            err.message.includes("permission") || 
            err.message.includes("session") ||
            err.message.includes("token") ||
            err.message.includes("JWT")) {
          setError("Erro de autenticação. Por favor, faça login novamente.");
        } else {
          setError(err.message);
        }
      } else {
        setError("Erro ao criar área");
      }
      // Keep the dialog open so the user can see the error
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button disabled={!isAuthenticated}>
          {isAuthenticated ? (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Nova Área
            </>
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Login Necessário
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Nova Área</DialogTitle>
        </DialogHeader>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}
        <CreateAreaForm 
          onSubmit={handleSubmit} 
          onCancel={() => setOpen(false)} 
          isSubmitting={isSubmitting} 
        />
      </DialogContent>
    </Dialog>
  );
};
