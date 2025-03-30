
import { Header } from "@/components/layout/Header";
import { ServicesHeader } from "@/components/services/ServicesHeader";
import { ServiceTasks } from "@/components/services/ServiceTasks";
import { useServiceTasks } from "@/hooks/use-service-tasks";
import { BaseLayout } from "@/components/layout/BaseLayout";

const ServicesIndex = () => {
  const { tasks, loading, error } = useServiceTasks();
  
  return (
    <BaseLayout>
      <div className="py-6 px-4 max-w-7xl mx-auto">
        <div className="animate-fade-in">
          <ServicesHeader />
        </div>
        
        <div className="mt-6 bg-slate-900/50 backdrop-blur-md border border-blue-900/40 rounded-lg p-6 animate-fade-in delay-100">
          <h3 className="text-xl font-semibold mb-4 text-slate-100">Atividades Recentes</h3>
          <ServiceTasks tasks={tasks} loading={loading} error={error} />
        </div>
      </div>
    </BaseLayout>
  );
};

export default ServicesIndex;
