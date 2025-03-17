
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Mail, Lock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const loginSchema = z.object({
  email: z.string()
    .min(1, { message: 'E-mail é obrigatório' })
    .email({ message: 'Formato de e-mail inválido' }),
  password: z.string()
    .min(8, { message: 'A senha deve ter pelo menos 8 caracteres' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface SimpleLoginFormProps {
  onLogin: (email: string, password: string) => void;
  error?: string;
  isLoading?: boolean;
}

export function SimpleLoginForm({ onLogin, error, isLoading = false }: SimpleLoginFormProps) {
  const [formError, setFormError] = useState<string | null>(error || null);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    setFormError(null);
    try {
      await onLogin(data.email, data.password);
    } catch (err: any) {
      setFormError(err.message || 'Erro ao fazer login');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            className="pl-10"
            {...register('email')}
            aria-invalid={errors.email ? "true" : "false"}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            id="password"
            type="password"
            placeholder="********"
            className="pl-10"
            {...register('password')}
            aria-invalid={errors.password ? "true" : "false"}
          />
        </div>
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      {(formError || error) && (
        <div className="p-3 bg-red-100 border border-red-300 rounded text-red-600 text-sm">
          {formError || error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando
          </>
        ) : (
          'Entrar'
        )}
      </Button>
    </form>
  );
}
