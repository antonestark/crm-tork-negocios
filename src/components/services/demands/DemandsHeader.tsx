
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FilterDropdown } from "./FilterDropdown";

interface DemandsHeaderProps {
  openDemandForm: () => void;
  resetFilter: () => void;
  applyFilter: (status: string) => void;
}

export function DemandsHeader({ openDemandForm, resetFilter, applyFilter }: DemandsHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-3xl font-bold tracking-tight">Demandas</h2>
      <div className="flex gap-2">
        <FilterDropdown 
          resetFilter={resetFilter} 
          applyFilter={applyFilter} 
        />
        <Button onClick={openDemandForm}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Demanda
        </Button>
      </div>
    </div>
  );
}
