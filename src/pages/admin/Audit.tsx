import React from 'react'; // Import React
import { AdminNav } from '@/components/admin/AdminNav';
import { AuditLogs } from '@/components/admin/audit/AuditLogs';
import { BaseLayout } from '@/components/layout/BaseLayout'; // Import BaseLayout

const AuditPage = () => {
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
            Logs de Auditoria
          </h1>
          <div className="bg-slate-900/50 backdrop-blur-md border border-blue-900/40 rounded-lg shadow-lg overflow-hidden p-6"> {/* Added card styling */}
            <AuditLogs />
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default AuditPage;
