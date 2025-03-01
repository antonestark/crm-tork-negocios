
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { ServicesNav } from "@/components/services/ServicesNav";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CheckSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ChecklistItems } from "@/components/services/ChecklistItems";

const ChecklistPage = () => {
  const [items, setItems] = useState<any>({
    morning: [],
    afternoon: [],
    evening: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChecklistItems();
  }, []);

  const fetchChecklistItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("service_checklist_items")
        .select(`
          *,
          service_areas(name)
        `)
        .eq("active", true)
        .order("name", { ascending: true });
      
      if (error) throw error;
      
      // Agrupar por período
      const groupedItems = {
        morning: data?.filter(item => item.period === 'morning') || [],
        afternoon: data?.filter(item => item.period === 'afternoon') || [],
        evening: data?.filter(item => item.period === 'evening') || []
      };
      
      setItems(groupedItems);
    } catch (error) {
      console.error("Erro ao buscar itens do checklist:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <ServicesNav />
        <h2 className="text-3xl font-bold tracking-tight mb-6">Checklist Diário</h2>
        <Card className="p-6">
          <Tabs defaultValue="morning">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="morning">Manhã</TabsTrigger>
              <TabsTrigger value="afternoon">Tarde</TabsTrigger>
              <TabsTrigger value="evening">Noite</TabsTrigger>
            </TabsList>
            <TabsContent value="morning">
              <div className="mt-4">
                {loading ? (
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : (
                  <ChecklistItems items={items.morning} />
                )}
              </div>
            </TabsContent>
            <TabsContent value="afternoon">
              <div className="mt-4">
                {loading ? (
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : (
                  <ChecklistItems items={items.afternoon} />
                )}
              </div>
            </TabsContent>
            <TabsContent value="evening">
              <div className="mt-4">
                {loading ? (
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : (
                  <ChecklistItems items={items.evening} />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </main>
    </div>
  );
};

export default ChecklistPage;
