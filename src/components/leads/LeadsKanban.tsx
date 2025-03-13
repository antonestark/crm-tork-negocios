
import React, { useState, useEffect } from 'react';
import { LeadColumn } from './LeadColumn';
import { LeadFormDialog } from './LeadFormDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lead } from '@/types/admin';
import { Search, RefreshCw, PlusCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface LeadsKanbanProps {
  leads: Lead[];
  users: { id: string; name: string }[];
  loading: boolean;
  onAddLead: (lead: Partial<Lead>) => Promise<Lead | null>;
  onUpdateLead: (lead: Partial<Lead>) => Promise<boolean>;
  onUpdateLeadStatus: (id: string, status: string) => Promise<boolean>;
  onDeleteLead: (id: string) => Promise<boolean>;
  onRefresh: () => void;
}

export const LeadsKanban: React.FC<LeadsKanbanProps> = ({
  leads,
  users,
  loading,
  onAddLead,
  onUpdateLead,
  onUpdateLeadStatus,
  onDeleteLead,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    console.log("Leads in Kanban:", leads);
  }, [leads]);

  // Filter leads by search term
  const filteredLeads = leads.filter(lead => 
    lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (lead.phone && lead.phone.includes(searchTerm))
  );

  // Group leads by status - ensure we account for unexpected status values
  const qualifiedLeads = filteredLeads.filter(lead => lead.status === 'qualificado');
  const neutralLeads = filteredLeads.filter(lead => lead.status === 'neutro');
  const unqualifiedLeads = filteredLeads.filter(lead => lead.status === 'não qualificado');
  
  // Find leads with unexpected status values to be displayed in the neutral column
  const otherLeads = filteredLeads.filter(lead => 
    lead.status !== 'qualificado' && 
    lead.status !== 'neutro' && 
    lead.status !== 'não qualificado'
  );
  
  // Add leads with unexpected status to neutral column
  const allNeutralLeads = [...neutralLeads, ...otherLeads];

  console.log("Qualified leads:", qualifiedLeads.length);
  console.log("Neutral leads:", neutralLeads.length);
  console.log("Unqualified leads:", unqualifiedLeads.length);
  console.log("Other leads with unexpected status:", otherLeads.length);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, status: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('leadId');
    if (leadId) {
      try {
        const result = await onUpdateLeadStatus(leadId, status);
        if (!result) {
          toast.error('Erro ao atualizar status do lead');
        }
      } catch (error) {
        console.error('Error during drag and drop:', error);
        toast.error('Erro ao mover o lead');
      }
    }
  };

  const handleAddLead = async (data: Partial<Lead>) => {
    try {
      const result = await onAddLead(data);
      if (result) {
        setFormOpen(false);
        toast.success('Lead adicionado com sucesso');
      } else {
        toast.error('Erro ao adicionar lead');
      }
    } catch (error) {
      console.error('Error adding lead:', error);
      toast.error('Erro ao adicionar lead');
    }
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setFormOpen(true);
  };

  const handleUpdateLead = async (data: Partial<Lead>) => {
    try {
      const result = await onUpdateLead(data);
      if (result) {
        setFormOpen(false);
        setSelectedLead(null);
      }
    } catch (error) {
      console.error('Error updating lead:', error);
      toast.error('Erro ao atualizar lead');
    }
  };
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
      toast.success('Dados atualizados');
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error('Erro ao atualizar dados');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Function to render skeletons during loading state
  const renderSkeletons = () => {
    return (
      <div className="grid grid-cols-3 gap-4 h-[calc(100%-48px)]">
        {[1, 2, 3].map((column) => (
          <div key={column} className="flex flex-col rounded-lg w-full border bg-gray-50 border-gray-200">
            <div className="px-4 py-3 rounded-t-lg font-medium flex justify-between items-center bg-gray-100">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
            <div className="p-3 flex-1">
              {[1, 2, 3].map((item) => (
                <Skeleton key={item} className="h-[120px] mb-3 rounded-md" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar leads..."
            className="pl-8 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={loading || isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              setSelectedLead(null);
              setFormOpen(true);
            }}
            disabled={loading}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Novo Lead
          </Button>
        </div>
      </div>
      
      {loading ? (
        renderSkeletons()
      ) : leads.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[calc(100%-48px)] bg-gray-50 rounded-lg border border-gray-200 p-8">
          <div className="text-center mb-4">
            <h3 className="text-lg font-medium">Nenhum lead encontrado</h3>
            <p className="text-muted-foreground mt-1">Adicione novos leads para começar a gerenciar seus contatos</p>
          </div>
          <Button 
            onClick={() => {
              setSelectedLead(null);
              setFormOpen(true);
            }}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Adicionar Lead
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 h-[calc(100%-48px)]">
          <LeadColumn
            title="Qualificado"
            count={qualifiedLeads.length}
            status="qualificado"
            leads={qualifiedLeads}
            onEditLead={handleEditLead}
            onDeleteLead={onDeleteLead}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'qualificado')}
          />
          
          <LeadColumn
            title="Neutro"
            count={allNeutralLeads.length}
            status="neutro"
            leads={allNeutralLeads}
            onEditLead={handleEditLead}
            onDeleteLead={onDeleteLead}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'neutro')}
          />
          
          <LeadColumn
            title="Não Qualificado"
            count={unqualifiedLeads.length}
            status="não qualificado"
            leads={unqualifiedLeads}
            onEditLead={handleEditLead}
            onDeleteLead={onDeleteLead}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'não qualificado')}
          />
        </div>
      )}
      
      <LeadFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={selectedLead ? handleUpdateLead : handleAddLead}
        lead={selectedLead}
        users={users}
      />
    </div>
  );
};
