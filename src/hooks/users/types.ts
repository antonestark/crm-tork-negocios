
import { User } from "@/types/admin";

// Define the roles enum to match Supabase's expected values
export type UserRole = 'user' | 'admin' | 'super_admin';

// Define interface for user creation that includes email field
export interface UserCreate extends Partial<User> {
  email: string;  // Make email required for new users
  password?: string; // Optional password for new users
}

// Define the return type for the useUsers hook
export interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: Error | null;
  fetchUsers: () => Promise<void>;
  addUser: (userData: UserCreate) => Promise<boolean>;
  updateUser: (userData: User) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;
}
