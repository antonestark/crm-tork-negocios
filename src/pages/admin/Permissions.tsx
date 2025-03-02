
import { useEffect } from 'react';
import AdminNav from '@/components/admin/AdminNav';
import { Helmet } from 'react-helmet';

const PermissionsManager = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Permissions Management</h1>
      <p className="text-gray-500 mb-8">
        Manage system permissions and access control groups.
      </p>
      
      {/* Este componente será implementado em seguida */}
      <div className="text-center py-12 border rounded-md bg-gray-50">
        <p className="text-gray-500">Permissions management will be implemented soon.</p>
      </div>
    </div>
  );
};

const PermissionsPage = () => {
  useEffect(() => {
    document.title = "Permissions | Admin";
  }, []);

  return (
    <div className="container mx-auto py-6">
      <Helmet>
        <title>Permissions | Admin</title>
      </Helmet>
      <AdminNav />
      <div className="mt-6">
        <PermissionsManager />
      </div>
    </div>
  );
};

export default PermissionsPage;
