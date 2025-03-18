
import { Button } from "@/components/ui/button";

interface FormButtonsProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

export const FormButtons = ({ isSubmitting, onCancel }: FormButtonsProps) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancelar
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Enviando..." : "Criar Serviço"}
      </Button>
    </div>
  );
};
