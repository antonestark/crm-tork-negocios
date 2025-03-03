
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { AdminNav } from '@/components/admin/AdminNav';
import { AuditLogs } from '@/components/admin/audit/AuditLogs';

const AuditPage = () => {
  useEffect(() => {
    document.title = "Logs de Auditoria";
  }, []);

  return (
    <div className="container mx-auto py-6">
      <Helmet>
        <title>Logs de Auditoria</title>
      </Helmet>
      <AdminNav />
      <div className="mt-6">
        <h1 className="text-2xl font-bold mb-6">Logs de Auditoria</h1>
        <AuditLogs />
      </div>
    </div>
  );
};

export default AuditPage;
