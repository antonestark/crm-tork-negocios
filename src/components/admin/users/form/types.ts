
export interface UserFormFields {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  department_id: number | null;
  active: boolean;
  status: string;
  password?: string;
}
