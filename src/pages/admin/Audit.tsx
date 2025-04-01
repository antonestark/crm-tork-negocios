
import React from 'react';
import { AuditLogs } from '@/components/admin/audit/AuditLogs';
import { AdminLayout } from '@/components/admin/AdminLayout';

const AuditPage = () => {
  return (
    <AdminLayout title="Logs de Auditoria">
      <h1 className="text-3xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] pb-1">
        Logs de Auditoria
      </h1>
      <div className="bg-slate-900/50 backdrop-blur-md border border-blue-900/40 rounded-lg shadow-lg overflow-hidden p-6">
        <AuditLogs />
      </div>
    </AdminLayout>
  );
};

export default AuditPage;
