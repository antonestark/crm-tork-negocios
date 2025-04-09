
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Info, Play, CheckCircle2 } from "lucide-react";
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
import { useAuthState } from "@/hooks/use-auth-state";
import { useCheckDepartment } from "@/hooks/use-check-department";

type ChecklistItemsProps = {
  period: string;
  onlyResponsible?: boolean;
  date?: string; // nova prop para filtro por data
  responsibleIdFilter?: string; // nova prop para filtro por responsável
};

type Area = {
  id: string;
  name: string;
};

type User = {
  id: string;
  name: string;
};

export const ChecklistItems = ({ period, onlyResponsible = false, date, responsibleIdFilter }: ChecklistItemsProps) => {
  const { items, loading, toggleItemStart, toggleItemCompletion, addChecklistItem } = useServiceChecklist(
    period,
    onlyResponsible,
    date,
    responsibleIdFilter
  );
  const { userId } = useAuthState();
  const { isInDepartment: isOperationUser } = useCheckDepartment("Operação");

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [responsible, setResponsible] = useState<string | undefined>(undefined);
  const [responsibleId, setResponsibleId] = useState<string | undefined>(undefined);
  const [areaId, setAreaId] = useState<string | undefined>(undefined);
  const [departmentId, setDepartmentId] = useState<number | undefined>(undefined);
  const [areas, setAreas] = useState<Area[]>([]);
  const [departments, setDepartments] = useState<{id: number, name: string}[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAreas = async () => {
      const { data, error } = await supabase.from("service_areas").select("id, name");
      if (!error && data) {
        setAreas(data);
      }
    };

    const fetchDepartments = async () => {
      const { data, error } = await supabase.from("departments").select("id, name");
      if (!error && data) {
        setDepartments(data);
        // Set Operations department as default
        const opDept = data.find(d => d.name === "Operação");
        if (opDept) {
          setDepartmentId(opDept.id);
        }
      }
    };

    const fetchUsers = async () => {
      const { data, error } = await supabase.from("users").select("id, name");
      if (!error && data) {
        setUsers(data);
      }
    };

    fetchAreas();
    fetchDepartments();
    fetchUsers();
  }, []);

  const handleToggleStart = async (item: ChecklistItem) => {
    // Only allow if this user is the responsible person or if the item has no responsible_id
    if (item.responsible_id && item.responsible_id !== userId) return;
    
    const newStarted = item.status === 'pending';
    await toggleItemStart(item.id, newStarted);
  };

  const handleToggleComplete = async (item: ChecklistItem) => {
    // Only allow if this user is the responsible person or if the item has no responsible_id
    if (item.responsible_id && item.responsible_id !== userId) return;
    
    // Only allow completion if already started
    if (item.status !== 'in_progress') return;
    
    const newCompleted = true; // Always set to true when toggling to completed from in_progress
    await toggleItemCompletion(item.id, newCompleted);
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setSaving(true);
    const success = await addChecklistItem({
      name,
      description,
      period,
      area_id: areaId,
      responsible: responsible,
      responsible_id: responsibleId,
      department_id: departmentId,
    });
    if (success) {
      setName("");
      setDescription("");
      setResponsible(undefined);
      setResponsibleId(undefined);
      setAreaId(undefined);
      setShowForm(false);
    }
    setSaving(false);
  };

  // Botão sempre visível para todos os usuários
  const canAddItems = true;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Checklist</h2>
        {canAddItems && (
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancelar" : "Adicionar item"}
          </Button>
        )}
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
              value={responsibleId || ""}
              onChange={(e) => {
                const selectedId = e.target.value || undefined;
                setResponsibleId(selectedId);
                const selectedUser = users.find(u => u.id === selectedId);
                setResponsible(selectedUser?.name);
              }}
              className="border border-gray-600 rounded px-2 py-1 bg-gray-900 text-gray-200"
            >
              <option value="">Selecione um usuário</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-200">Departamento</label>
            <select
              value={departmentId?.toString() || ""}
              onChange={(e) => setDepartmentId(e.target.value ? parseInt(e.target.value) : undefined)}
              className="border border-gray-600 rounded px-2 py-1 bg-gray-900 text-gray-200"
            >
              <option value="">Selecione um departamento</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
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
        items.map((item) => {
          // Check if current user is responsible for this item
          const isResponsible = !item.responsible_id || item.responsible_id === userId;
          const canInteract = isResponsible;
          
          // Determine item status and styling
          const isPending = item.status === 'pending';
          const isInProgress = item.status === 'in_progress';
          const isCompleted = item.status === 'completed';
          
          return (
            <div
              key={item.id}
              className={`flex items-start justify-between p-4 rounded-lg border ${
                isCompleted 
                  ? "bg-green-900/20 border-green-700" 
                  : isInProgress 
                    ? "bg-blue-900/20 border-blue-700"
                    : "bg-gray-800 border-gray-700"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex flex-col gap-2 items-center mt-1">
                  <button
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      isInProgress || isCompleted 
                        ? "bg-blue-500 text-white" 
                        : "bg-gray-700 text-gray-300"
                    } ${!canInteract ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-blue-600"}`}
                    onClick={() => canInteract && handleToggleStart(item)}
                    disabled={!canInteract}
                  >
                    <Play size={14} />
                  </button>
                  
                  <button
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      isCompleted 
                        ? "bg-green-500 text-white" 
                        : "bg-gray-700 text-gray-300"
                    } ${!canInteract || !isInProgress ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-green-600"}`}
                    onClick={() => canInteract && isInProgress && handleToggleComplete(item)}
                    disabled={!canInteract || !isInProgress}
                  >
                    <CheckCircle2 size={14} />
                  </button>
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-medium ${
                        isCompleted ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {item.name}
                    </span>
                    {item.area_name && (
                      <Badge variant="outline" className="text-xs">
                        {item.area_name}
                      </Badge>
                    )}
                    <Badge 
                      variant={
                        isCompleted ? "success" : 
                        isInProgress ? "secondary" : 
                        "default"
                      } 
                      className="text-xs"
                    >
                      {isCompleted ? "Concluído" : isInProgress ? "Em andamento" : "Pendente"}
                    </Badge>
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
                  {item.start_date && (
                    <p className="text-sm text-muted-foreground mt-1">
                      <strong>Iniciado em:</strong> {new Date(item.start_date).toLocaleString()}
                    </p>
                  )}
                  {item.end_date && (
                    <p className="text-sm text-muted-foreground mt-1">
                      <strong>Finalizado em:</strong> {new Date(item.end_date).toLocaleString()}
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
          );
        })
      )}
    </div>
  );
};
