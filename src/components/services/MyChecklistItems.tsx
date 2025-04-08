
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
import { useAuthState } from "@/hooks/use-auth-state";

type MyChecklistItemsProps = {
  period: string;
};

export const MyChecklistItems = ({ period }: MyChecklistItemsProps) => {
  const { items, loading, toggleItemStart, toggleItemCompletion } = useServiceChecklist(period, true);
  const { userId } = useAuthState();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Meus Itens do Checklist</h2>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Nenhum item atribuído a você neste período</p>
        </div>
      ) : (
        items.map((item) => {
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
                    } cursor-pointer hover:bg-blue-600`}
                    onClick={() => toggleItemStart(item.id, !isInProgress && !isCompleted)}
                  >
                    <Play size={14} />
                  </button>
                  
                  <button
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      isCompleted 
                        ? "bg-green-500 text-white" 
                        : "bg-gray-700 text-gray-300"
                    } ${!isInProgress ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-green-600"}`}
                    onClick={() => isInProgress && toggleItemCompletion(item.id, !isCompleted)}
                    disabled={!isInProgress}
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
                  {item.area_name && (
                    <p className="text-sm text-muted-foreground mt-1">
                      <strong>Área:</strong> {item.area_name}
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
