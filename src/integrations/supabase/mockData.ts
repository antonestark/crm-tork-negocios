
import { User, Permission, PermissionGroup, Department } from "@/types/admin";
import { Client } from "@/types/clients";

export const mockUserData = (): any[] => [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    department_id: 1,
    profile_image_url: null,
    phone: "+1234567890",
    active: true,
    status: "active",
    last_login: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    department: {
      id: 1,
      name: "Engineering"
    }
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "user",
    department_id: 2,
    profile_image_url: null,
    phone: "+1987654321",
    active: true,
    status: "active",
    last_login: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    department: {
      id: 2,
      name: "Marketing"
    }
  }
];

export const mockClients = (): any[] => [
  {
    id: "1",
    name: "Acme Corp",
    company_name: "Acme Corporation",
    trading_name: "Acme",
    responsible: "Wile E. Coyote",
    room: "A101",
    meeting_room_credits: 10,
    status: "active",
    contract_start_date: "2023-01-01",
    contract_end_date: "2024-01-01",
    cnpj: "12.345.678/0001-90",
    address: "123 Road Runner St",
    email: "contact@acme.com",
    phone: "+1234567890",
    monthly_value: 1000,
    notes: "Important client",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "2",
    name: "Globex",
    company_name: "Globex Corporation",
    trading_name: "Globex",
    responsible: "Hank Scorpio",
    room: "B202",
    meeting_room_credits: 5,
    status: "active",
    contract_start_date: "2023-02-01",
    contract_end_date: "2024-02-01",
    cnpj: "98.765.432/0001-10",
    address: "742 Evergreen Terrace",
    email: "contact@globex.com",
    phone: "+1987654321",
    monthly_value: 800,
    notes: "Regular client",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const mockPermissions = (): any[] => [
  {
    id: "1",
    name: "View Users",
    code: "users:view",
    description: "Can view all users in the system",
    module: "users",
    resource_type: "users",
    actions: ["view"],
    created_at: new Date().toISOString()
  },
  {
    id: "2",
    name: "Edit Users",
    code: "users:edit",
    description: "Can edit users in the system",
    module: "users",
    resource_type: "users",
    actions: ["edit"],
    created_at: new Date().toISOString()
  }
];

export const mockPermissionGroups = (): any[] => [
  {
    id: "1",
    name: "Administrators",
    description: "Full system access",
    is_system: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    permissions: mockPermissions()
  },
  {
    id: "2",
    name: "Managers",
    description: "Management access",
    is_system: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    permissions: [mockPermissions()[0]]
  }
];

export const mockActivityLogs = (): any[] => [
  {
    id: "1",
    user_id: "1",
    entity_type: "users",
    entity_id: "2",
    action: "create",
    details: { old: null, new: { name: "Jane Smith" } },
    ip_address: "192.168.1.1",
    severity: "info",
    category: "system",
    created_at: new Date().toISOString(),
    user: mockUserData()[0]
  },
  {
    id: "2",
    user_id: "1",
    entity_type: "clients",
    entity_id: "1",
    action: "update",
    details: { old: { status: "pending" }, new: { status: "active" } },
    ip_address: "192.168.1.1",
    severity: "info",
    category: "client",
    created_at: new Date().toISOString(),
    user: mockUserData()[0]
  }
];

export const mockUserDepartmentRoleData = (): any[] => [
  {
    user_id: "1",
    user_name: "John Doe",
    role: "manager",
    department_id: "1",
    department_name: "Engineering",
    joined_at: new Date().toISOString()
  },
  {
    user_id: "2",
    user_name: "Jane Smith",
    role: "member",
    department_id: "1",
    department_name: "Engineering",
    joined_at: new Date().toISOString()
  }
];

export const mockDepartmentTreeViewProps = {
  departments: [
    {
      id: "1",
      name: "Executive",
      description: "Executive team",
      path: "/",
      level: 0,
      parent_id: null,
      manager_id: "1",
      _memberCount: 3,
      manager: { first_name: "John", last_name: "CEO" },
      children: [
        {
          id: "2",
          name: "Engineering",
          description: "Engineering department",
          path: "/1/",
          level: 1,
          parent_id: "1",
          manager_id: "2",
          _memberCount: 10,
          manager: { first_name: "Jane", last_name: "CTO" },
          children: []
        },
        {
          id: "3",
          name: "Marketing",
          description: "Marketing department",
          path: "/1/",
          level: 1,
          parent_id: "1",
          manager_id: "3",
          _memberCount: 5,
          manager: { first_name: "Alice", last_name: "CMO" },
          children: []
        }
      ]
    }
  ]
};
