
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, RefreshCw } from 'lucide-react';
import { Demand } from '@/types/demands';
import { User } from '@/types/admin';

// Using the ReceivedDemand type as defined in the file
interface ReceivedDemand {
  id: string;
  title: string;
  description?: string;
  area_id?: string;
  priority?: string;
  assigned_to?: string; 
  requested_by?: string;
  due_date?: string;    
  status?: string;      
  created_at: string;  
  updated_at: string;
  assigned_user?: { name: string } | null; 
  requester?: { name: string } | null;
}

interface DemandsTabProps {
  demands: ReceivedDemand[];
  users: User[];
  loading: boolean;
}

export const DemandsTab: React.FC<DemandsTabProps> = ({ 
  demands, 
  users, 
  loading 
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined);

  // Garantir que demands e users sejam arrays, mesmo que vazios
  const safeDemands = !loading && Array.isArray(demands) ? demands : [];
  const safeUsers = !loading && Array.isArray(users) ? users : [];

  // Filtrar demandas pendentes por data e pessoa responsável
  const filteredDemands = useMemo(() => {
    if (loading) return [];

    return safeDemands.filter(demand => {
      // Verificar se demand é um objeto válido
      if (!demand || typeof demand !== 'object') return false;
      
      // Filtrar por status 'open' (pendente)
      if (demand.status !== 'open') return false;

      // Filtrar por pessoa responsável (se selecionada)
      if (selectedUserId && selectedUserId !== 'all' && (!demand.assigned_to || demand.assigned_to !== selectedUserId)) return false;

      // Filtrar por data (se selecionada)
      if (selectedDate && demand.created_at) {
        try {
          const demandDate = new Date(demand.created_at);
          // Verificar se a data é válida
          if (isNaN(demandDate.getTime())) return false;
          
          const filterDate = new Date(selectedDate);
          
          // Comparar apenas ano, mês e dia
          if (
            demandDate.getFullYear() !== filterDate.getFullYear() ||
            demandDate.getMonth() !== filterDate.getMonth() ||
            demandDate.getDate() !== filterDate.getDate()
          ) {
            return false;
          }
        } catch (e) {
          // Se houver erro ao processar a data, pular esta demanda
          return false;
        }
      } else if (selectedDate) {
        // Se selectedDate existe mas demand.created_at não, pular
        return false;
      }

      return true;
    });
  }, [safeDemands, selectedDate, selectedUserId, loading]);

  // Resetar filtros
  const resetFilters = () => {
    setSelectedDate(undefined);
    setSelectedUserId(undefined);
  };

  // Formatar nome completo do usuário
  const getUserFullName = (userId: string | undefined) => {
    if (!userId) return 'Não atribuído';
    
    const user = safeUsers.find(u => u?.id === userId);
    if (!user) return 'Usuário não encontrado';
    
    return `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Nome Indisponível';
  };

  // TODO: Idealmente, buscar nomes das áreas a partir do area_id
  const getAreaDisplay = (areaId: string | undefined) => {
    if (!areaId) return 'N/A';
    // Por enquanto, apenas exibe o ID
    return `Área ID: ${areaId}`; 
  };

  return (
    <Card className="bg-slate-900/50 backdrop-blur-md border border-blue-900/40 shadow-lg hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white bg-gradient-to-r from-indigo-400 to-blue-300 bg-clip-text text-transparent">Demandas Pendentes</CardTitle>
          <div className="flex items-center space-x-2">
            {/* Filtro de Data */}
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={`bg-slate-800/70 border-blue-900/50 hover:bg-slate-800 hover:border-blue-500/50 ${selectedDate ? 'text-blue-400' : 'text-slate-300'} transition-colors`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })
                  ) : (
                    'Filtrar por Data'
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-800 border-blue-900/50">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  className="bg-slate-800 text-white"
                  classNames={{
                    day_today: "bg-blue-900/30 text-white",
                    day_selected: "bg-blue-500 text-white font-bold hover:bg-blue-600",
                    day_range_middle: "bg-blue-900/20",
                    day: "hover:bg-slate-700 focus:bg-slate-700 focus:text-white"
                  }}
                />
              </PopoverContent>
            </Popover>

            {/* Filtro de Pessoa */}
            <Select 
              value={selectedUserId} 
              onValueChange={setSelectedUserId}
            >
              <SelectTrigger className="w-[180px] bg-slate-800/70 border-blue-900/50 text-slate-300 hover:bg-slate-800 hover:border-blue-500/50 transition-colors">
                <SelectValue placeholder="Filtrar por Pessoa" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-blue-900/50 text-white">
                <SelectItem value="all" className="focus:bg-blue-900/30">Todos</SelectItem>
                {safeUsers.map(user => (
                  <SelectItem key={user.id} value={user.id} className="focus:bg-blue-900/30">
                    {user.first_name || ''} {user.last_name || ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Botão Resetar Filtros */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={resetFilters}
              disabled={!selectedDate && !selectedUserId}
              className="text-slate-300 hover:bg-slate-800/70 hover:text-blue-400 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full bg-slate-800/70" />
            <Skeleton className="h-10 w-full bg-slate-800/70" />
            <Skeleton className="h-10 w-full bg-slate-800/70" />
          </div>
        ) : filteredDemands.length === 0 ? (
          <div className="text-center py-8 text-slate-400 bg-slate-800/20 rounded-lg border border-blue-900/20">
            Nenhuma demanda pendente encontrada com os filtros selecionados.
          </div>
        ) : (
          <div className="rounded-lg overflow-hidden border border-blue-900/30">
            <Table>
              <TableHeader className="bg-slate-800/90">
                <TableRow className="border-blue-900/30 hover:bg-slate-700/50">
                  <TableHead className="text-slate-300">Título</TableHead>
                  <TableHead className="text-slate-300">Responsável</TableHead>
                  <TableHead className="text-slate-300">Área</TableHead>
                  <TableHead className="text-slate-300">Prioridade</TableHead>
                  <TableHead className="text-slate-300">Data de Criação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDemands.map(demand => (
                  <TableRow key={demand.id || 'unknown'} className="border-blue-900/20 bg-slate-800/40 hover:bg-slate-800/70 transition-colors">
                    <TableCell className="font-medium text-white">{demand.title || 'Sem título'}</TableCell>
                    <TableCell className="text-slate-300">{getUserFullName(demand.assigned_to)}</TableCell>
                    <TableCell className="text-slate-300">{getAreaDisplay(demand.area_id)}</TableCell>
                    <TableCell>
                      {(() => {
                        const priority = demand.priority || 'low';
                        return (
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            priority === 'high' ? 'bg-rose-900/30 text-rose-300 border border-rose-700/50' :
                            priority === 'medium' ? 'bg-amber-900/30 text-amber-300 border border-amber-700/50' :
                            'bg-emerald-900/30 text-emerald-300 border border-emerald-700/50'
                          }`}>
                            {priority === 'high' ? 'Alta' :
                             priority === 'medium' ? 'Média' : 'Baixa'}
                          </div>
                        );
                      })()}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {(() => {
                        try {
                          if (!demand.created_at) return 'Data não disponível';
                          const date = new Date(demand.created_at);
                          if (isNaN(date.getTime())) return 'Data inválida';
                          return format(date, 'dd/MM/yyyy', { locale: ptBR });
                        } catch (e) {
                          return 'Erro ao processar data';
                        }
                      })()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
