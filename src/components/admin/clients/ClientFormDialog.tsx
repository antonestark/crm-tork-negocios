
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Client } from '@/types/clients';
import { useForm } from 'react-hook-form';
import { ClientCreate } from '@/hooks/use-clients';
import { Textarea } from '@/components/ui/textarea';

interface ClientFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
  onSave: (clientData: ClientCreate) => void;
}

// Define a type for the form fields
interface ClientFormFields {
  company_name: string;
  trading_name: string;
  responsible: string;
  room: string;
  meeting_room_credits: number;
  status: string;
  contract_start_date: string;
  contract_end_date: string;
  cnpj: string;
  address: string;
  email: string;
  phone: string;
  monthly_value: number;
  notes: string;
}

export const ClientFormDialog: React.FC<ClientFormDialogProps> = ({
  open,
  onOpenChange,
  client,
  onSave,
}) => {
  // Initialize form with client data or empty values
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ClientFormFields>({
    defaultValues: client ? {
      company_name: client.company_name || '',
      trading_name: client.trading_name || '',
      responsible: client.responsible || '',
      room: client.room || '',
      meeting_room_credits: client.meeting_room_credits || 0,
      status: client.status || 'active',
      contract_start_date: client.contract_start_date ? new Date(client.contract_start_date).toISOString().split('T')[0] : '',
      contract_end_date: client.contract_end_date ? new Date(client.contract_end_date).toISOString().split('T')[0] : '',
      cnpj: client.cnpj || '',
      address: client.address || '',
      email: client.email || '',
      phone: client.phone || '',
      monthly_value: client.monthly_value || 0,
      notes: client.notes || '',
    } : {
      company_name: '',
      trading_name: '',
      responsible: '',
      room: '',
      meeting_room_credits: 0,
      status: 'active',
      contract_start_date: '',
      contract_end_date: '',
      cnpj: '',
      address: '',
      email: '',
      phone: '',
      monthly_value: 0,
      notes: '',
    }
  });

  // Watch for form changes
  const status = watch('status');

  // Handle form submission
  const onSubmit = (data: ClientFormFields) => {
    onSave({
      ...data,
      meeting_room_credits: Number(data.meeting_room_credits) || 0,
      monthly_value: Number(data.monthly_value) || 0,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{client ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="company_name">Nome da Empresa</Label>
            <Input 
              id="company_name" 
              {...register('company_name', { required: 'Nome da empresa é obrigatório' })}
            />
            {errors.company_name && <p className="text-red-500 text-sm">{errors.company_name.message as string}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="trading_name">Nome Fantasia</Label>
            <Input 
              id="trading_name" 
              {...register('trading_name')}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="responsible">Responsável</Label>
              <Input 
                id="responsible" 
                {...register('responsible')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="room">Sala</Label>
              <Input 
                id="room" 
                {...register('room')}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input 
                id="cnpj" 
                {...register('cnpj')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(value) => setValue('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email"
                {...register('email')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input 
                id="phone" 
                {...register('phone')}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input 
              id="address" 
              {...register('address')}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="meeting_room_credits">Créditos Sala de Reunião</Label>
              <Input 
                id="meeting_room_credits" 
                type="number"
                min="0"
                {...register('meeting_room_credits', {
                  valueAsNumber: true
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="monthly_value">Valor Mensal</Label>
              <Input 
                id="monthly_value" 
                type="number"
                step="0.01"
                min="0"
                {...register('monthly_value', {
                  valueAsNumber: true
                })}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contract_start_date">Data Início Contrato</Label>
              <Input 
                id="contract_start_date" 
                type="date"
                {...register('contract_start_date')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contract_end_date">Data Fim Contrato</Label>
              <Input 
                id="contract_end_date" 
                type="date"
                {...register('contract_end_date')}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea 
              id="notes" 
              {...register('notes')}
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {client ? 'Atualizar' : 'Criar Cliente'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
