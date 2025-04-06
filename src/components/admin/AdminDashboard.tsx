
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CountUp } from '@/components/ui/countup';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Users, Building2, CalendarDays, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';
import { format, subDays } from 'date-fns';
import { Link } from 'react-router-dom';
import { ActivityLog } from '@/types/admin';
import { activityLogsAdapter } from '@/integrations/supabase/adapters';

export function AdminDashboard() {
  const [userCount, setUserCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);
  const [activityCount, setActivityCount] = useState(0);
  const [recentActivityLogs, setRecentActivityLogs] = useState<ActivityLog[]>([]);

  // Get counts from various tables
  const { isLoading: isLoadingUsers } = useQuery({
    queryKey: ['admin-dashboard-users'],
    queryFn: async () => {
      try {
        // TESTE: Tentar buscar apenas um ID para verificar a leitura básica
        const { data: testData, error: testError } = await supabase
          .from('users')
          .select('id')
          .limit(1);

        if (testError) {
          console.error('Error fetching single user ID (test):', testError.message);
          throw testError; // Re-lança o erro para o catch principal
        }
        console.log('Teste de leitura básica de usuário bem-sucedido:', testData);

        // Se o teste passou, tenta a contagem original
        const { count, error } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });

        if (error) throw error;
        setUserCount(count || 0);
        return count;
      } catch (error: any) {
        console.error('Error fetching user count:', error.message);
        toast.error("Falha ao carregar contagem de usuários");
        return 0;
      }
    }
  });

  const { isLoading: isLoadingDepartments } = useQuery({
    queryKey: ['admin-dashboard-departments'],
    queryFn: async () => {
      try {
        const { count, error } = await supabase
          .from('departments')
          .select('*', { count: 'exact', head: true });
        
        if (error) throw error;
        setDepartmentCount(count || 0);
        return count;
      } catch (error: any) {
        console.error('Error fetching department count:', error.message);
        toast.error("Falha ao carregar contagem de departamentos");
        return 0;
      }
    }
  });

  const { isLoading: isLoadingActivities } = useQuery({
    queryKey: ['admin-dashboard-activities'],
    queryFn: async () => {
      try {
        // Get activity logs from the last 24 hours
        const oneDayAgo = subDays(new Date(), 1).toISOString();
        
        const { count, error: countError } = await supabase
          .from('activity_logs')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', oneDayAgo);
        
        if (countError) throw countError;
        setActivityCount(count || 0);
        
        // Get recent activity logs
        const { data, error } = await supabase
          .from('activity_logs')
          .select(`
            *,
            user:users(*)
          `)
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (error) throw error;
        
        const adaptedLogs = activityLogsAdapter(data || []);
        setRecentActivityLogs(adaptedLogs);
        
        return count;
      } catch (error: any) {
        console.error('Error fetching activity logs:', error.message);
        toast.error("Falha ao carregar atividades recentes");
        return 0;
      }
    }
  });

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link to="/admin/users" className="block">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Usuários
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingUsers ? (
                  <span className="text-muted-foreground">...</span>
                ) : (
                  <CountUp end={userCount} duration={1.5} />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Total de usuários cadastrados
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/departments" className="block">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Departamentos
              </CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingDepartments ? (
                  <span className="text-muted-foreground">...</span>
                ) : (
                  <CountUp end={departmentCount} duration={1.5} />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Total de departamentos
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/audit" className="block">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Atividades Recentes
              </CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingActivities ? (
                  <span className="text-muted-foreground">...</span>
                ) : (
                  <CountUp end={activityCount} duration={1.5} />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Ações nas últimas 24 horas
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/reports" className="block">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Relatórios
              </CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <span>4</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Relatórios disponíveis
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoadingActivities ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : recentActivityLogs.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">Nenhuma atividade recente</p>
            ) : (
              recentActivityLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <ClipboardList className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {log.user ? `${log.user.first_name} ${log.user.last_name}` : 'Usuário desconhecido'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {log.action} - {log.entity_type}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(log.created_at), 'dd/MM HH:mm')}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
