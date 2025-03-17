
// This file contains information about the SQL functions that exist in the database
// These functions are called from the hooks using supabase.rpc

/**
 * get_recent_services() - Returns recent services with status, area_id, title, etc.
 * 
 * Usage:
 * const { data, error } = await supabase.rpc('get_recent_services');
 */

/**
 * get_service_statistics() - Returns aggregated statistics about services
 * Returns: { completed: number, pending: number, delayed: number, avg_completion_time: number }
 * 
 * Usage:
 * const { data, error } = await supabase.rpc('get_service_statistics');
 */

/**
 * get_service_reports() - Returns service reports with related data
 * 
 * Usage:
 * const { data, error } = await supabase.rpc('get_service_reports');
 */

/**
 * get_service_stats_by_area() - Returns statistics for each service area
 * Returns array of: { area_id: string, total_tasks: number, pending_tasks: number, delayed_tasks: number }
 * 
 * Usage:
 * const { data, error } = await supabase.rpc('get_service_stats_by_area');
 */

/**
 * count_services_by_area() - Counts services for each area
 * Returns array of: { area_id: string, count: number }
 * 
 * Usage:
 * const { data, error } = await supabase.rpc('count_services_by_area');
 */

/**
 * get_user_permission_groups(user_id: string) - Returns permission groups for a user
 * Returns array of: { group_id: string }
 * 
 * Usage:
 * const { data, error } = await supabase.rpc('get_user_permission_groups', { user_id: 'user-uuid' });
 */

/**
 * get_group_permissions(group_id: string) - Returns permissions for a group
 * Returns array of permission IDs
 * 
 * Usage:
 * const { data, error } = await supabase.rpc('get_group_permissions', { group_id: 'group-uuid' });
 */

/**
 * save_user_permissions_and_groups(p_user_id: string, p_permission_ids: string[], p_group_ids: string[])
 * Updates user permissions and groups in a transaction
 * 
 * Usage:
 * const { data, error } = await supabase.rpc('save_user_permissions_and_groups', {
 *   p_user_id: 'user-uuid',
 *   p_permission_ids: ['perm1', 'perm2'],
 *   p_group_ids: ['group1', 'group2']
 * });
 */
