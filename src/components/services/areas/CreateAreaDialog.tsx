
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateAreaForm } from "./CreateAreaForm";
import { ServiceArea } from "@/hooks/use-service-areas-data";

interface CreateAreaDialogProps {
  onCreateArea: (data: Omit<ServiceArea, 'id' | 'task_count' | 'pending_tasks' | 'delayed_tasks'>) => Promise<void>;
  isSubmitting: boolean;
}

export const CreateAreaDialog = ({ onCreateArea, isSubmitting }: CreateAreaDialogProps) => {
  const [open, setOpen] = useState(false);
  
  const handleSubmit = async (values: Omit<ServiceArea, 'id' | 'task_count' | 'pending_tasks' | 'delayed_tasks'>) => {
    await onCreateArea(values);
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Área
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Nova Área</DialogTitle>
        </DialogHeader>
        <CreateAreaForm 
          onSubmit={handleSubmit} 
          onCancel={() => setOpen(false)} 
          isSubmitting={isSubmitting} 
        />
      </DialogContent>
    </Dialog>
  );
};
