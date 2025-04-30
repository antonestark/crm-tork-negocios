import React, { useState, useEffect } from 'react';
import { LeadColumn } from './LeadColumn';
// LeadFormDialog is now rendered in Leads.tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lead } from '@/types/admin';
import { Search, RefreshCw, PlusCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { NewLead } from '@/services/leads-service'; // Import NewLead if needed by onAddLead

interface LeadsKanbanProps {
  leads: Lead[];
  users: { id: string; name: string }[];
  // loading: boolean; // Loading state is now handled by parent (Leads.tsx)
  // onAddLead: (lead: Partial<Lead>) => Promise<Lead | null>; // Handled by parent dialog
  // onUpdateLead: (lead: Partial<Lead>) => Promise<boolean>; // Handled by parent dialog
  onUpdateLeadStatus: (id: string, status: string) => void; // Changed return type
  onDeleteLead: (id: string) => void; // Changed return type
  onRefresh?: () => void; // Keep optional or remove if fully handled by React Query
  onEditLead?: (lead: Lead) => void; // Prop to signal parent to open edit dialog
}

export const LeadsKanban: React.FC<LeadsKanbanProps> = ({
  leads,
  users, // Still needed for LeadCard potentially
  // loading, // Removed loading prop
  // onAddLead, // Removed
  // onUpdateLead, // Removed
  onUpdateLeadStatus,
  onDeleteLead,
  onRefresh, // Keep if manual refresh button is desired
  onEditLead // Receive edit handler
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false); // Keep for refresh button state

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

  // Group leads by status
  const qualifiedLeads = filteredLeads.filter(lead => lead.status === 'qualificado');
  const neutralLeads = filteredLeads.filter(lead => lead.status === 'neutro');
  const unqualifiedLeads = filteredLeads.filter(lead => lead.status === 'não qualificado');
  const otherLeads = filteredLeads.filter(lead => 
    lead.status !== 'qualificado' && 
    lead.status !== 'neutro' && 
    lead.status !== 'não qualificado'
  );
  const allNeutralLeads = [...neutralLeads, ...otherLeads];

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, status: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('leadId');
    if (leadId) {
      try {
        // Call the void function directly
        onUpdateLeadStatus(leadId, status); 
      } catch (error) {
        // This catch might not be necessary if the mutation handles errors
        console.error('Error during drag and drop:', error);
        toast.error('Erro ao mover o lead');
      }
    }
  };

  // Removed handleAddLead and handleUpdateLead as they are handled by the parent dialog

  const handleRefresh = async () => {
    if (!onRefresh) return; // Guard if onRefresh is optional
    setIsRefreshing(true);
    try {
      await onRefresh(); // Call the refresh function passed from parent (if any)
      toast.success('Dados atualizados');
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error('Erro ao atualizar dados');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Function to render skeletons - Adapt based on parent's loading state if needed
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
            // disabled={loading} // Loading state comes from parent now
          />
        </div>
        
        <div className="flex gap-2">
          {/* Refresh button might be redundant with React Query auto-refetching */}
          {onRefresh && (
            <Button 
              variant="outline" 
              size="sm" 
              className="border border-blue-400 text-blue-400 hover:bg-blue-400/10"
              onClick={handleRefresh}
              disabled={isRefreshing} // Disable based on local refresh state
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          )}
        </div>
      </div>
      
      {/* Loading state is handled in Leads.tsx */}
      {leads.length === 0 ? (
         <div className="flex flex-col items-center justify-center h-[calc(100%-48px)] bg-gray-50 rounded-lg border border-gray-200 p-8">
          <div className="text-center mb-4">
            <h3 className="text-lg font-medium">Nenhum lead encontrado</h3>
            <p className="text-muted-foreground mt-1">Adicione novos leads para começar.</p>
          </div>
          {/* Button to add lead is in the parent Leads.tsx */}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 h-[calc(100%-48px)]">
          <LeadColumn
            title="Qualificado"
            count={qualifiedLeads.length}
            status="qualificado"
            leads={qualifiedLeads}
            onEditLead={onEditLead} // Pass down edit handler
            onDeleteLead={onDeleteLead} // Pass down delete handler
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'qualificado')}
          />
          
          <LeadColumn
            title="Neutro"
            count={allNeutralLeads.length}
            status="neutro"
            leads={allNeutralLeads}
            onEditLead={onEditLead} // Pass down edit handler
            onDeleteLead={onDeleteLead} // Pass down delete handler
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'neutro')}
          />
          
          <LeadColumn
            title="Não Qualificado"
            count={unqualifiedLeads.length}
            status="não qualificado"
            leads={unqualifiedLeads}
            onEditLead={onEditLead} // Pass down edit handler
            onDeleteLead={onDeleteLead} // Pass down delete handler
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'não qualificado')}
          />
        </div>
      )}
      
      {/* LeadFormDialog is rendered in Leads.tsx */}
    </div>
  );
};
