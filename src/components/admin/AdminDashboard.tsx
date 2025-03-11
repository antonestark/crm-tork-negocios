
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CountUp } from '@/components/ui/countup';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Users, Building2, CalendarDays, ClipboardList } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { format, subDays } from 'date-fns';
import { Link } from 'react-router-dom';

export function AdminDashboard() {
  const [userCount, setUserCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);
  const [activityCount, setActivityCount] = useState(0);
  const [recentActivityLogs, setRecentActivityLogs] = useState<any[]>([]);

  // Get counts from various tables
  const { isLoading: isLoadingUsers } = useQuery({
    queryKey: ['admin-dashboard-users'],
    queryFn: async () => {
      try {
        const { count, error } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });
        
        if (error) throw error;
        setUserCount(count || 0);
        return count;
      } catch (error: any) {
        console.error('Error fetching user count:', error.message);
        toast({
          title: "Erro",
          description: "Falha ao carregar contagem de usuários",
          variant: "destructive"
        });
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
        toast({
          title: "Erro",
          description: "Falha ao carregar contagem de departamentos",
          variant: "destructive"
        });
        return 0;
      }
    }
  });

  // Mock active logs count
  useEffect(() => {
    // Set some mock data temporarily
    setActivityCount(24);
    setRecentActivityLogs([
      {
        id: '1',
        action: 'login',
        entity_type: 'auth',
        created_at: new Date().toISOString(),
        user: { first_name: 'João', last_name: 'Silva' }
      },
      {
        id: '2',
        action: 'create',
        entity_type: 'user',
        created_at: subDays(new Date(), 1).toISOString(),
        user: { first_name: 'Maria', last_name: 'Oliveira' }
      },
      {
        id: '3',
        action: 'update',
        entity_type: 'department',
        created_at: subDays(new Date(), 2).toISOString(),
        user: { first_name: 'Carlos', last_name: 'Santos' }
      }
    ]);
  }, []);

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
                <CountUp end={activityCount} duration={1.5} />
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
            {recentActivityLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <ClipboardList className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {log.user.first_name} {log.user.last_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {log.action} - {log.entity_type}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {format(new Date(log.created_at), 'dd/MM HH:mm')}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
