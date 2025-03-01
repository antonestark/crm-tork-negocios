
import { Header } from "@/components/layout/Header";
import { ServiceAreas } from "@/components/services/ServiceAreas";
import { ServicesNav } from "@/components/services/ServicesNav";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const AreasPage = () => {
  const [areas, setAreas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("service_areas")
        .select("*")
        .order("name", { ascending: true });
      
      if (error) throw error;
      
      setAreas(data || []);
    } catch (error) {
      console.error("Erro ao buscar áreas:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <ServicesNav />
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold tracking-tight">Áreas de Controle</h2>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Área
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <Skeleton key={i} className="h-[120px] rounded-xl" />
            ))}
          </div>
        ) : (
          <ServiceAreas areasData={areas} />
        )}
      </main>
    </div>
  );
};

export default AreasPage;
