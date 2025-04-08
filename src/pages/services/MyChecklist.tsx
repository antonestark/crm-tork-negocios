
import React, { useState, useEffect } from 'react';
import { BaseLayout } from "@/components/layout/BaseLayout";
import { Card } from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { ServicesNav } from "@/components/services/ServicesNav";
import { MyChecklistItems } from "@/components/services/MyChecklistItems";
import { useAuthState } from '@/hooks/use-auth-state';

const MyChecklistPage = () => {
  const { userId } = useAuthState();

  return (
    <BaseLayout>
      <div className="py-6"> 
        <div className="animate-fade-in px-4">
          <ServicesNav />
        </div>
        
        <div className="flex items-center justify-between mb-6 animate-fade-in delay-100 px-4">
          <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] pb-1">
            Meus Itens de Checklist
          </h2>
        </div>
        
        <Card className="bg-slate-900/50 backdrop-blur-md border border-blue-900/40 shadow-lg p-6 animate-fade-in delay-200 mx-4">
          <Tabs defaultValue="morning">
            <TabsList className="grid w-full grid-cols-3 bg-slate-900/70 p-1 border border-blue-900/40 rounded-lg overflow-hidden">
              <TabsTrigger 
                value="morning"
                className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-950 data-[state=active]:to-indigo-950 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 text-slate-400 transition-all duration-300"
              >
                <span className="relative z-10">Manhã</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 data-[state=active]:opacity-100 transition-opacity"></div>
              </TabsTrigger>
              <TabsTrigger 
                value="afternoon"
                className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-950 data-[state=active]:to-indigo-950 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 text-slate-400 transition-all duration-300"
              >
                <span className="relative z-10">Tarde</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 data-[state=active]:opacity-100 transition-opacity"></div>
              </TabsTrigger>
              <TabsTrigger 
                value="evening"
                className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-950 data-[state=active]:to-indigo-950 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 text-slate-400 transition-all duration-300"
              >
                <span className="relative z-10">Noite</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 data-[state=active]:opacity-100 transition-opacity"></div>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="morning">
              <div className="mt-4 bg-slate-900/30 border border-blue-900/20 rounded-lg p-4">
                <MyChecklistItems period="Manhã" />
              </div>
            </TabsContent>
            <TabsContent value="afternoon">
              <div className="mt-4 bg-slate-900/30 border border-blue-900/20 rounded-lg p-4">
                <MyChecklistItems period="Tarde" />
              </div>
            </TabsContent>
            <TabsContent value="evening">
              <div className="mt-4 bg-slate-900/30 border border-blue-900/20 rounded-lg p-4">
                <MyChecklistItems period="Noite" />
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </BaseLayout>
  );
};

export default MyChecklistPage;
