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
import { ChecklistItems } from "@/components/services/ChecklistItems";
import { useAuthState } from '@/hooks/use-auth-state';
import { supabase } from '@/integrations/supabase/client';

type User = {
  id: string;
  name: string;
};

const ChecklistPage = () => {
  const { userId } = useAuthState();

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    return today;
  });
  const [selectedResponsibleId, setSelectedResponsibleId] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('users').select('id, name');
      if (!error && data) {
        setUsers(data);
      }
    };
    fetchUsers();
  }, []);

  return (
    <BaseLayout>
      <div className="py-6"> 
        <div className="animate-fade-in px-4">
          <ServicesNav />
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6 animate-fade-in delay-100 px-4">
          <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] pb-1">
            Checklist Diário
          </h2>
          <div className="flex flex-col md:flex-row gap-2 md:items-center">
            <div>
              <label className="block text-sm font-medium mb-1">Data</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Responsável</label>
              <select
                value={selectedResponsibleId}
                onChange={(e) => setSelectedResponsibleId(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-black"
              >
                <option value="">Todos</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <Card className="bg-[#094067] dark:bg-slate-900/50 backdrop-blur-md border border-blue-900/40 shadow-lg p-6 animate-fade-in delay-200 mx-4">
          <Tabs defaultValue="morning">
            <TabsList className="grid w-full grid-cols-3 bg-slate-200/70 dark:bg-slate-900/70 p-1 border border-blue-900/40 rounded-lg overflow-hidden">
              <TabsTrigger 
                value="morning"
                className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-950 data-[state=active]:to-indigo-950 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 text-slate-700 dark:text-slate-400 transition-all duration-300"
              >
                <span className="relative z-10">Manhã</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 data-[state=active]:opacity-100 transition-opacity"></div>
              </TabsTrigger>
              <TabsTrigger 
                value="afternoon"
                className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-950 data-[state=active]:to-indigo-950 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 text-slate-700 dark:text-slate-400 transition-all duration-300"
              >
                <span className="relative z-10">Tarde</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 data-[state=active]:opacity-100 transition-opacity"></div>
              </TabsTrigger>
              <TabsTrigger 
                value="evening"
                className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-950 data-[state=active]:to-indigo-950 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 text-slate-700 dark:text-slate-400 transition-all duration-300"
              >
                <span className="relative z-10">Noite</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 data-[state=active]:opacity-100 transition-opacity"></div>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="morning">
              <div className="mt-4 bg-slate-100/50 dark:bg-slate-900/30 border border-blue-900/20 rounded-lg p-4">
                <ChecklistItems 
                  period="Manhã" 
                  onlyResponsible={false} 
                  date={selectedDate} 
                  responsibleIdFilter={selectedResponsibleId || undefined} 
                />
              </div>
            </TabsContent>
            <TabsContent value="afternoon">
              <div className="mt-4 bg-slate-100/50 dark:bg-slate-900/30 border border-blue-900/20 rounded-lg p-4">
                <ChecklistItems 
                  period="Tarde" 
                  onlyResponsible={false} 
                  date={selectedDate} 
                  responsibleIdFilter={selectedResponsibleId || undefined} 
                />
              </div>
            </TabsContent>
            <TabsContent value="evening">
              <div className="mt-4 bg-slate-100/50 dark:bg-slate-900/30 border border-blue-900/20 rounded-lg p-4">
                <ChecklistItems 
                  period="Noite" 
                  onlyResponsible={false} 
                  date={selectedDate} 
                  responsibleIdFilter={selectedResponsibleId || undefined} 
                />
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </BaseLayout>
  );
};

export default ChecklistPage;
