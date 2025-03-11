
import { Department, User, UserStatus } from "@/types/admin";
import { Client } from "@/types/clients";

export const mockUserData = (): User[] => {
  return [
    {
      id: '1',
      first_name: 'João',
      last_name: 'Silva',
      profile_image_url: null,
      role: 'admin',
      department_id: '1',
      phone: '(11) 99999-9999',
      active: true,
      status: 'active' as UserStatus,
      last_login: new Date().toISOString(),
      settings: {},
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      department: {
        id: '1',
        name: 'Marketing',
        description: 'Departamento de Marketing',
        path: 'marketing',
        level: 1,
        parent_id: null,
        manager_id: null,
        settings: {},
        metadata: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    },
    {
      id: '2',
      first_name: 'Maria',
      last_name: 'Oliveira',
      profile_image_url: null,
      role: 'user',
      department_id: '2',
      phone: '(11) 88888-8888',
      active: true,
      status: 'active' as UserStatus,
      last_login: new Date().toISOString(),
      settings: {},
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      department: {
        id: '2',
        name: 'Engenharia',
        description: 'Departamento de Engenharia',
        path: 'engineering',
        level: 1,
        parent_id: null,
        manager_id: null,
        settings: {},
        metadata: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }
  ];
};

export const mockClients = (): Client[] => {
  return [
    {
      id: "c1",
      company_name: "Empresa XPTO",
      trading_name: "XPTO Ltda",
      responsible: "João Silva",
      room: "A101",
      meeting_room_credits: 10,
      status: "active",
      contract_start_date: "2023-01-01",
      contract_end_date: "2024-01-01",
      cnpj: "12.345.678/0001-99",
      address: "Rua Principal, 123",
      email: "contato@xpto.com",
      phone: "(11) 3456-7890",
      monthly_value: 1500,
      notes: "Cliente desde 2023",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "c2",
      company_name: "Tech Solutions",
      trading_name: "Tech Solutions SA",
      responsible: "Maria Oliveira",
      room: "B202",
      meeting_room_credits: 5,
      status: "active",
      contract_start_date: "2023-02-15",
      contract_end_date: "2024-02-15",
      cnpj: "98.765.432/0001-01",
      address: "Av. Secundária, 456",
      email: "contato@techsolutions.com",
      phone: "(11) 2345-6789",
      monthly_value: 2000,
      notes: "Contrato renovado recentemente",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
};
