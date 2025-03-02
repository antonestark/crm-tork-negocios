
import { useEffect } from 'react';
import AdminNav from '@/components/admin/AdminNav';
import UsersTable from '@/components/admin/users/UsersTable';
import { Helmet } from 'react-helmet';

const UsersPage = () => {
  useEffect(() => {
    document.title = "Users | Admin";
  }, []);

  return (
    <div className="container mx-auto py-6">
      <Helmet>
        <title>Users | Admin</title>
      </Helmet>
      <AdminNav />
      <div className="mt-6">
        <UsersTable />
      </div>
    </div>
  );
};

export default UsersPage;
