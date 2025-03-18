
import { CreateAreaDialog } from "./CreateAreaDialog";
import { AreaSubmitData } from "./hooks/useAreaForm";

interface AreasPageHeaderProps {
  onCreateArea: (data: AreaSubmitData) => Promise<void>;
  isSubmitting: boolean;
  isAuthenticated: boolean;
}

export const AreasPageHeader = ({ 
  onCreateArea, 
  isSubmitting, 
  isAuthenticated 
}: AreasPageHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-3xl font-bold tracking-tight">Áreas de Controle</h2>
      <CreateAreaDialog 
        onCreateArea={onCreateArea}
        isSubmitting={isSubmitting} 
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
};
