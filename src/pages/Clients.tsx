import React, { useState } from 'react'; // Import React and useState
import { ClientsTable } from "@/components/clients/ClientsTable";
import { BaseLayout } from "@/components/layout/BaseLayout";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // Import Dialog components
import { ClientForm } from '@/components/clients/ClientForm'; // Import ClientForm
import { ClientFormValues } from '@/components/clients/ClientForm'; // Import form values type
import { Client } from '@/types/clients'; // Import Client type
import { toast } from "sonner"; // Import toast
// Import service functions (Moved to top level)
import { createClient, updateClient } from '@/services/clients-service'; 
// Import useMutation and useQueryClient for data handling (Moved to top level)
import { useMutation, useQueryClient } from '@tanstack/react-query';

const Clients = () => {
  // Add state for Dialog and selected client
  const [open, setOpen] = useState(false); 
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // ... inside Clients component ...
  const queryClient = useQueryClient(); // Get query client instance

  // Mutation for creating/updating client
  const clientMutation = useMutation({
    mutationFn: async (values: ClientFormValues) => {
      if (selectedClient) {
        // Update existing client
        return updateClient(selectedClient.id, values);
      } else {
        // Create new client
        return createClient(values);
      }
    },
    onSuccess: (data) => {
      toast.success(`Cliente ${selectedClient ? 'atualizado' : 'criado'} com sucesso!`);
      setOpen(false); // Close dialog on success
      setSelectedClient(null); // Reset selected client
      // Invalidate clients query to refetch data in the table
      queryClient.invalidateQueries({ queryKey: ['clients'] }); 
    },
    onError: (error) => {
      console.error("Error saving client:", error);
      toast.error(`Erro ao ${selectedClient ? 'atualizar' : 'criar'} cliente`, {
        description: error.message || "Ocorreu um erro inesperado.",
      });
    },
  });

  // Updated handleSubmit function
  const handleSubmit = (values: ClientFormValues) => { 
    console.log("Submitting form values:", values); 
    clientMutation.mutate(values); // Trigger the mutation
  };

  // Add prepareInitialValues function
  const prepareInitialValues = (client: Client | null): ClientFormValues | undefined => {
    if (!client) return undefined;
    return {
      ...client,
      tags: client.tags || [], // Ensure tags is an array for the form state
    };
  };

  return (
    <BaseLayout>
      {/* Removed max-w-7xl and mx-auto */}
      <div className="py-6 px-4"> 
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 animate-fade-in">
          <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] pb-1">
            Clientes
          </h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Buscar cliente..." 
                className="pl-8 bg-white/50 dark:bg-slate-900/50 border-blue-900/40 text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-blue-500"
              />
            </div>
            {/* Wrap Button with DialogTrigger */}
            <Dialog open={open} onOpenChange={(isOpen) => {
              setOpen(isOpen);
              // Reset selected client when dialog closes
              if (!isOpen) {
                setSelectedClient(null);
              }
            }}>
              <DialogTrigger asChild>
                <Button 
                  className="group border border-blue-500/50 text-blue-400 hover:border-blue-400 hover:bg-blue-950/30 rounded-full transition-all duration-300 relative overflow-hidden"
                  // Clear selected client when opening for a new client
                  onClick={() => setSelectedClient(null)} 
                >
                  <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  <span className="relative z-10">Novo Cliente</span>
                  <span className="absolute inset-0 w-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 transition-all duration-300 group-hover:w-full"></span>
                </Button>
              </DialogTrigger>
              {/* Add DialogContent */}
              {/* Adicionado classes para tema escuro */}
              <DialogContent className="sm:max-w-[625px] bg-card text-card-foreground border-border">
                <DialogHeader>
                  <DialogTitle>{selectedClient ? "Editar Cliente" : "Criar Novo Cliente"}</DialogTitle>
                  <DialogDescription>
                    {selectedClient ? "Edite os dados do cliente selecionado." : "Adicione um novo cliente à sua lista."}
                  </DialogDescription>
                </DialogHeader>
                <ClientForm 
                  onSubmit={handleSubmit} 
                  initialValues={prepareInitialValues(selectedClient)} 
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="bg-[#094067] dark:bg-slate-900/50 backdrop-blur-md border border-blue-900/40 rounded-lg shadow-lg overflow-hidden animate-fade-in">
          {/* Pass setOpen and setSelectedClient to ClientsTable if edit needs to be triggered from there */}
          <ClientsTable /> 
        </div>
      </div>
    </BaseLayout>
  );
};

export default Clients;
