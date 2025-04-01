import React from 'react'; // Import React
import { AdminNav } from '@/components/admin/AdminNav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BaseLayout } from '@/components/layout/BaseLayout'; // Import BaseLayout

const SettingsPage = () => {
  return (
    // Use BaseLayout
    <BaseLayout>
      {/* Removed old container, Helmet, h1 */}
      <div className="flex h-full py-6 px-4">
        {/* Admin Navigation */}
        <div className="w-64 mr-8">
          <AdminNav />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] pb-1">
            Configurações do Sistema
          </h1>
          
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="bg-slate-900/70 p-1 border border-blue-900/40 rounded-lg overflow-hidden"> {/* Added dark theme styles */}
              <TabsTrigger value="general" className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-950 data-[state=active]:to-indigo-950 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 text-slate-400 transition-all duration-300">Geral</TabsTrigger>
              <TabsTrigger value="security" className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-950 data-[state=active]:to-indigo-950 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 text-slate-400 transition-all duration-300">Segurança</TabsTrigger>
              <TabsTrigger value="notifications" className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-950 data-[state=active]:to-indigo-950 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 text-slate-400 transition-all duration-300">Notificações</TabsTrigger>
              <TabsTrigger value="backup" className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-950 data-[state=active]:to-indigo-950 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 text-slate-400 transition-all duration-300">Backup</TabsTrigger>
              <TabsTrigger value="integrations" className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-950 data-[state=active]:to-indigo-950 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 text-slate-400 transition-all duration-300">Integrações</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="mt-6">
              <Card className="bg-slate-900/50 backdrop-blur-md border border-blue-900/40 shadow-lg"> {/* Added dark theme styles */}
                <CardHeader>
                  <CardTitle>Configurações Gerais</CardTitle>
                  <CardDescription>
                    Configurações básicas do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Implementação em breve...</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security" className="mt-6">
              <Card className="bg-slate-900/50 backdrop-blur-md border border-blue-900/40 shadow-lg"> {/* Added dark theme styles */}
                <CardHeader>
                  <CardTitle>Configurações de Segurança</CardTitle>
                  <CardDescription>
                    Gerenciamento de políticas de segurança
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Implementação em breve...</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="mt-6">
              <Card className="bg-slate-900/50 backdrop-blur-md border border-blue-900/40 shadow-lg"> {/* Added dark theme styles */}
                <CardHeader>
                  <CardTitle>Configurações de Notificações</CardTitle>
                  <CardDescription>
                    Preferências e canais de notificação
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Implementação em breve...</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="backup" className="mt-6">
              <Card className="bg-slate-900/50 backdrop-blur-md border border-blue-900/40 shadow-lg"> {/* Added dark theme styles */}
                <CardHeader>
                  <CardTitle>Backup e Restauração</CardTitle>
                  <CardDescription>
                    Gerenciamento de backups do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Implementação em breve...</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="integrations" className="mt-6">
              <Card className="bg-slate-900/50 backdrop-blur-md border border-blue-900/40 shadow-lg"> {/* Added dark theme styles */}
                <CardHeader>
                  <CardTitle>Integrações</CardTitle>
                  <CardDescription>
                    Conexões com serviços externos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Implementação em breve...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </BaseLayout>
  );
};

export default SettingsPage;
