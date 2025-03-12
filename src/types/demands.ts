
export interface Demand {
  id: string;
  title: string;
  description?: string;
  area_id?: string;
  priority?: string;
  assigned_to?: string;
  requested_by?: string;
  due_date?: string;
  status?: string;
  created_at: string;
  updated_at: string;
  area?: { name: string } | null;
  assigned_user?: { name: string } | null;
  requester?: { name: string } | null;
}

export interface DemandCreate {
  id?: string;
  title: string;
  description?: string;
  area_id?: string;
  priority?: string;
  assigned_to?: string;
  requested_by?: string;
  due_date?: string | Date | null;
  status?: string;
}
