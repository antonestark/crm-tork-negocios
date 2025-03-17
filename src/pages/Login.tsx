
import React, { useEffect, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthState } from '@/hooks/use-auth-state';
import { SimpleLoginForm } from '@/components/auth/SimpleLoginForm';
import { supabase } from '@/integrations/supabase/client';

export default function Login() {
  const { isAuthenticated, isLoading, sessionExpired } = useAuthState();
  const [loginError, setLoginError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const from = location.state?.from || '/';

  // Verifica se há um erro de login na URL (redirecionamento de sessão expirada)
  const searchParams = new URLSearchParams(location.search);
  const urlError = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  useEffect(() => {
    // Exibir mensagem de erro se existir
    if (urlError && errorDescription) {
      console.error("Erro de login:", errorDescription);
      setLoginError(errorDescription);
    }
  }, [urlError, errorDescription]);

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsSubmitting(true);
      setLoginError('');

      console.log('Login attempt with:', email);

      // Attempt to sign in with provided credentials
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error('Authentication error:', authError);
        
        // Handle specific errors
        if (authError.message?.includes('Invalid login')) {
          throw new Error('E-mail ou senha inválidos. Verifique suas credenciais.');
        }

        if (authError.message?.includes('database error')) {
          throw new Error('Erro no banco de dados. Por favor, contate o suporte técnico.');
        }

        // Handle any other errors
        throw authError;
      }

      // Success path
      console.log('Login successful for:', email);
      toast.success('Login realizado com sucesso');
      
    } catch (err: any) {
      console.error('Login error:', err);
      setLoginError(err.message || 'Ocorreu um erro ao fazer login. Tente novamente.');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-2">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated && !sessionExpired) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-20 text-center">
        <div className="bg-white shadow-2xl rounded-2xl p-5 md:p-10 w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6">Login</h1>
          <SimpleLoginForm 
            onLogin={handleLogin} 
            error={loginError}
            isLoading={isSubmitting}
          />

          <div className="mt-6 text-sm">
            Não tem uma conta?{" "}
            <Link to="/register" className="text-blue-500 hover:text-blue-700 font-medium">
              Cadastrar-se
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
