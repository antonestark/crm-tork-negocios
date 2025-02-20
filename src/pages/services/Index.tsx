
import { Header } from "@/components/layout/Header";
import { ServicesHeader } from "@/components/services/ServicesHeader";
import { ServicesMetrics } from "@/components/services/ServicesMetrics";
import { ServiceAreas } from "@/components/services/ServiceAreas";
import { TaskPanel } from "@/components/services/TaskPanel";

const ServicesIndex = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <ServicesHeader />
        <div className="mt-6">
          <ServicesMetrics />
        </div>
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
          <ServiceAreas />
          <TaskPanel />
        </div>
      </main>
    </div>
  );
};

export default ServicesIndex;
