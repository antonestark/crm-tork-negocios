
import { useEffect } from 'react';
import { AdminNav } from '@/components/admin/AdminNav';
import AuditLogs from '@/components/admin/audit/AuditLogs';
import { Helmet } from 'react-helmet';

const AuditPage = () => {
  useEffect(() => {
    document.title = "Audit Logs | Admin";
  }, []);

  return (
    <div className="container mx-auto py-6">
      <Helmet>
        <title>Audit Logs | Admin</title>
      </Helmet>
      <AdminNav />
      <div className="mt-6">
        <AuditLogs />
      </div>
    </div>
  );
};

export default AuditPage;
