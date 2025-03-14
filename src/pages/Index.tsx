
import React from 'react';
import { AuthHeader } from '@/components/layout/AuthHeader';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';

export default function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthHeader />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Sistema de Gestão</h1>
          <p className="text-xl mb-8">
            Bem-vindo ao nosso sistema de gestão completo. Administre usuários, departamentos, 
            e acesse todos os serviços em um único lugar.
          </p>
          
          {!user ? (
            <div className="flex justify-center gap-4 mb-12">
              <Button onClick={() => navigate('/login')} size="lg">
                Entrar
              </Button>
              <Button onClick={() => navigate('/register')} variant="outline" size="lg">
                Cadastrar
              </Button>
            </div>
          ) : (
            <div className="flex justify-center gap-4 mb-12">
              <Button onClick={() => navigate('/admin')} size="lg">
                Painel de Administração
              </Button>
              <Button onClick={() => navigate('/services')} variant="outline" size="lg">
                Acessar Serviços
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
