
import { Header } from "@/components/layout/Header";
import { ServicesMetrics } from "@/components/services/ServicesMetrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServicesNav } from "@/components/services/ServicesNav";
import { AreaMetrics } from "@/components/services/AreaMetrics";
import { useServiceReports } from "@/hooks/use-service-reports";

const ReportsPage = () => {
  const { metrics, loading } = useServiceReports();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <ServicesNav />
        <h2 className="text-3xl font-bold tracking-tight mb-6">Relatórios</h2>
        <ServicesMetrics metrics={metrics} loading={loading} />
        <div className="mt-6 grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Desempenho por Área</CardTitle>
            </CardHeader>
            <CardContent>
              <AreaMetrics />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ReportsPage;
