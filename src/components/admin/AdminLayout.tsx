
import React from 'react';
import { Helmet } from 'react-helmet';
import { AdminNav } from '@/components/admin/AdminNav';
import { BaseLayout } from '@/components/layout/BaseLayout';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  return (
    <BaseLayout>
      <Helmet>
        <title>{title} | Admin</title>
      </Helmet>
      
      <div className="flex h-full py-6">
        {/* Admin Navigation */}
        <div className="w-64 mr-8 px-4">
          <AdminNav />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 px-4">
          {children}
        </div>
      </div>
    </BaseLayout>
  );
}
