export interface Visitor {
  id: string;
  name: string;
  document?: string | null;
  client_id: string;
  visit_time: string; // Using string for simplicity, can be Date if needed
  notes?: string | null;
  created_at: string;
  // Add related client data fetched via join
  clients?: { company_name: string } | null; 
}
