
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

      // Verificar se o cliente existe, caso contrário criar um registro para ele
      // Isso garante que a tabela clients tenha registros alinhados com auth.users
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('auth_id', authData.user?.id)
        .maybeSingle();

      if (!clientData && authData.user) {
        // Se o cliente não existir, criar um novo com dados básicos
        await supabase.from('clients').insert({
          company_name: authData.user.user_metadata.name || authData.user.email,
          email: authData.user.email,
          auth_id: authData.user.id,
          status: 'active'
        });
        console.log('Cliente criado na tabela clients para:', authData.user.email);
      }

      // Caminho de sucesso
      console.log('Login realizado com sucesso para:', email);
      toast.success('Login realizado com sucesso');
      
    } catch (err: any) {
      console.error('Erro de login:', err);
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
