
import { Json } from "@/integrations/supabase/types";

export type UserStatus = 'active' | 'inactive' | 'blocked' | 'pending';

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  profile_image_url: string | null;
  role: string;
  department_id: string | null;
  phone: string | null;
  active: boolean;
  status: UserStatus;
  last_login: string | null;
  settings: Json;
  metadata: Json;
  created_at: string;
  updated_at: string;
  department?: Department;
}

export interface Department {
  id: string;
  name: string;
  description: string | null;
  path: string;
  level: number;
  parent_id: string | null;
  manager_id: string | null;
  settings: Json;
  metadata: Json;
  created_at: string;
  updated_at: string;
  _memberCount?: number;
  manager?: { first_name: string; last_name: string; } | null;
  children?: Department[];
}

export interface Permission {
  id: string;
  code: string;
  name: string;
  description: string | null;
  module: string;
  resource_type: string;
  actions: string[];
  created_at: string;
  selected?: boolean;
}

export interface PermissionGroup {
  id: string;
  name: string;
  description: string | null;
  is_system: boolean;
  created_at: string;
  updated_at: string;
  selected?: boolean;
  permissions?: Permission[];
}

export interface UserPermission {
  id: string;
  user_id: string;
  permission_id: string;
  granted_by: string | null;
  valid_until: string | null;
  created_at: string;
  permission?: Permission;
}

export interface UserPermissionGroup {
  id: string;
  user_id: string;
  group_id: string;
  created_at: string;
  group?: PermissionGroup;
}

export interface UserDepartmentRole {
  id: string;
  user_id: string;
  department_id: string;
  role: string;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  department?: Department;
}

export interface ActivityLog {
  id: string;
  user_id: string | null;
  entity_type: string;
  entity_id: string | null;
  action: string;
  details: Json | null;
  ip_address: string | null;
  created_at: string;
  severity: string | null;
  category: string | null;
  metadata: Json | null;
  user?: { first_name: string; last_name: string; profile_image_url: string | null; };
}

export interface DepartmentMetrics {
  totalMembers: number;
  activeMembers: number;
  subDepartments: number;
  averageActivityLevel: number;
  recentChanges: number;
}

export interface DepartmentHierarchyNode extends Department {
  children: DepartmentHierarchyNode[];
  depth: number;
}

export type DepartmentRole = 'manager' | 'deputy' | 'member' | 'guest';
