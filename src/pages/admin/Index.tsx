
import React from 'react';
import { Helmet } from 'react-helmet';
import { AdminNav } from '@/components/admin/AdminNav';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export default function AdminIndex() {
  return (
    <div className="container mx-auto p-4">
      <Helmet>
        <title>Admin Dashboard</title>
      </Helmet>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <AdminNav />
      <div className="mt-6">
        <AdminDashboard />
      </div>
    </div>
  );
}
