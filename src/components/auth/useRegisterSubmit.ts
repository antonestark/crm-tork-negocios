
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { RegisterFormValues, getErrorMessage } from './RegisterSchema';

export function useRegisterSubmit() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsLoading(true);
      setError('');

      console.log('Registro: Tentando criar conta para:', data.email);

      // Extract first and last name from the full name
      const nameParts = data.name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');

      // Verifica se o e-mail já existe na tabela users
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

      // Tentativa de registro no Auth
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
        console.error('Erro de registro no Auth:', signUpError);
        
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

      // Se chegou aqui, o registro Auth foi bem-sucedido
      console.log('Usuário criado no Auth com sucesso:', userData);

      // Adiciona o usuário na tabela de users
      const { error: userInsertError } = await supabase
        .from('users')
        .insert({
          name: data.name,
          email: data.email,
          role: 'user', // Default role
          status: 'active'
        });

      if (userInsertError) {
        console.error('Erro ao inserir usuário na tabela users:', userInsertError);
        
        // Tentar identificar o problema no banco de dados
        if (userInsertError.message?.includes('duplicate')) {
          toast.warning('Este e-mail já existe na tabela de usuários, mas o registro na autenticação foi bem-sucedido.');
        } else {
          toast.warning('Conta criada, mas houve um problema ao salvar dados adicionais. Alguns recursos podem estar limitados.');
        }
        
        // Log detalhado do erro para debugging
        console.error('Detalhes do erro de inserção:', {
          message: userInsertError.message,
          code: userInsertError.code,
          details: userInsertError.details,
          hint: userInsertError.hint
        });
      } else {
        console.log('Usuário inserido com sucesso na tabela users');
      }

      console.log('Registro: Conta criada com sucesso para:', data.email);
      toast.success('Cadastro realizado com sucesso', {
        description: 'Redirecionando para a página de administração de usuários'
      });
      
      // Alterando o redirecionamento para a página de usuários no painel admin
      navigate('/admin/users');
      
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

  return { isLoading, error, onSubmit };
}
