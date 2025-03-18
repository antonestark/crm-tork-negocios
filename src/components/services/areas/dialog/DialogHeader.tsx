
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { DialogTitle } from "@/components/ui/dialog";

interface DialogHeaderProps {
  showTypeManager: boolean;
  setShowTypeManager: (show: boolean) => void;
}

export const DialogHeader = ({ showTypeManager, setShowTypeManager }: DialogHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <DialogTitle>{showTypeManager ? "Gerenciar Tipos de Áreas" : "Criar Nova Área"}</DialogTitle>
      {!showTypeManager && (
        <Button variant="outline" size="sm" onClick={() => setShowTypeManager(true)}>
          <Settings className="mr-2 h-4 w-4" />
          Gerenciar Tipos
        </Button>
      )}
      {showTypeManager && (
        <Button variant="outline" size="sm" onClick={() => setShowTypeManager(false)}>
          Voltar ao Formulário
        </Button>
      )}
    </div>
  );
};
