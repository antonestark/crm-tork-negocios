
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Lock, Settings } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateAreaForm } from "./CreateAreaForm";
import { AreaTypesManager } from "./AreaTypesManager";
import { toast } from "sonner";

// Define what the form will submit
interface AreaFormData {
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  type: string;
}

interface CreateAreaDialogProps {
  onCreateArea: (data: AreaFormData) => Promise<void>;
  isSubmitting: boolean;
  isAuthenticated: boolean;
}

export const CreateAreaDialog = ({ onCreateArea, isSubmitting, isAuthenticated }: CreateAreaDialogProps) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTypeManager, setShowTypeManager] = useState(false);
  
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && !isAuthenticated) {
      toast.error("Você precisa estar autenticado para criar uma área");
      return;
    }
    
    setOpen(newOpen);
    if (!newOpen) {
      setError(null); // Clear error when dialog is closed
      setShowTypeManager(false); // Reset to form view when closing
    }
  };
  
  const handleSubmit = async (values: AreaFormData) => {
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>{showTypeManager ? "Gerenciar Tipos de Áreas" : "Criar Nova Área"}</DialogTitle>
            {!showTypeManager && (
              <Button variant="outline" size="sm" onClick={() => setShowTypeManager(true)}>
                <Settings className="mr-2 h-4 w-4" />
                Gerenciar Tipos
              </Button>
            )}
            {showTypeManager && (
              <Button variant="outline" size="sm" onClick={() => setShowTypeManager(false)}>
                Voltar ao Formulário
              </Button>
            )}
          </div>
        </DialogHeader>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}
        
        {showTypeManager ? (
          <AreaTypesManager />
        ) : (
          <CreateAreaForm 
            onSubmit={handleSubmit} 
            onCancel={() => setOpen(false)} 
            isSubmitting={isSubmitting} 
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
