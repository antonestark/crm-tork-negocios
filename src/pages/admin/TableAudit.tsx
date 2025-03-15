
import React from 'react';
import { TableAuditManager } from '@/components/admin/TableAuditManager';
import { AdminNav } from '@/components/admin/AdminNav';
import { AuthHeader } from '@/components/layout/AuthHeader';
import { Helmet } from 'react-helmet';

export default function TableAudit() {
  return (
    <>
      <Helmet>
        <title>Auditoria de Tabelas | Admin</title>
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <AuthHeader />
        
        <div className="container mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
          <AdminNav />
          
          <main className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <TableAuditManager />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
