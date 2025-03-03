
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { AdminNav } from '@/components/admin/AdminNav';
import { PermissionsManager } from '@/components/admin/permissions/PermissionsManager';

const PermissionsPage = () => {
  useEffect(() => {
    document.title = "Gerenciamento de Permissões";
  }, []);

  return (
    <div className="container mx-auto py-6">
      <Helmet>
        <title>Gerenciamento de Permissões</title>
      </Helmet>
      <AdminNav />
      <div className="mt-6">
        <h1 className="text-2xl font-bold mb-6">Gerenciamento de Permissões</h1>
        <PermissionsManager />
      </div>
    </div>
  );
};

export default PermissionsPage;
