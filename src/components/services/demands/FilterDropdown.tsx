
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface FilterDropdownProps {
  resetFilter: () => void;
  applyFilter: (status: string) => void;
}

export function FilterDropdown({ resetFilter, applyFilter }: FilterDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filtrar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={resetFilter}>
          Todos
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyFilter("pending")}>
          Pendentes
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyFilter("in_progress")}>
          Em Andamento
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyFilter("completed")}>
          Concluídos
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyFilter("delayed")}>
          Atrasados
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyFilter("cancelled")}>
          Cancelados
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
