
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { User } from '@/types/admin';
import { useForm } from 'react-hook-form';
import { UserCreate } from '@/hooks/use-users';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSave: (userData: UserCreate) => void;
}

// Define a type for the form fields
interface UserFormFields {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  department_id: number | null;
  active: boolean;
  status: string;
  password?: string;
  // Client fields
  company_name?: string;
  trading_name?: string;
  responsible?: string;
  room?: string;
  meeting_room_credits?: number;
  contract_start_date?: string;
  contract_end_date?: string;
  cnpj?: string;
  address?: string;
  monthly_value?: number;
}

export const UserFormDialog: React.FC<UserFormDialogProps> = ({
  open,
  onOpenChange,
  user,
  onSave,
}) => {
  // Initialize form with user data or empty values
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<UserFormFields>({
    defaultValues: user ? {
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'user',
      department_id: user.department_id || null,
      active: user.active !== false,
      status: user.status || 'active',
      // Client fields
      company_name: user.company_name || '',
      trading_name: user.trading_name || '',
      responsible: user.responsible || '',
      room: user.room || '',
      meeting_room_credits: user.meeting_room_credits || 0,
      contract_start_date: user.contract_start_date ? new Date(user.contract_start_date).toISOString().split('T')[0] : '',
      contract_end_date: user.contract_end_date ? new Date(user.contract_end_date).toISOString().split('T')[0] : '',
      cnpj: user.cnpj || '',
      address: user.address || '',
      monthly_value: user.monthly_value || 0,
    } : {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      role: 'user',
      department_id: null,
      active: true,
      status: 'active',
      password: '',
      // Client fields with defaults
      company_name: '',
      trading_name: '',
      responsible: '',
      room: '',
      meeting_room_credits: 0,
      contract_start_date: '',
      contract_end_date: '',
      cnpj: '',
      address: '',
      monthly_value: 0,
    }
  });

  // Watch for form changes
  const role = watch('role');
  const active = watch('active');
  const status = watch('status');

  // Handle form submission
  const onSubmit = (data: UserFormFields) => {
    onSave({
      ...data,
      active: !!data.active,
      meeting_room_credits: Number(data.meeting_room_credits) || 0,
      monthly_value: Number(data.monthly_value) || 0,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{user ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <Tabs defaultValue="user" className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="user">Dados do Usuário</TabsTrigger>
              <TabsTrigger value="client">Dados do Cliente</TabsTrigger>
            </TabsList>
            
            <TabsContent value="user" className="space-y-4 mt-4">
              {/* User Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Nome</Label>
                  <Input 
                    id="first_name" 
                    {...register('first_name', { required: 'Nome é obrigatório' })}
                  />
                  {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name.message as string}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="last_name">Sobrenome</Label>
                  <Input 
                    id="last_name" 
                    {...register('last_name', { required: 'Sobrenome é obrigatório' })}
                  />
                  {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name.message as string}</p>}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  {...register('email', { 
                    required: 'Email é obrigatório',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido'
                    }
                  })}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message as string}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input 
                  id="phone" 
                  {...register('phone')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Função</Label>
                <Select
                  value={role}
                  onValueChange={(value) => setValue('role', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Usuário</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
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
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="blocked">Bloqueado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="active" 
                  checked={active}
                  onCheckedChange={(checked) => setValue('active', checked)}
                />
                <Label htmlFor="active">Ativo</Label>
              </div>
              
              {/* Password field for new users */}
              {!user && (
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input 
                    id="password" 
                    type="password"
                    {...register('password', {
                      minLength: {
                        value: 6,
                        message: 'Senha deve ter pelo menos 6 caracteres'
                      }
                    })}
                  />
                  {errors.password && <p className="text-red-500 text-sm">{errors.password.message as string}</p>}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="client" className="space-y-4 mt-4">
              {/* Client Information */}
              <div className="space-y-2">
                <Label htmlFor="company_name">Nome da Empresa</Label>
                <Input 
                  id="company_name" 
                  {...register('company_name')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="trading_name">Nome Fantasia</Label>
                <Input 
                  id="trading_name" 
                  {...register('trading_name')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="responsible">Responsável</Label>
                <Input 
                  id="responsible" 
                  {...register('responsible')}
                />
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
                  <Label htmlFor="room">Sala</Label>
                  <Input 
                    id="room" 
                    {...register('room')}
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
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {user ? 'Atualizar' : 'Criar Usuário'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
