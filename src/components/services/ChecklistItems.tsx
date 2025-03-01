
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type ChecklistItemsProps = {
  items: any[];
};

export const ChecklistItems = ({ items }: ChecklistItemsProps) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);

  const handleCheck = (id: string, checked: boolean) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: checked
    }));
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      // Obter IDs dos itens marcados
      const checkedIds = Object.entries(checkedItems)
        .filter(([_, checked]) => checked)
        .map(([id]) => id);

      if (checkedIds.length === 0) {
        toast.warning("Nenhum item selecionado");
        return;
      }

      // Criar registros de tarefas concluídas
      const serviceEntries = checkedIds.map(id => ({
        checklist_item_id: id,
        status: "completed",
        service_id: "00000000-0000-0000-0000-000000000000", // Placeholder UUID
        comments: "Verificado via sistema"
      }));

      const { error } = await supabase
        .from("service_checklist_completed")
        .insert(serviceEntries);

      if (error) throw error;

      toast.success(`${checkedIds.length} itens marcados como concluídos!`);
      
      // Limpar checagens após salvar
      setCheckedItems({});
    } catch (error) {
      console.error("Erro ao salvar itens de checklist:", error);
      toast.error("Erro ao salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhuma tarefa cadastrada para este período
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="flex items-start space-x-4 p-4 rounded-lg border hover:bg-slate-50"
          >
            <Checkbox 
              id={item.id} 
              checked={!!checkedItems[item.id]}
              onCheckedChange={(checked) => handleCheck(item.id, !!checked)}
            />
            <div className="space-y-1">
              <label 
                htmlFor={item.id} 
                className="font-medium cursor-pointer"
              >
                {item.name}
              </label>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span>Área: {item.service_areas?.name || "Não especificada"}</span>
                {item.expected_time && (
                  <span>Tempo estimado: {item.expected_time}</span>
                )}
                {item.priority && (
                  <span>
                    Prioridade: {
                      item.priority === 'high' ? 'Alta' : 
                      item.priority === 'medium' ? 'Média' : 
                      'Baixa'
                    }
                  </span>
                )}
              </div>
              {item.description && (
                <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Salvando..." : "Salvar verificações"}
        </Button>
      </div>
    </div>
  );
};
