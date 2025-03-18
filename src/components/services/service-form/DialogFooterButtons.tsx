
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface DialogFooterButtonsProps {
  loading: boolean;
  onCancel: () => void;
}

export const DialogFooterButtons = ({ loading, onCancel }: DialogFooterButtonsProps) => (
  <DialogFooter className="pt-4">
    <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
      Cancelar
    </Button>
    <Button type="submit" disabled={loading}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Criar Serviço
    </Button>
  </DialogFooter>
);
