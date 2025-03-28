
import React from 'react';
import { Link } from 'react-router-dom';
import { UserNav } from '@/components/auth/UserNav';

interface AuthHeaderProps {
  hideNavigation?: boolean;
}

export function AuthHeader({ hideNavigation = false }: AuthHeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="font-bold text-xl">
          Sistema de Gestão
        </Link>
        
        {!hideNavigation && (
          <nav className="hidden md:flex space-x-4">
            <Link to="/" className="px-3 py-2 rounded hover:bg-gray-100">Home</Link>
            <Link to="/clients" className="px-3 py-2 rounded hover:bg-gray-100">Clientes</Link>
            <Link to="/services" className="px-3 py-2 rounded hover:bg-gray-100">Serviços</Link>
            <Link to="/admin" className="px-3 py-2 rounded hover:bg-gray-100">Admin</Link>
          </nav>
        )}
        
        <UserNav />
      </div>
    </header>
  );
}
