
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';

const loginSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm({ usuario, erro }: { usuario?: { email: string, senha: string }, erro?: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(erro || '');
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from || '/';

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: usuario?.email || '',
      password: usuario?.senha || '',
    }
  });

  // Map error message to user-friendly message
  const getErrorMessage = (errorCode: string): string => {
    const errorMessages: Record<string, string> = {
      'invalid_credentials': 'E-mail ou senha inválidos. Verifique suas credenciais.',
      'invalid_grant': 'Credenciais inválidas. Verifique seu e-mail e senha.',
      'invalid_request': 'Requisição inválida. Tente novamente.',
      'database_error': 'Erro de banco de dados. Entre em contato com o suporte.',
      'unauthorized': 'Usuário não autorizado. Verifique suas permissões.',
      'user_not_found': 'Usuário não encontrado. Verifique seu e-mail.',
      'too_many_requests': 'Muitas tentativas. Tente novamente mais tarde.',
      'server_error': 'Erro no servidor. Tente novamente mais tarde.',
    };

    return errorMessages[errorCode] || 'Ocorreu um erro ao fazer login. Tente novamente.';
  };

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      setError('');

      console.log('Login attempt with:', data.email);

      // Attempt to sign in with provided credentials
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        console.error('Authentication error:', authError);
        
        // Check for specific database error
        if (authError.message?.includes('database error')) {
          setError(getErrorMessage('database_error'));
          // Log detailed error for debugging
          console.error('Database error during authentication:', authError);
          toast.error('Erro no banco de dados', {
            description: 'Houve um problema com o banco de dados. Por favor, contate o suporte técnico.'
          });
          return;
        }
        
        // Handle other specific errors
        if (authError.message?.includes('Invalid login')) {
          setError(getErrorMessage('invalid_credentials'));
          toast.error('Falha no login', {
            description: 'Credenciais inválidas. Verifique seu e-mail e senha.'
          });
          return;
        }

        // Handle any other errors
        throw authError;
      }

      // Success path
      console.log('Login successful for:', data.email);
      toast.success('Login realizado com sucesso');
      navigate(from, { replace: true });
      
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Try to determine error type
      const errorType = err.message?.includes('network') 
        ? 'server_error'
        : err.message?.includes('credentials') 
          ? 'invalid_credentials' 
          : 'server_error';
      
      setError(getErrorMessage(errorType));
      
      toast.error('Falha no login', {
        description: err.message || 'Verifique suas credenciais e tente novamente'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          'Entrar'
        )}
      </Button>
    </form>
  );
}
