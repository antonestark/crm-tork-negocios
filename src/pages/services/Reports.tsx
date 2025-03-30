
import { BaseLayout } from "@/components/layout/BaseLayout";
import { ServicesMetrics } from "@/components/services/ServicesMetrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServicesNav } from "@/components/services/ServicesNav";
import { AreaMetrics } from "@/components/services/AreaMetrics";
import { useServiceReports } from "@/hooks/use-service-reports";

const ReportsPage = () => {
  const { metrics, loading } = useServiceReports();
  
  return (
    <BaseLayout>
      {/* Removed py-6, px-4, max-w-7xl, mx-auto */}
      <div className="py-6"> 
        <div className="animate-fade-in px-4"> {/* Added px-4 */}
          <ServicesNav />
        </div>
        
        <div className="flex items-center justify-between mb-6 animate-fade-in delay-100 px-4"> {/* Added px-4 */}
          <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] pb-1">
            Relatórios
          </h2>
        </div>
        
        <div className="animate-fade-in delay-200 px-4"> {/* Added px-4 */}
          <ServicesMetrics metrics={metrics} loading={loading} />
        </div>
        
        <div className="mt-6 animate-fade-in delay-300 px-4"> {/* Added px-4 */}
          <Card className="bg-slate-900/50 backdrop-blur-md border border-blue-900/40 shadow-lg overflow-hidden group hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all duration-300">
            <CardHeader className="border-b border-blue-900/40">
              <CardTitle className="text-slate-100">Desempenho por Área</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <AreaMetrics />
            </CardContent>
          </Card>
        </div>
      </div>
    </BaseLayout>
  );
};

export default ReportsPage;
