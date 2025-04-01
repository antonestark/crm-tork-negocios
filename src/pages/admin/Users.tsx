import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { AdminNav } from '@/components/admin/AdminNav';
import { UsersTable } from '@/components/admin/users/UsersTable';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { BaseLayout } from '@/components/layout/BaseLayout'; // Import BaseLayout
import { useDepartments } from '@/hooks/use-departments'; // Import useDepartments
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

export default function UsersPage() {
  const [filters, setFilters] = useState({
    status: 'all',
    department: 'all',
    search: ''
  });
  
  // Fetch departments for the filter dropdown
  const { departments, loading: departmentsLoading } = useDepartments();

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    // Use BaseLayout
    <BaseLayout>
      <Helmet>
        <title>Gerenciamento de Usuários</title>
      </Helmet>
      
      {/* Removed old header and separator */}
      
      {/* Adjusted layout: Flex container for nav and main content */}
      <div className="flex h-full py-6"> {/* Added py-6 from BaseLayout standard */}
        {/* Admin Navigation */}
        <div className="w-64 mr-8 px-4"> {/* Added padding */}
          <AdminNav />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 px-4"> {/* Added padding */}
          {/* Page Title (Optional - can be handled by AdminNav or kept simple) */}
           <h2 className="text-3xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] pb-1">
            Gerenciamento de Usuários
          </h2>
          
          {/* Filters */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar usuário..."
                className="pl-8 bg-slate-900/50 border-blue-900/40 text-slate-300 placeholder:text-slate-500 focus-visible:ring-blue-500" // Added dark theme styles
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger className="bg-slate-900/50 border-blue-900/40 text-slate-300"> {/* Added dark theme styles */}
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
            
            {/* Department Filter - Dynamic */}
            {departmentsLoading ? (
              <Skeleton className="h-10 w-full bg-slate-700" />
            ) : (
              <Select
                value={filters.department}
                onValueChange={(value) => handleFilterChange('department', value)}
              >
                <SelectTrigger className="bg-slate-900/50 border-blue-900/40 text-slate-300"> {/* Added dark theme styles */}
                  <SelectValue placeholder="Selecione o departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os departamentos</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          
          {/* Users Table */}
          <div className="bg-slate-900/50 backdrop-blur-md border border-blue-900/40 rounded-lg shadow-lg overflow-hidden p-6"> {/* Added card styling */}
            <UsersTable filters={filters} />
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
