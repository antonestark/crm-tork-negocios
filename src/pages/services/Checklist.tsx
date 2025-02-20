
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

const ChecklistPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
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
                <p className="text-muted-foreground">Tarefas da manhã serão listadas aqui</p>
              </div>
            </TabsContent>
            <TabsContent value="afternoon">
              <div className="mt-4">
                <p className="text-muted-foreground">Tarefas da tarde serão listadas aqui</p>
              </div>
            </TabsContent>
            <TabsContent value="evening">
              <div className="mt-4">
                <p className="text-muted-foreground">Tarefas da noite serão listadas aqui</p>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </main>
    </div>
  );
};

export default ChecklistPage;
