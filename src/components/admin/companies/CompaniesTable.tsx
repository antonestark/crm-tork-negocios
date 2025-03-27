
import React, { useState } from 'react';
import { useCompanies } from '@/hooks/use-companies';
import { Company } from '@/types/companies';
import { DataTable } from '@/components/admin/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, Key, Eye } from 'lucide-react';
import { CompanyFormDialog } from './CompanyFormDialog';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';

interface CompaniesTableProps {
  filters: {
    status: string;
    search: string;
  };
}

export const CompaniesTable: React.FC<CompaniesTableProps> = ({ filters }) => {
  const { companies, loading, addCompany, updateCompany, deleteCompany } = useCompanies();
  const [openCompanyFormDialog, setOpenCompanyFormDialog] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  // Apply filters
  const filteredCompanies = companies.filter(company => {
    // Filter by status
    if (filters.status !== 'all' && company.status !== filters.status) {
      return false;
    }
    
    // Filter by search
    if (filters.search && !company.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const handleOpenNewCompanyDialog = () => {
    setSelectedCompany(null);
    setOpenCompanyFormDialog(true);
  };

  const handleEditCompany = (company: Company) => {
    setSelectedCompany(company);
    setOpenCompanyFormDialog(true);
  };

  const handleDeleteCompany = async (companyId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta empresa?')) {
      const success = await deleteCompany(companyId);
      if (success) {
        toast.success('Empresa excluída com sucesso');
      }
    }
  };

  const handleSaveCompany = async (companyData: Partial<Company>) => {
    if (selectedCompany) {
      // Update existing company
      const success = await updateCompany({
        ...selectedCompany,
        ...companyData,
      });
      if (success) {
        toast.success('Empresa atualizada com sucesso');
        setOpenCompanyFormDialog(false);
      }
    } else {
      // Add new company
      const success = await addCompany(companyData as Company);
      if (success) {
        toast.success('Empresa adicionada com sucesso');
        setOpenCompanyFormDialog(false);
      }
    }
  };

  const handleToggleAPIAccess = async (company: Company) => {
    const updatedStatus = company.status === 'active' ? 'inactive' : 'active';
    const success = await updateCompany({
      ...company,
      status: updatedStatus
    });
    
    if (success) {
      toast.success(`Acesso ${updatedStatus === 'active' ? 'ativado' : 'desativado'} com sucesso`);
    }
  };

  const columns = [
    {
      key: 'name',
      title: 'Nome',
      render: (company: Company) => (
        <div className="flex flex-col">
          <span className="font-medium">{company.name}</span>
          <span className="text-xs text-muted-foreground">{company.contact_email}</span>
        </div>
      ),
    },
    {
      key: 'users',
      title: 'Limite de Usuários',
      render: (company: Company) => (
        <span>{company.settings?.user_limit || "10"}</span>
      ),
    },
    {
      key: 'connections',
      title: 'Limite de Conexões',
      render: (company: Company) => (
        <span>{company.settings?.connection_limit || "10"}</span>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (company: Company) => (
        <Badge variant={company.status === 'active' ? 'success' : 'destructive'}>
          {company.status === 'active' ? 'Ativo' : 'Inativo'}
        </Badge>
      ),
    },
    {
      key: 'token',
      title: 'Token',
      render: (company: Company) => (
        <span className="text-xs font-mono">
          {company.settings?.api_token ? 
            `${company.settings.api_token.substring(0, 15)}...` : 
            'Não definido'}
        </span>
      ),
    },
    {
      key: 'created_at',
      title: 'Data',
      render: (company: Company) => (
        <span>{formatDate(company.created_at)}</span>
      ),
    },
    {
      key: 'actions',
      title: 'Ações',
      render: (company: Company) => (
        <div className="flex space-x-2">
          <Button
            onClick={() => handleEditCompany(company)}
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Editar</span>
          </Button>
          <Button
            onClick={() => handleToggleAPIAccess(company)}
            variant={company.status === 'active' ? 'destructive' : 'outline'}
            size="sm"
            className="h-8 w-8 p-0"
          >
            <Key className="h-4 w-4" />
            <span className="sr-only">
              {company.status === 'active' ? 'Desativar' : 'Ativar'} Acesso
            </span>
          </Button>
          <Button
            onClick={() => handleDeleteCompany(company.id)}
            variant="destructive"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Excluir</span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Empresas</h2>
        <Button onClick={handleOpenNewCompanyDialog}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Nova Empresa
        </Button>
      </div>

      <DataTable
        data={filteredCompanies}
        columns={columns}
        loading={loading}
        noDataMessage="Nenhuma empresa encontrada"
      />

      <CompanyFormDialog
        open={openCompanyFormDialog}
        onOpenChange={setOpenCompanyFormDialog}
        company={selectedCompany}
        onSave={handleSaveCompany}
      />
    </div>
  );
};

export default CompaniesTable;
