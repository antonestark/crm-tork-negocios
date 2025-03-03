
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { AdminNav } from '@/components/admin/AdminNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminReportsPage = () => {
  useEffect(() => {
    document.title = "Relatórios Administrativos";
  }, []);

  return (
    <div className="container mx-auto py-6">
      <Helmet>
        <title>Relatórios Administrativos</title>
      </Helmet>
      <AdminNav />
      <div className="mt-6">
        <h1 className="text-2xl font-bold mb-6">Relatórios Administrativos</h1>
        
        <Tabs defaultValue="usage" className="w-full">
          <TabsList>
            <TabsTrigger value="usage">Utilização</TabsTrigger>
            <TabsTrigger value="departments">Departamentos</TabsTrigger>
            <TabsTrigger value="activity">Atividade</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
          </TabsList>
          
          <TabsContent value="usage" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Métricas de Utilização</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Implementação em breve...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="departments" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas por Departamento</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Implementação em breve...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="activity" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios de Atividade</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Implementação em breve...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Análise de Segurança</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Implementação em breve...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminReportsPage;
