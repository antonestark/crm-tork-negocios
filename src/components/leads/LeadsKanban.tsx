
import React, { useState } from 'react';
import { LeadColumn } from './LeadColumn';
import { LeadFormDialog } from './LeadFormDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lead } from '@/types/admin';
import { Plus, Search, RefreshCw } from 'lucide-react';

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

  // Filter leads by search term
  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (lead.phone && lead.phone.includes(searchTerm))
  );

  // Group leads by status
  const qualifiedLeads = filteredLeads.filter(lead => lead.status === 'qualificado');
  const neutralLeads = filteredLeads.filter(lead => lead.status === 'neutro');
  const unqualifiedLeads = filteredLeads.filter(lead => lead.status === 'não qualificado');

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, status: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('leadId');
    if (leadId) {
      await onUpdateLeadStatus(leadId, status);
    }
  };

  const handleAddLead = async (data: Partial<Lead>) => {
    await onAddLead(data);
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setFormOpen(true);
  };

  const handleUpdateLead = async (data: Partial<Lead>) => {
    await onUpdateLead(data);
    setSelectedLead(null);
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
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          
          <Button onClick={() => {
            setSelectedLead(null);
            setFormOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Lead
          </Button>
        </div>
      </div>
      
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
          count={neutralLeads.length}
          status="neutro"
          leads={neutralLeads}
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
