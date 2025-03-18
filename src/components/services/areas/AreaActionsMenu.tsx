
import { MoreHorizontal, Edit, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ServiceArea } from "@/hooks/use-service-areas-data";
import { useState } from "react";
import { ConfirmDialog } from "@/components/admin/shared/ConfirmDialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AreaActionsMenuProps {
  area: ServiceArea;
  onEdit: (area: ServiceArea) => void;
  onDeleted: () => void;
}

export function AreaActionsMenu({ area, onEdit, onDeleted }: AreaActionsMenuProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggleStatusLoading, setIsToggleStatusLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      // Check if the area has associated services
      const { count, error: countError } = await supabase
        .from('services')
        .select('id', { count: 'exact', head: true })
        .eq('area_id', area.id);
        
      if (countError) throw countError;
      
      if (count && count > 0) {
        toast.error("Esta área não pode ser excluída porque possui serviços associados");
        setDeleteDialogOpen(false);
        return;
      }

      // Proceed with deletion
      const { error } = await supabase
        .from('service_areas')
        .delete()
        .eq('id', area.id);

      if (error) throw error;
      
      toast.success("Área excluída com sucesso");
      onDeleted();
    } catch (error) {
      console.error('Error deleting area:', error);
      toast.error("Erro ao excluir área");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const toggleStatus = async () => {
    try {
      setIsToggleStatusLoading(true);
      
      const newStatus = area.status === 'active' ? 'inactive' : 'active';
      
      const { error } = await supabase
        .from('service_areas')
        .update({ status: newStatus })
        .eq('id', area.id);

      if (error) throw error;
      
      toast.success(`Área ${newStatus === 'active' ? 'ativada' : 'desativada'} com sucesso`);
      onDeleted(); // Refresh the list
    } catch (error) {
      console.error('Error toggling area status:', error);
      toast.error("Erro ao alterar status da área");
    } finally {
      setIsToggleStatusLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Ações</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(area)}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </DropdownMenuItem>
          <DropdownMenuItem onClick={toggleStatus} disabled={isToggleStatusLoading}>
            {area.status === 'active' ? (
              <>
                <X className="mr-2 h-4 w-4" />
                Desativar
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Ativar
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Excluir área"
        description="Tem certeza que deseja excluir esta área? Esta ação não pode ser desfeita."
        onConfirm={handleDelete}
        confirmText={isDeleting ? "Excluindo..." : "Excluir"}
        cancelText="Cancelar"
        variant="destructive"
      />
    </>
  );
}
