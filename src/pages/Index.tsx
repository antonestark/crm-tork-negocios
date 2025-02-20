
import { Header } from "@/components/layout/Header";
import { MetricsGrid } from "@/components/dashboard/MetricsGrid";
import { TaskPanel } from "@/components/dashboard/TaskPanel";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6">
        <MetricsGrid />
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          <TaskPanel />
          {/* Calendar component will be added here in the next iteration */}
        </div>
      </main>
    </div>
  );
};

export default Index;
