
// Add this section to fix null safety issues in use-demands.ts where it accesses possibly null properties
// Just including the parts that need to be fixed

// Add null safety checks for assigned_user and requester
const mapDemandData = (d: any) => ({
  id: d.id,
  title: d.title,
  description: d.description || '',
  area: d.area_name || 'General',
  area_id: d.area_id,
  priority: d.priority || 'medium',
  status: d.status || 'open',
  assigned_to: d.assigned_to || null,
  assigned_user_name: d.assigned_user ? d.assigned_user.name : 'Unassigned',
  requested_by: d.requested_by || null,
  requester_name: d.requester ? d.requester.name : 'Anonymous',
  due_date: d.due_date ? new Date(d.due_date) : null,
  created_at: d.created_at ? new Date(d.created_at) : new Date(),
  updated_at: d.updated_at ? new Date(d.updated_at) : new Date(),
});
