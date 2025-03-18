
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { AdminNav } from '@/components/admin/AdminNav';
import { Separator } from '@/components/ui/separator';
import { UsersTable } from '@/components/admin/users/UsersTable';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

export default function UsersPage() {
  const [filters, setFilters] = useState({
    status: 'all',
    department: 'all',
    search: ''
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <Helmet>
        <title>Gerenciamento de Usuários</title>
      </Helmet>
      
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Admin</h2>
          <p className="text-muted-foreground">
            Gerenciamento de usuários, departamentos e permissões do sistema.
          </p>
        </div>
      </div>
      
      <Separator />
      
      <div className="flex h-full">
        <div className="w-64 mr-8">
          <AdminNav />
        </div>
        <div className="flex-1">
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar usuário..."
                className="pl-8"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
                <SelectItem value="blocked">Bloqueado</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={filters.department}
              onValueChange={(value) => handleFilterChange('department', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os departamentos</SelectItem>
                <SelectItem value="1">Marketing</SelectItem>
                <SelectItem value="2">Engenharia</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <UsersTable filters={filters} />
        </div>
      </div>
    </div>
  );
}
