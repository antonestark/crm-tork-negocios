
import React from 'react';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface UserFiltersProps {
  status: string;
  department: string;
  search: string;
  onStatusChange: (status: string) => void;
  onDepartmentChange: (department: string) => void;
  onSearchChange: (search: string) => void;
}

export function UserFilters({
  status,
  department,
  search,
  onStatusChange,
  onDepartmentChange,
  onSearchChange,
}: UserFiltersProps) {
  return (
    <div className="flex flex-col gap-4 mb-6 md:flex-row">
      <div className="w-full md:w-1/3">
        <Label htmlFor="search">Buscar</Label>
        <Input
          id="search"
          placeholder="Buscar usuários..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="w-full md:w-1/3">
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger id="status">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="inactive">Inativo</SelectItem>
            <SelectItem value="blocked">Bloqueado</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full md:w-1/3">
        <Label htmlFor="department">Departamento</Label>
        <Select value={department} onValueChange={onDepartmentChange}>
          <SelectTrigger id="department">
            <SelectValue placeholder="Filtrar por departamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os departamentos</SelectItem>
            <SelectItem value="1">Marketing</SelectItem>
            <SelectItem value="2">Engenharia</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
