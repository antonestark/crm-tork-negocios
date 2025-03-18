
import React from 'react';
import { Building, ChevronRight, Plus, Search, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Department } from '@/types/admin';
import { Skeleton } from '@/components/ui/skeleton';

interface DepartmentListProps {
  departments: Department[];
  selectedDepartment: Department | null;
  loading: boolean;
  error: Error | null;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSelectDepartment: (department: Department) => void;
  onNewDepartment: () => void;
}

export function DepartmentList({
  departments,
  selectedDepartment,
  loading,
  error,
  searchQuery,
  onSearchChange,
  onSelectDepartment,
  onNewDepartment
}: DepartmentListProps) {
  return (
    <div className="w-1/3 border-r pr-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Departamentos</h2>
        <Button onClick={onNewDepartment} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Novo
        </Button>
      </div>
      
      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar departamentos..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <ScrollArea className="h-[calc(100vh-220px)]">
        {loading ? (
          <div className="space-y-2 p-2">
            <Skeleton className="h-16 w-full rounded-md" />
            <Skeleton className="h-16 w-full rounded-md" />
            <Skeleton className="h-16 w-full rounded-md" />
          </div>
        ) : error ? (
          <div className="text-center py-4 px-2">
            <p className="text-destructive font-medium">Erro ao carregar departamentos</p>
            <p className="text-sm text-muted-foreground mt-1">Tente novamente mais tarde</p>
          </div>
        ) : departments.length === 0 ? (
          <div className="text-center py-8 px-2">
            <Building className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground mb-2">Nenhum departamento encontrado</p>
            <Button onClick={onNewDepartment} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" /> Criar Departamento
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {departments.map((department) => (
              <div
                key={department.id}
                className={`p-3 rounded-md cursor-pointer transition-colors ${
                  selectedDepartment?.id === department.id
                    ? 'bg-primary/10'
                    : 'hover:bg-muted'
                }`}
                onClick={() => onSelectDepartment(department)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">{department.name}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mt-1 truncate">
                  {department.description || 'Sem descrição'}
                </p>
                <div className="flex items-center mt-2">
                  <Users className="h-3 w-3 mr-1 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {department._memberCount} membros
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
