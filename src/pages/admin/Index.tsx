
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { AdminNav } from '@/components/admin/AdminNav';
import AdminDashboard from '@/components/admin/AdminDashboard';

const AdminIndexPage = () => {
  useEffect(() => {
    document.title = "Admin Dashboard";
  }, []);

  return (
    <div className="container mx-auto py-6">
      <Helmet>
        <title>Admin Dashboard</title>
      </Helmet>
      <AdminNav />
      <div className="mt-6">
        <AdminDashboard />
      </div>
    </div>
  );
};

export default AdminIndexPage;
