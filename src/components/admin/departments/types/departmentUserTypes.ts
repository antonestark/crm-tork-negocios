import { User } from "@/types/admin";

/**
 * Interface for department user data with required fields for department operations
 */
export interface DepartmentUser {
  id: string;
  name: string;
  email: string;
  department_id: number | null;
}

/**
 * Interface for a department member with role information
 */
export interface DepartmentMember {
  id: string;
  user_id: string;
  department_id: string;
  role: string;
  start_date?: string | null;
  end_date?: string | null;
  created_at: string;
  updated_at: string;
  user: Partial<User>;
}

/**
 * Interface for department data with its users
 */
export interface DepartmentWithUsers {
  department: any;
  users: DepartmentUser[];
}
