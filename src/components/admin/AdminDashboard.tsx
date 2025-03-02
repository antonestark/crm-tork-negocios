
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FolderKanban, Shield, FileText, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface DashboardCounts {
  users: number;
  departments: number;
  permissions: number;
  logs: number;
  recentAlerts: number;
}

export function AdminDashboard() {
  const [counts, setCounts] = useState<DashboardCounts>({
    users: 0,
    departments: 0,
    permissions: 0,
    logs: 0,
    recentAlerts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      try {
        // Fetch users count
        const { count: usersCount } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });

        // Fetch departments count
        const { count: departmentsCount } = await supabase
          .from('departments')
          .select('*', { count: 'exact', head: true });

        // Fetch permissions count
        const { count: permissionsCount } = await supabase
          .from('permissions')
          .select('*', { count: 'exact', head: true });

        // Fetch logs count
        const { count: logsCount } = await supabase
          .from('activity_logs')
          .select('*', { count: 'exact', head: true });

        // Fetch recent alerts (logs with high severity in past 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const { count: alertsCount } = await supabase
          .from('activity_logs')
          .select('*', { count: 'exact', head: true })
          .eq('severity', 'high')
          .gte('created_at', sevenDaysAgo.toISOString());

        setCounts({
          users: usersCount || 0,
          departments: departmentsCount || 0,
          permissions: permissionsCount || 0,
          logs: logsCount || 0,
          recentAlerts: alertsCount || 0
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const cards = [
    {
      title: "Usuários",
      value: counts.users,
      description: "Total de usuários cadastrados",
      icon: <Users className="h-6 w-6 text-primary" />,
      progressValue: 100
    },
    {
      title: "Departamentos",
      value: counts.departments,
      description: "Departamentos na estrutura",
      icon: <FolderKanban className="h-6 w-6 text-success" />,
      progressValue: 100
    },
    {
      title: "Permissões",
      value: counts.permissions,
      description: "Permissões configuradas",
      icon: <Shield className="h-6 w-6 text-info" />,
      progressValue: 100
    },
    {
      title: "Logs de Atividade",
      value: counts.logs,
      description: "Registros de atividade",
      icon: <FileText className="h-6 w-6 text-warning" />,
      progressValue: 100
    },
    {
      title: "Alertas Recentes",
      value: counts.recentAlerts,
      description: "Alertas nos últimos 7 dias",
      icon: <AlertTriangle className="h-6 w-6 text-danger" />,
      progressValue: counts.recentAlerts > 0 ? 100 : 0
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, index) => (
        <Card key={index} className={loading ? "opacity-70" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium">
              {card.title}
            </CardTitle>
            {card.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "-" : card.value}</div>
            <CardDescription>{card.description}</CardDescription>
            <Progress
              value={loading ? 33 : card.progressValue}
              className="h-1 mt-2"
              aria-label={`${card.value} ${card.title}`}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
