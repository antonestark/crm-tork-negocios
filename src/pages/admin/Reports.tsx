import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
// import { AdminNav } from '@/components/admin/AdminNav'; // Remover importação redundante
import { AdminLayout } from '@/components/admin/AdminLayout'; // Importar AdminLayout
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminReportsPage = () => {
  useEffect(() => {
    document.title = "Relatórios Administrativos";
  }, []);

  return (
    // Usar AdminLayout como container principal e passar a prop 'title'
    <AdminLayout title="Relatórios"> 
      <Helmet>
        <title>Relatórios Administrativos</title>
      </Helmet>
      {/* Remover AdminNav explícito */}
      {/* Remover container div e classes de espaçamento */}
      <div className="space-y-6"> {/* Adicionar espaçamento interno se necessário */}
        <h1 className="text-2xl font-bold text-slate-100">Relatórios Administrativos</h1> {/* Estilo título */}
        
        <Tabs defaultValue="usage" className="w-full">
          {/* Estilizar TabsList e TabsTrigger */}
          <TabsList className="bg-slate-800/60 border border-blue-900/40 text-slate-400">
            <TabsTrigger value="usage" className="data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100">Utilização</TabsTrigger>
            <TabsTrigger value="departments" className="data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100">Departamentos</TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100">Atividade</TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100">Segurança</TabsTrigger>
          </TabsList>
          
          {/* Estilizar Cards */}
          <TabsContent value="usage" className="mt-6">
            <Card className="bg-slate-900/50 border border-blue-900/40 text-slate-300">
              <CardHeader>
                <CardTitle className="text-slate-100">Métricas de Utilização</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Implementação em breve...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="departments" className="mt-6">
            <Card className="bg-slate-900/50 border border-blue-900/40 text-slate-300">
              <CardHeader>
                <CardTitle className="text-slate-100">Estatísticas por Departamento</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Implementação em breve...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="activity" className="mt-6">
            <Card className="bg-slate-900/50 border border-blue-900/40 text-slate-300">
              <CardHeader>
                <CardTitle className="text-slate-100">Relatórios de Atividade</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Implementação em breve...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="mt-6">
            <Card className="bg-slate-900/50 border border-blue-900/40 text-slate-300">
              <CardHeader>
                <CardTitle className="text-slate-100">Análise de Segurança</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Implementação em breve...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminReportsPage;
