
import React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { Link, Navigate } from 'react-router-dom';
import { useAuthState } from '@/hooks/use-auth-state';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const { isAuthenticated, isLoading } = useAuthState();

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

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-20 text-center">
        <div className="bg-white shadow-2xl rounded-2xl p-5 md:p-10 w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6">Login</h1>
          <LoginForm />

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
