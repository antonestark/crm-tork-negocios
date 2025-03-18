
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface NewAreaType {
  name: string;
  code: string;
}

interface AddAreaTypeFormProps {
  onAddType: (newType: NewAreaType) => Promise<void>;
  isSubmitting: boolean;
}

export const AddAreaTypeForm = ({ onAddType, isSubmitting }: AddAreaTypeFormProps) => {
  const [newType, setNewType] = useState<NewAreaType>({ name: '', code: '' });

  const handleSubmit = async () => {
    await onAddType(newType);
    setNewType({ name: '', code: '' });
  };

  return (
    <div className="mb-4 flex gap-2">
      <Input 
        placeholder="Nome do tipo" 
        value={newType.name} 
        onChange={(e) => setNewType(prev => ({ ...prev, name: e.target.value }))}
        disabled={isSubmitting}
      />
      <Input 
        placeholder="Código (slug)" 
        value={newType.code} 
        onChange={(e) => setNewType(prev => ({ 
          ...prev, 
          code: e.target.value.toLowerCase().replace(/\s+/g, '_') 
        }))}
        disabled={isSubmitting}
      />
      <Button onClick={handleSubmit} disabled={isSubmitting}>
        <Plus className="h-4 w-4 mr-2" />
        Adicionar
      </Button>
    </div>
  );
};
