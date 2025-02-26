
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MaintenancePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <h2 className="text-3xl font-bold tracking-tight mb-6">Manutenções</h2>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Próximas Manutenções</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Lista de manutenções será exibida aqui</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MaintenancePage;
