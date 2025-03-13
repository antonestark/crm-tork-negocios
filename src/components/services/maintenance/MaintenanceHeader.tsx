
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface MaintenanceHeaderProps {
  openDialog: () => void;
}

export const MaintenanceHeader = ({ openDialog }: MaintenanceHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-3xl font-bold tracking-tight">Manutenções</h2>
      <Button onClick={openDialog}>
        <Plus className="mr-2 h-4 w-4" />
        Nova Manutenção
      </Button>
    </div>
  );
};
