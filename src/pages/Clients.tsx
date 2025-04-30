import React, { useState } from 'react';
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
} from "@/components/ui/dialog";
import { ClientForm } from '@/components/clients/ClientForm';
import { ClientFormValues } from '@/components/clients/ClientForm';
import { Client } from '@/types/clients';
import { toast } from "sonner";
import { createClient, updateClient, deleteClient } from '@/services/clients-service'; // Import deleteClient
import { createVisitor } from '@/services/visitors-service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ClientDetailsDialog } from '@/components/clients/ClientDetailsDialog'; // Import Details Dialog
import { VisitorForm } from '@/components/visitors/VisitorForm';
import { VisitorFormValues } from '@/components/visitors/visitorFormSchema';
import { supabase } from '@/integrations/supabase/client'; // Import supabase client
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Import Tabs components
import { VisitorsTable } from '@/components/visitors/VisitorsTable'; // Import VisitorsTable

// --- Visitor Mutation Hook ---
// Moved inside the component or defined appropriately if needed globally
// const useVisitorMutation = (onSuccessCallback?: () => void) => { ... };

// --- Clients Component ---
const Clients = () => {
  // State for Client Dialog
  const [clientDialogOpen, setClientDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null); // Used for Edit and Details
  // State for Visitor Dialog
  const [visitorDialogOpen, setVisitorDialogOpen] = useState(false);
  // State for Details Dialog
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const queryClient = useQueryClient(); // Get query client instance

  // --- Client Mutation ---
  const clientMutation = useMutation({
    mutationFn: async (values: ClientFormValues) => {
      // Log the session just before the call
      const { data: { session } } = await supabase.auth.getSession();
      console.log('[Clients.tsx] Session before mutation:', session);

      if (selectedClient) {
        return updateClient(selectedClient.id, values);
      } else {
        return createClient(values);
      }
    },
    onSuccess: () => {
      toast.success(`Cliente ${selectedClient ? 'atualizado' : 'criado'} com sucesso!`);
      setClientDialogOpen(false);
      setSelectedClient(null);
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
    onError: (error) => {
      console.error("Error saving client:", error);
      toast.error(`Erro ao ${selectedClient ? 'atualizar' : 'criar'} cliente`, {
        description: error.message || "Ocorreu um erro inesperado.",
      });
    },
  });

  // --- Client Delete Mutation ---
  const clientDeleteMutation = useMutation({
    mutationFn: deleteClient, // Use the deleteClient service function
    onSuccess: () => {
      toast.success(`Cliente excluído com sucesso!`);
      queryClient.invalidateQueries({ queryKey: ['clients'] }); // Refetch clients list
    },
    onError: (error) => {
      console.error("Error deleting client:", error);
      toast.error(`Erro ao excluir cliente`, {
        description: error.message || "Ocorreu um erro inesperado.",
      });
    },
  });

  // Client form submit handler
  const handleClientSubmit = (values: ClientFormValues) => {
    console.log("Submitting client form values:", values);
    clientMutation.mutate(values);
  };

  // Prepare initial values for ClientForm
  const prepareClientInitialValues = (client: Client | null): ClientFormValues | undefined => {
    if (!client) return undefined;
    return {
      ...client,
      tags: client.tags || [],
    };
  };

  // --- Visitor Mutation (defined inside component) ---
  const visitorMutation = useMutation({
    mutationFn: createVisitor,
    onSuccess: () => {
      toast.success("Visitante registrado com sucesso!");
      setVisitorDialogOpen(false); // Close dialog on success
      // Optionally invalidate visitor queries if a visitor list exists
      // queryClient.invalidateQueries({ queryKey: ['visitors'] });
    },
    onError: (error) => {
      console.error("Error saving visitor:", error);
      toast.error("Erro ao registrar visitante", {
        description: error.message || "Ocorreu um erro inesperado.",
      });
    },
  });

  // Visitor form submit handler
  const handleVisitorSubmit = (values: VisitorFormValues) => {
    console.log("Submitting visitor form values:", values);
    visitorMutation.mutate(values);
  };

  return (
    <BaseLayout>
      <div className="py-6 px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 animate-fade-in">
          <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] pb-1">
            Clientes
          </h2>
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Search Input (Placeholder) */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar cliente..."
                className="pl-8 bg-white/50 dark:bg-slate-900/50 border-blue-900/40 text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-blue-500"
              />
            </div>

            {/* Client Dialog */}
            <Dialog open={clientDialogOpen} onOpenChange={(isOpen) => {
              setClientDialogOpen(isOpen);
              if (!isOpen) setSelectedClient(null);
            }}>
              <DialogTrigger asChild>
                <Button
                  className="group border border-blue-500/50 text-blue-400 hover:border-blue-400 hover:bg-blue-950/30 rounded-full transition-all duration-300 relative overflow-hidden"
                  onClick={() => setSelectedClient(null)}
                >
                  <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  <span className="relative z-10">Novo Cliente</span>
                  <span className="absolute inset-0 w-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 transition-all duration-300 group-hover:w-full"></span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[625px] bg-card text-card-foreground border-border">
                <DialogHeader>
                  <DialogTitle>{selectedClient ? "Editar Cliente" : "Criar Novo Cliente"}</DialogTitle>
                  <DialogDescription>
                    {selectedClient ? "Edite os dados do cliente selecionado." : "Adicione um novo cliente à sua lista."}
                  </DialogDescription>
                </DialogHeader>
                <ClientForm
                  onSubmit={handleClientSubmit}
                  initialValues={prepareClientInitialValues(selectedClient)}
                />
              </DialogContent>
            </Dialog>

            {/* Visitor Dialog */}
            <Dialog open={visitorDialogOpen} onOpenChange={setVisitorDialogOpen}>
              <DialogTrigger asChild>
                 <Button
                  variant="outline"
                  className="group border border-green-500/50 text-green-400 hover:border-green-400 hover:bg-green-950/30 rounded-full transition-all duration-300 relative overflow-hidden"
                >
                  <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  <span className="relative z-10">Registrar Visitante</span>
                   <span className="absolute inset-0 w-0 bg-gradient-to-r from-green-500/20 to-teal-500/20 transition-all duration-300 group-hover:w-full"></span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[625px] bg-card text-card-foreground border-border">
                <DialogHeader>
                  <DialogTitle>Registrar Novo Visitante</DialogTitle>
                  <DialogDescription>
                    Preencha os dados do visitante.
                  </DialogDescription>
                </DialogHeader>
                <VisitorForm onSubmit={handleVisitorSubmit} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Tabs for Clients and Visitors */}
        <Tabs defaultValue="clients" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="clients">Clientes</TabsTrigger>
            <TabsTrigger value="visitors">Visitantes</TabsTrigger>
          </TabsList>
          <TabsContent value="clients">
            {/* Clients Table - Pass props for editing */}
            <div className="bg-[#094067] dark:bg-slate-900/50 backdrop-blur-md border border-blue-900/40 rounded-lg shadow-lg overflow-hidden animate-fade-in">
              <ClientsTable 
                onEditClient={(client) => {
                  setSelectedClient(client);
                  setClientDialogOpen(true);
                }}
                // Pass delete handler
                onDeleteClient={(clientId) => {
                  // Optional: Add confirmation dialog here
                  if (window.confirm('Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.')) {
                    clientDeleteMutation.mutate(clientId);
                  }
                }}
                // Pass view details handler
                onViewDetails={(client) => {
                  setSelectedClient(client); // Set the client to show details for
                  setDetailsDialogOpen(true); // Open the details dialog
                }}
              />
            </div>
          </TabsContent>
          <TabsContent value="visitors">
            {/* Visitors Table */}
             <VisitorsTable />
          </TabsContent>
        </Tabs>

        {/* Client Details Dialog */}
        <ClientDetailsDialog 
          client={selectedClient} 
          open={detailsDialogOpen} 
          onOpenChange={setDetailsDialogOpen} 
        />
      </div>
    </BaseLayout>
  );
};

export default Clients;
