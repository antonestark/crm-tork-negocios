
import React, { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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

  // Effect to handle redirect after authentication
  useEffect(() => {
    if (isAuthenticated && !isLoading && !sessionExpired) {
      console.log('Usuário autenticado, redirecionando para:', from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, sessionExpired, navigate, from]);

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsSubmitting(true);
      setLoginError('');

      console.log('Tentativa de login com:', email);

      // Tentativa de login diretamente com Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error('Erro de autenticação:', authError);
        
        // Tratamento de erros específicos
        if (authError.message?.includes('Invalid login')) {
          throw new Error('E-mail ou senha inválidos. Verifique suas credenciais.');
        }

        if (authError.message?.includes('database error')) {
          // Verificar se o usuário existe no sistema
          const { data: userExists } = await supabase
            .from('users')
            .select('id, email')
            .eq('email', email)
            .maybeSingle();
            
          if (userExists) {
            console.log('Usuário existe na tabela users, mas houve um erro de banco de dados');
            throw new Error('Ocorreu um erro no banco de dados. Entre em contato com o suporte técnico.');
          } else {
            console.log('Usuário não encontrado no sistema');
            throw new Error('Usuário não encontrado. Verifique seu email ou registre uma nova conta.');
          }
        }

        // Tratamento de qualquer outro erro
        throw authError;
      }

      // Caminho de sucesso
      console.log('Login realizado com sucesso para:', email);
      toast.success('Login realizado com sucesso');
      
      // Forçar redirecionamento explícito após login bem-sucedido
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 500);
      
    } catch (err: any) {
      console.error('Erro de login:', err);
      setLoginError(err.message || 'Ocorreu um erro ao fazer login. Tente novamente.');
      toast.error('Falha no login', {
        description: err.message || 'Verifice suas credenciais e tente novamente.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renderiza o spinner de carregamento durante a verificação de autenticação
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

  // Se o usuário já estiver autenticado, redireciona para a página de destino
  if (isAuthenticated && !sessionExpired) {
    console.log('Redirecionando usuário autenticado para:', from);
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
