
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useServiceAreasData } from '@/hooks/use-service-areas-data';
import { useServiceTasks } from '@/hooks/use-service-tasks';
import { useServiceReports } from '@/hooks/use-service-reports';
import { ServiceAreas } from '@/components/services/ServiceAreas';
import { ServiceTasks } from '@/components/services/ServiceTasks';
import { ServicesMetrics } from '@/components/services/ServicesMetrics';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface ServiceStatisticsResult {
  completed: number;
  pending: number;
  delayed: number;
  avg_completion_time: number;
}

const ServicesPage = () => {
  const { areas, loading: areasLoading, error: areasError } = useServiceAreasData();
  const { tasks, loading: tasksLoading, error: tasksError } = useServiceTasks();
  const { reports, loading: reportsLoading, error: reportsError, metrics } = useServiceReports();
  
  const [stats, setStats] = useState<ServiceStatisticsResult | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetchServiceStats();
    
    // Set up a realtime subscription for stats updates
    const subscription = supabase
      .channel('service_stats_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'services' 
      }, () => {
        fetchServiceStats();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Use aggressive type assertion for RPC calls
  const fetchServiceStats = async () => {
    try {
      setStatsLoading(true);
      
      const { data, error } = await (supabase
        .rpc('get_service_statistics') as any);
      
      if (error) throw error;
      
      setStats(data);
    } catch (err) {
      console.error('Error fetching service statistics:', err);
      toast.error('Erro ao carregar estatísticas de serviços');
    } finally {
      setStatsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Serviços</h1>
        <Button asChild>
          <Link to="/services/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Serviço
          </Link>
        </Button>
      </div>

      <ServicesMetrics 
        metrics={metrics} 
        loading={reportsLoading} 
      />

      <Tabs defaultValue="areas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="areas">Áreas de Serviço</TabsTrigger>
          <TabsTrigger value="recent">Atividades Recentes</TabsTrigger>
        </TabsList>
        <TabsContent value="areas" className="space-y-4">
          <ServiceAreas 
            areas={areas} 
            loading={areasLoading} 
            error={areasError} 
          />
        </TabsContent>
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
              <CardDescription>
                Últimas atualizações de serviços nas áreas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ServiceTasks 
                tasks={tasks} 
                loading={tasksLoading} 
                error={tasksError} 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ServicesPage;
