
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Company } from '@/types/companies';
import { useForm } from 'react-hook-form';

interface CompanyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company: Company | null;
  onSave: (companyData: Partial<Company>) => void;
}

interface CompanyFormFields {
  name: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  status: string;
  user_limit: number;
  connection_limit: number;
}

export const CompanyFormDialog: React.FC<CompanyFormDialogProps> = ({
  open,
  onOpenChange,
  company,
  onSave,
}) => {
  // Initialize form with company data or empty values
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CompanyFormFields>({
    defaultValues: company ? {
      name: company.name || '',
      contact_email: company.contact_email || '',
      contact_phone: company.contact_phone || '',
      address: company.address || '',
      status: company.status || 'active',
      user_limit: company.settings?.user_limit || 10,
      connection_limit: company.settings?.connection_limit || 10,
    } : {
      name: '',
      contact_email: '',
      contact_phone: '',
      address: '',
      status: 'active',
      user_limit: 10,
      connection_limit: 10,
    }
  });

  // Watch for form changes
  const status = watch('status');

  // Handle form submission
  const onSubmit = (data: CompanyFormFields) => {
    const companyData: Partial<Company> = {
      name: data.name,
      contact_email: data.contact_email,
      contact_phone: data.contact_phone,
      address: data.address,
      status: data.status,
      settings: {
        user_limit: data.user_limit,
        connection_limit: data.connection_limit,
        // Preserve existing API token if available
        api_token: company?.settings?.api_token || generateAPIToken()
      }
    };
    
    onSave(companyData);
  };

  // Generate a random API token
  const generateAPIToken = () => {
    return 'tk_' + Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{company ? 'Editar Empresa' : 'Nova Empresa'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Empresa</Label>
            <Input 
              id="name" 
              {...register('name', { required: 'Nome da empresa é obrigatório' })}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_email">Email</Label>
              <Input 
                id="contact_email" 
                type="email"
                {...register('contact_email')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact_phone">Telefone</Label>
              <Input 
                id="contact_phone" 
                {...register('contact_phone')}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Textarea 
              id="address" 
              {...register('address')}
              rows={2}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
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
            
            <div className="space-y-2">
              <Label htmlFor="user_limit">Limite de Usuários</Label>
              <Input 
                id="user_limit" 
                type="number"
                min="1"
                {...register('user_limit', {
                  valueAsNumber: true,
                  min: {
                    value: 1,
                    message: 'Mínimo de 1 usuário'
                  }
                })}
              />
              {errors.user_limit && <p className="text-red-500 text-sm">{errors.user_limit.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="connection_limit">Limite de Conexões</Label>
              <Input 
                id="connection_limit" 
                type="number"
                min="1"
                {...register('connection_limit', {
                  valueAsNumber: true,
                  min: {
                    value: 1,
                    message: 'Mínimo de 1 conexão'
                  }
                })}
              />
              {errors.connection_limit && <p className="text-red-500 text-sm">{errors.connection_limit.message}</p>}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {company ? 'Atualizar' : 'Criar Empresa'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
