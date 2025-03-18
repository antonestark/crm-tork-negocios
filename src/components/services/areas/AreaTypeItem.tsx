
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Trash2, X } from "lucide-react";
import { AreaType } from "./types";

interface AreaTypeItemProps {
  type: AreaType;
  isEditing: boolean;
  isSubmitting: boolean;
  onEdit: (id: string) => void;
  onUpdate: (id: string, data: Partial<AreaType>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onCancelEdit: () => void;
}

export const AreaTypeItem = ({
  type,
  isEditing,
  isSubmitting,
  onEdit,
  onUpdate,
  onDelete,
  onCancelEdit,
}: AreaTypeItemProps) => {
  const [updatedType, setUpdatedType] = useState(type);

  const handleChange = (field: keyof AreaType, value: string) => {
    setUpdatedType((prev) => ({
      ...prev,
      [field]: field === 'code' ? value.toLowerCase().replace(/\s+/g, '_') : value,
    }));
  };

  return (
    <div key={type.id} className="flex items-center gap-2 p-2 border rounded">
      {isEditing ? (
        <>
          <Input
            value={updatedType.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="flex-1"
          />
          <Input
            value={updatedType.code}
            onChange={(e) => handleChange('code', e.target.value)}
            className="flex-1"
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onUpdate(type.id, {
              name: updatedType.name,
              code: updatedType.code
            })}
            disabled={isSubmitting}
          >
            <Save className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onCancelEdit}
          >
            <X className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <>
          <span className="flex-1">{type.name}</span>
          <span className="text-sm text-muted-foreground">{type.code}</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(type.id)}
            disabled={isSubmitting}
          >
            Editar
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(type.id)}
            disabled={isSubmitting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
};
