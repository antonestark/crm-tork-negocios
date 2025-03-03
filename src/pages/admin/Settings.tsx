
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { AdminNav } from '@/components/admin/AdminNav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SettingsPage = () => {
  useEffect(() => {
    document.title = "Configurações do Sistema";
  }, []);

  return (
    <div className="container mx-auto py-6">
      <Helmet>
        <title>Configurações do Sistema</title>
      </Helmet>
      <AdminNav />
      <div className="mt-6">
        <h1 className="text-2xl font-bold mb-6">Configurações do Sistema</h1>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList>
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="backup">Backup e Restauração</TabsTrigger>
            <TabsTrigger value="integrations">Integrações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
                <CardDescription>
                  Configurações básicas do sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Implementação em breve...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Segurança</CardTitle>
                <CardDescription>
                  Gerenciamento de políticas de segurança
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Implementação em breve...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Notificações</CardTitle>
                <CardDescription>
                  Preferências e canais de notificação
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Implementação em breve...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="backup" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Backup e Restauração</CardTitle>
                <CardDescription>
                  Gerenciamento de backups do sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Implementação em breve...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="integrations" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Integrações</CardTitle>
                <CardDescription>
                  Conexões com serviços externos
                </CardDescription>
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

export default SettingsPage;
