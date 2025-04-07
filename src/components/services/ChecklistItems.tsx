import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { AlertCircle, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useServiceChecklist, ChecklistItem } from "@/hooks/use-service-checklist";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

type ChecklistItemsProps = {
  period: string;
};

type Area = {
  id: string;
  name: string;
};

type User = {
  id: string;
  name: string;
};

export const ChecklistItems = ({ period }: ChecklistItemsProps) => {
  const { items, loading, toggleItemCompletion, addChecklistItem } = useServiceChecklist(period);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [responsible, setResponsible] = useState<string | undefined>(undefined);
  const [areaId, setAreaId] = useState<string | undefined>(undefined);
  const [areas, setAreas] = useState<Area[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAreas = async () => {
      const { data, error } = await supabase.from("service_areas").select("id, name");
      if (!error && data) {
        setAreas(data);
      }
    };
    fetchAreas();
  }, []);

  const users: User[] = [
    { id: "1", name: "Moisés Martins" },
    { id: "2", name: "Pricilene Gama" },
    { id: "3", name: "Railson Gama" },
    { id: "4", name: "Neto" },
    { id: "5", name: "Michele Daniele" }
  ];

  const handleToggle = async (item: ChecklistItem) => {
    await toggleItemCompletion(item.id, !item.completed);
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setSaving(true);
    const success = await addChecklistItem({
      name,
      description,
      period,
      area_id: areaId,
      responsible,
    });
    if (success) {
      setName("");
      setDescription("");
      setResponsible(undefined);
      setAreaId(undefined);
      setShowForm(false);
    }
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Checklist</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancelar" : "Adicionar item"}
        </Button>
      </div>

      {showForm && (
        <div className="space-y-3 border border-gray-700 p-4 rounded-lg bg-gray-800">
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-200">Turno</label>
            <input
              type="text"
              value={period}
              disabled
              className="border border-gray-600 rounded px-2 py-1 bg-gray-900 text-gray-200 placeholder-gray-400"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-200">Nome do item</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-600 rounded px-2 py-1 bg-gray-900 text-gray-200 placeholder-gray-400"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-200">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-600 rounded px-2 py-1 bg-gray-900 text-gray-200 placeholder-gray-400"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-200">Responsável</label>
            <select
              value={responsible || ""}
              onChange={(e) => setResponsible(e.target.value || undefined)}
              className="border border-gray-600 rounded px-2 py-1 bg-gray-900 text-gray-200"
            >
              <option value="">Selecione um usuário</option>
              {users.map((user) => (
                <option key={user.id} value={user.name}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-200">Área</label>
            <select
              value={areaId || ""}
              onChange={(e) => setAreaId(e.target.value || undefined)}
              className="border border-gray-600 rounded px-2 py-1 bg-gray-900 text-gray-200"
            >
              <option value="">Selecione uma área</option>
              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
          </div>
          <Button onClick={handleSubmit} disabled={saving || !name.trim()}>
            {saving ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Nenhum item no checklist para este período</p>
        </div>
      ) : (
        items.map((item) => (
          <div
            key={item.id}
            className={`flex items-start justify-between p-4 rounded-lg border ${
              item.completed ? "bg-green-50 border-green-200" : "bg-gray-800 border-gray-700"
            }`}
          >
            <div className="flex items-start gap-3">
              <Checkbox
                id={item.id}
                checked={item.completed}
                onCheckedChange={() => handleToggle(item)}
                className="mt-1"
              />
              <div>
                <div className="flex items-center gap-2">
                  <label
                    htmlFor={item.id}
                    className={`font-medium ${
                      item.completed ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {item.name}
                  </label>
                  {item.area_name && (
                    <Badge variant="outline" className="text-xs">
                      {item.area_name}
                    </Badge>
                  )}
                </div>
                {item.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.description}
                  </p>
                )}
                {item.responsible && (
                  <p className="text-sm text-muted-foreground mt-1">
                    <strong>Responsável:</strong> {item.responsible}
                  </p>
                )}
              </div>
            </div>

            {item.description && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        ))
      )}
    </div>
  );
};
