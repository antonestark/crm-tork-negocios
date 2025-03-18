
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  isEditMode: boolean;
}

export const FormActions = ({ onCancel, isSubmitting, isEditMode }: FormActionsProps) => {
  return (
    <div className="flex justify-end gap-2 pt-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting 
          ? (isEditMode ? 'Atualizando...' : 'Criando...') 
          : (isEditMode ? 'Atualizar Área' : 'Criar Área')
        }
      </Button>
    </div>
  );
};
