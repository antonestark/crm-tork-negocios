
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useFormContext } from 'react-hook-form';
import { UserFormFields } from './types';

interface UserFormInputsProps {
  isNewUser: boolean;
}

export const UserFormInputs: React.FC<UserFormInputsProps> = ({ isNewUser }) => {
  const { register, setValue, watch, formState: { errors } } = useFormContext<UserFormFields>();
  
  // Watch for form changes
  const role = watch('role');
  const active = watch('active');
  const status = watch('status');

  return (
    <>
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
      {isNewUser && (
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
    </>
  );
};
