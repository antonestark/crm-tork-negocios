
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ServiceForm } from "./ServiceForm";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface ServiceFormDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess?: () => void;
}

export const ServiceFormDialog = ({ open, setOpen, onSuccess }: ServiceFormDialogProps) => {
  const [areas, setAreas] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (open) {
      fetchAreas();
      fetchUsers();
    }
  }, [open]);

  const fetchAreas = async () => {
    try {
      const { data, error } = await supabase
        .from("service_areas")
        .select("*")
        .order("name");

      if (error) throw error;
      setAreas(data || []);
    } catch (error) {
      console.error("Error fetching areas:", error);
      toast.error("Erro ao carregar áreas");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("name");

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Erro ao carregar usuários");
    }
  };

  const handleSubmit = async (formData: any) => {
    try {
      const { data, error } = await supabase
        .from("services")
        .insert([formData])
        .select()
        .single();

      if (error) throw error;

      toast.success("Serviço criado com sucesso!");
      setOpen(false);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating service:", error);
      toast.error("Erro ao criar serviço");
      throw error; // Re-throw to be handled by the form
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Novo Serviço</DialogTitle>
        </DialogHeader>
        <ServiceForm
          areas={areas}
          users={users}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
