
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Calendar, Info, AlertTriangle, AlertCircle } from 'lucide-react';
import { ActivityLog } from '@/types/admin';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { activityLogsAdapter } from '@/integrations/supabase/adapters';

export function AuditLogs() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('activity_logs')
          .select(`
            *,
            user:users(first_name, last_name, profile_image_url)
          `)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        const adaptedLogs = activityLogsAdapter(data || []);
        setLogs(adaptedLogs);
        setFilteredLogs(adaptedLogs);
      } catch (error) {
        console.error('Failed to fetch activity logs:', error);
        toast({
          title: "Erro",
          description: "Falha ao carregar logs de atividade",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = logs;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(log => 
        (log.user?.first_name?.toLowerCase().includes(query) ||
        log.user?.last_name?.toLowerCase().includes(query) ||
        log.action?.toLowerCase().includes(query) ||
        log.entity_type?.toLowerCase().includes(query))
      );
    }

    // Apply severity filter
    if (severityFilter !== 'all') {
      filtered = filtered.filter(log => log.severity === severityFilter);
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(log => log.category === categoryFilter);
    }

    setFilteredLogs(filtered);
  }, [searchQuery, severityFilter, categoryFilter, logs]);

  const getSeverityIcon = (severity: string | null) => {
    switch(severity) {
      case 'high':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'low':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-400" />;
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Buscar logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Severidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="low">Baixa</SelectItem>
              <SelectItem value="info">Informativa</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="security">Segurança</SelectItem>
              <SelectItem value="system">Sistema</SelectItem>
              <SelectItem value="auth">Autenticação</SelectItem>
              <SelectItem value="data">Dados</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="icon">
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <p>Carregando logs de atividade...</p>
      ) : (
        <div className="space-y-4">
          {filteredLogs.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              Nenhum log de atividade encontrado com os filtros aplicados.
            </p>
          ) : (
            filteredLogs.map((log) => (
              <Card key={log.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getSeverityIcon(log.severity)}</div>
                    <div className="flex-grow">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                        <div>
                          <div className="font-medium">
                            {log.user ? `${log.user.first_name} ${log.user.last_name}` : 'Sistema'}{' '}
                            <span className="font-normal text-muted-foreground">
                              {log.action} {log.entity_type}
                              {log.entity_id ? ` (ID: ${log.entity_id})` : ''}
                            </span>
                          </div>
                          {log.details && (
                            <div className="text-sm mt-1">
                              {typeof log.details === 'object' 
                                ? Object.entries(log.details as Record<string, any>).map(([key, value]) => (
                                    <span key={key} className="mr-3">
                                      <span className="font-medium">{key}:</span> {value?.toString()}
                                    </span>
                                  ))
                                : log.details.toString()
                              }
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground whitespace-nowrap">
                          {formatDate(log.created_at)}
                        </div>
                      </div>
                      <div className="flex mt-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                          {log.category || 'system'}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                          IP: {log.ip_address || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
