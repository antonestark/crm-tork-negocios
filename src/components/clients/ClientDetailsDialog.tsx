import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter, // Optional footer
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Client } from '@/types/clients';
import { Badge } from "@/components/ui/badge";

interface ClientDetailsDialogProps {
  client: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Helper function to render detail items
const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="grid grid-cols-3 gap-2 py-1">
    <span className="font-semibold text-sm text-muted-foreground">{label}:</span>
    <span className="col-span-2 text-sm">{value || 'N/A'}</span>
  </div>
);

export const ClientDetailsDialog: React.FC<ClientDetailsDialogProps> = ({ client, open, onOpenChange }) => {
  if (!client) return null;

  const getStatusBadge = (status: string) => {
     switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Inativo</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] bg-card text-card-foreground border-border">
        <DialogHeader>
          <DialogTitle>Detalhes do Cliente</DialogTitle>
          <DialogDescription>
            Informações detalhadas sobre {client.company_name}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-4">
          <DetailItem label="Nome da Empresa" value={client.company_name} />
          <DetailItem label="Nome Contato" value={client.contact_name} />
          <DetailItem label="Razão Social" value={client.razao_social} />
          <DetailItem label="Documento" value={client.document} />
          <DetailItem label="Data Nasc./Fund." value={client.birth_date?.toString()} />
          <DetailItem label="Email" value={client.email} />
          <DetailItem label="Telefone" value={client.phone} />
          <DetailItem label="Status" value={getStatusBadge(client.status)} />
          <DetailItem label="Tags" value={client.tags?.join(', ')} />
          {/* Add other relevant fields from the Client type */}
          <DetailItem label="Endereço" value={client.address} />
          <DetailItem label="Valor Mensal" value={client.monthly_value?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
          <DetailItem label="Responsável" value={client.responsible} />
          <DetailItem label="Sala" value={client.room} />
          <DetailItem label="Créditos Reunião" value={client.meeting_room_credits} />
          <DetailItem label="Início Contrato" value={client.contract_start_date?.toString()} />
          <DetailItem label="Fim Contrato" value={client.contract_end_date?.toString()} />
          <DetailItem label="Notas" value={<pre className="whitespace-pre-wrap text-sm">{client.notes}</pre>} />
          <DetailItem label="Criado em" value={client.created_at ? new Date(client.created_at).toLocaleString('pt-BR') : 'N/A'} />
          <DetailItem label="Atualizado em" value={client.updated_at ? new Date(client.updated_at).toLocaleString('pt-BR') : 'N/A'} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
