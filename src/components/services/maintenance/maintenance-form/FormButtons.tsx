
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormButtonsProps {
  isSubmitting: boolean;
}

export const FormButtons = ({ isSubmitting }: FormButtonsProps) => (
  <Button type="submit" className="w-full" disabled={isSubmitting}>
    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
    {isSubmitting ? "Enviando..." : "Agendar Manutenção"}
  </Button>
);
