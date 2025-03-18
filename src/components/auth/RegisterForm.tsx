
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';

const registerSchema = z.object({
  name: z.string()
    .min(3, { message: 'O nome deve ter pelo menos 3 caracteres' })
    .max(100, { message: 'O nome deve ter no máximo 100 caracteres' })
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, { message: 'O nome deve conter apenas letras' }),
  email: z.string()
    .email({ message: 'E-mail inválido' })
    .max(255, { message: 'E-mail muito longo' }),
  password: z.string()
    .min(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
    .max(72, { message: 'A senha deve ter no máximo 72 caracteres' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, {
      message: 'A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número',
    }),
  confirmPassword: z.string().min(6, { message: 'A confirmação de senha deve ter pelo menos 6 caracteres' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  // Mapeia códigos de erro para mensagens amigáveis
  const getErrorMessage = (errorCode: string): string => {
    const errorMessages: Record<string, string> = {
      'user-already-exists': 'Este e-mail já está registrado no sistema.',
      'invalid-email': 'O formato do e-mail é inválido.',
      'weak-password': 'A senha fornecida é muito fraca. Use uma senha mais forte.',
      'email-already-in-use': 'Este e-mail já está sendo utilizado.',
      'database-error': 'Erro no banco de dados. Entre em contato com o suporte.',
      'network-error': 'Problema de conexão. Verifique sua internet e tente novamente.',
    };

    return errorMessages[errorCode] || 'Ocorreu um erro ao fazer o cadastro. Tente novamente.';
  };

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsLoading(true);
      setError('');

      console.log('Registro: Tentando criar conta para:', data.email);

      // Extract first and last name from the full name
      const nameParts = data.name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');

      // Verifica se o e-mail já existe
      const { data: emailCheck, error: emailCheckError } = await supabase
        .from('users')
        .select('email')
        .eq('email', data.email)
        .maybeSingle();

      if (emailCheckError) {
        console.error('Erro ao verificar e-mail existente:', emailCheckError);
        throw new Error('database-error');
      }

      if (emailCheck) {
        throw new Error('user-already-exists');
      }

      // Tentativa de registro
      const { error: signUpError, data: userData } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          },
        },
      });

      if (signUpError) {
        console.error('Erro de registro:', signUpError);
        
        // Identificar tipo específico de erro
        if (signUpError.message?.includes('email')) {
          throw new Error('invalid-email');
        } else if (signUpError.message?.includes('password')) {
          throw new Error('weak-password');
        } else if (signUpError.message?.includes('already')) {
          throw new Error('email-already-in-use');
        } else {
          throw signUpError;
        }
      }

      // Adiciona o usuário na tabela de users
      const { error: userInsertError } = await supabase
        .from('users')
        .insert({
          name: data.name,
          email: data.email,
          role: 'user', // Default role
          active: true,
          status: 'active'
        });

      if (userInsertError) {
        console.error('Erro ao inserir usuário na tabela users:', userInsertError);
        // Continue anyway since auth user was created
      }

      console.log('Registro: Conta criada com sucesso para:', data.email);
      toast.success('Cadastro realizado com sucesso', {
        description: 'Faça login para acessar sua conta'
      });
      navigate('/login');
    } catch (err: any) {
      console.error('Erro no registro:', err);
      
      // Determinar o tipo de erro para exibir mensagem apropriada
      const errorType = err.message || 'unknown-error';
      setError(getErrorMessage(errorType));
      
      toast.error('Falha no cadastro', {
        description: getErrorMessage(errorType)
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          placeholder="Seu nome completo"
          {...register('name')}
          aria-invalid={errors.name ? "true" : "false"}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          {...register('email')}
          aria-invalid={errors.email ? "true" : "false"}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          placeholder="******"
          {...register('password')}
          aria-invalid={errors.password ? "true" : "false"}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar Senha</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="******"
          {...register('confirmPassword')}
          aria-invalid={errors.confirmPassword ? "true" : "false"}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-300 rounded text-red-600 text-sm">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando
          </>
        ) : (
          'Cadastrar'
        )}
      </Button>
    </form>
  );
}
