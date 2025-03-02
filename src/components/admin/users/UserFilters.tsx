
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Department {
  id: string;
  name: string;
}

interface UserFiltersProps {
  filters: {
    status: string;
    department: string;
    search: string;
  };
  setFilters: (filters: any) => void;
  onClose: () => void;
}

export function UserFilters({ 
  filters, 
  setFilters, 
  onClose 
}: UserFiltersProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [localFilters, setLocalFilters] = useState({ ...filters });

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const { data, error } = await supabase
          .from('departments')
          .select('id, name')
          .order('name');
          
        if (error) throw error;
        setDepartments(data || []);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    }

    fetchDepartments();
  }, []);

  const handleChange = (field: string, value: string) => {
    setLocalFilters({ ...localFilters, [field]: value });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalFilters({ ...localFilters, [name]: value });
  };

  const applyFilters = () => {
    setFilters(localFilters);
  };

  const clearFilters = () => {
    const resetFilters = {
      status: 'all',
      department: 'all',
      search: ''
    };
    setLocalFilters(resetFilters);
    setFilters(resetFilters);
  };

  return (
    <Card className="border border-muted">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Filtros</h3>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Fechar</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={localFilters.status}
              onValueChange={(value) => handleChange('status', value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="inactive">Inativos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="department">Departamento</Label>
            <Select
              value={localFilters.department}
              onValueChange={(value) => handleChange('department', value)}
            >
              <SelectTrigger id="department">
                <SelectValue placeholder="Selecione o departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {departments.map((department) => (
                  <SelectItem key={department.id} value={department.id}>
                    {department.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="search">Buscar</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                name="search"
                placeholder="Nome do usuário"
                className="pl-8"
                value={localFilters.search}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Limpar
          </Button>
          <Button size="sm" onClick={applyFilters}>
            Aplicar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
