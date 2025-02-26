
import { Header } from "@/components/layout/Header";
import { ServiceAreas } from "@/components/services/ServiceAreas";

const AreasPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <h2 className="text-3xl font-bold tracking-tight mb-6">Áreas de Controle</h2>
        <ServiceAreas />
      </main>
    </div>
  );
};

export default AreasPage;
