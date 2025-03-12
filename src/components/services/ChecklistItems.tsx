
import { useState } from "react";
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

type ChecklistItemsProps = {
  period: string;
};

export const ChecklistItems = ({ period }: ChecklistItemsProps) => {
  const { items, loading, toggleItemCompletion } = useServiceChecklist(period);
  
  const handleToggle = async (item: ChecklistItem) => {
    await toggleItemCompletion(item.id, !item.completed);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Nenhum item no checklist para este período</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className={`flex items-start justify-between p-4 rounded-lg border ${
            item.completed ? "bg-green-50 border-green-200" : "bg-white"
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
      ))}
    </div>
  );
};
