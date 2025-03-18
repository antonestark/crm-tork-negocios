
import { AreaType } from "./types";
import { AreaTypeItem } from "./AreaTypeItem";

interface AreaTypesListProps {
  areaTypes: AreaType[];
  loading: boolean;
  isSubmitting: boolean;
  editingId: string | null;
  onEdit: (id: string) => void;
  onCancelEdit: () => void;
  onUpdate: (id: string, data: Partial<AreaType>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const AreaTypesList = ({
  areaTypes,
  loading,
  isSubmitting,
  editingId,
  onEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
}: AreaTypesListProps) => {
  if (loading) {
    return <div className="py-4 text-center text-muted-foreground">Carregando tipos de áreas...</div>;
  }

  if (areaTypes.length === 0) {
    return <div className="py-4 text-center text-muted-foreground">Nenhum tipo de área cadastrado</div>;
  }

  return (
    <div className="space-y-2">
      {areaTypes.map((type) => (
        <AreaTypeItem
          key={type.id}
          type={type}
          isEditing={editingId === type.id}
          isSubmitting={isSubmitting}
          onEdit={onEdit}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onCancelEdit={onCancelEdit}
        />
      ))}
    </div>
  );
};
