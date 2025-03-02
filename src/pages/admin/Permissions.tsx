
import { useEffect } from 'react';
import { AdminNav } from '@/components/admin/AdminNav';
import { Helmet } from 'react-helmet';

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
        <h1 className="text-2xl font-bold">Permissions Management</h1>
        <p className="mt-2 text-gray-600">
          This feature is coming soon. Stay tuned for updates.
        </p>
      </div>
    </div>
  );
};

export default PermissionsPage;
