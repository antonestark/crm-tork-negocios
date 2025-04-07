
import React from 'react';
import { Link } from 'react-router-dom';
import { UserNav } from '@/components/auth/UserNav';
import { LayoutDashboard, Users, Target, Calendar, LayoutGrid, FileText, CreditCard } from "lucide-react";

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
            <Link to="/dashboard" className="px-3 py-2 rounded hover:bg-gray-100 flex items-center">
              <LayoutDashboard className="h-4 w-4 mr-2" /> 
              Dashboard
            </Link>
            <Link to="/clients" className="px-3 py-2 rounded hover:bg-gray-100 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Clientes
            </Link>
            <Link to="/services" className="px-3 py-2 rounded hover:bg-gray-100 flex items-center">
              <LayoutGrid className="h-4 w-4 mr-2" />
              Serviços
            </Link>
            <Link to="/services/reports" className="px-3 py-2 rounded hover:bg-gray-100 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Relatórios
            </Link>
            <Link to="/admin" className="px-3 py-2 rounded hover:bg-gray-100 flex items-center">
              Admin
            </Link>
          </nav>
        )}
        
        {!hideNavigation && <UserNav />} 
      </div>
    </header>
  );
}
