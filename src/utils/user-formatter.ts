
import { User } from "@/types/admin";

/**
 * Helper function to create a proper User object from database data
 * Handles field mapping between database structure and our application type
 */
export function formatUserFromDatabase(userData: any): User | null {
  if (!userData || typeof userData !== 'object' || 'error' in userData) {
    return null;
  }

  // Extract first and last name from the name field
  const nameParts = userData.name ? userData.name.split(' ') : ['', ''];
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  return {
    id: userData.id || '',
    first_name: firstName,
    last_name: lastName,
    profile_image_url: userData.profile_image_url || null,
    role: userData.role || 'user',
    department_id: userData.department_id || null,
    phone: userData.phone || null,
    email: userData.email || '',
    active: userData.active !== false, // Default to true if not explicitly false
    status: userData.status || 'active',
    last_login: userData.last_login || null,
    settings: userData.settings || {},
    metadata: userData.metadata || {},
    created_at: userData.created_at || '',
    updated_at: userData.updated_at || '',
  };
}
