
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { AdminNav } from '@/components/admin/AdminNav';
import { DepartmentsView } from '@/components/admin/departments/DepartmentsView';

const DepartmentsPage = () => {
  useEffect(() => {
    document.title = "Departments | Admin";
  }, []);

  return (
    <div className="container mx-auto py-6">
      <Helmet>
        <title>Departments | Admin</title>
      </Helmet>
      <AdminNav />
      <div className="mt-6">
        <DepartmentsView />
      </div>
    </div>
  );
};

export default DepartmentsPage;
