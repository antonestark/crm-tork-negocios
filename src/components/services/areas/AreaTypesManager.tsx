
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddAreaTypeForm } from "./AddAreaTypeForm";
import { AreaTypesList } from "./AreaTypesList";
import { useAreaTypes } from "./useAreaTypes";

export const AreaTypesManager = () => {
  const {
    areaTypes,
    loading,
    isSubmitting,
    editingId,
    setEditingId,
    handleAddType,
    handleUpdateType,
    handleDeleteType
  } = useAreaTypes();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciar Tipos de Áreas</CardTitle>
      </CardHeader>
      <CardContent>
        <AddAreaTypeForm 
          onAddType={handleAddType} 
          isSubmitting={isSubmitting} 
        />

        <AreaTypesList
          areaTypes={areaTypes}
          loading={loading}
          isSubmitting={isSubmitting}
          editingId={editingId}
          onEdit={(id) => setEditingId(id)}
          onCancelEdit={() => setEditingId(null)}
          onUpdate={handleUpdateType}
          onDelete={handleDeleteType}
        />
      </CardContent>
    </Card>
  );
};

export { AreaType } from './types';
