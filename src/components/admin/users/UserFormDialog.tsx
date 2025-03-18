
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { User } from '@/types/admin';
import { useForm } from 'react-hook-form';

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSave: (userData: Partial<User> & { email: string }) => void;
}

export const UserFormDialog: React.FC<UserFormDialogProps> = ({
  open,
  onOpenChange,
  user,
  onSave,
}) => {
  // Initialize form with user data or empty values
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: user ? {
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'user',
      department_id: user.department_id || null,
      active: user.active !== false,
      status: user.status || 'active',
    } : {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      role: 'user',
      department_id: null,
      active: true,
      status: 'active',
    }
  });

  // Watch for form changes
  const role = watch('role');
  const active = watch('active');
  const status = watch('status');

  // Handle form submission
  const onSubmit = (data: any) => {
    onSave({
      ...data,
      active: !!data.active,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{user ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          {/* First name field */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">Nome</Label>
              <Input 
                id="first_name" 
                {...register('first_name', { required: 'Nome é obrigatório' })}
              />
              {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name.message as string}</p>}
            </div>
            
            {/* Last name field */}
            <div className="space-y-2">
              <Label htmlFor="last_name">Sobrenome</Label>
              <Input 
                id="last_name" 
                {...register('last_name', { required: 'Sobrenome é obrigatório' })}
              />
              {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name.message as string}</p>}
            </div>
          </div>
          
          {/* Email field */}
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
          
          {/* Phone field */}
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input 
              id="phone" 
              {...register('phone')}
            />
          </div>
          
          {/* Role select */}
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
          
          {/* Status select */}
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
          
          {/* Active switch */}
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
