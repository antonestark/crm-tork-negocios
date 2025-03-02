
// This file contains utility functions for working with Supabase data
import { Json } from './types';

// Function to safely extract email from Json object
export const extractEmail = (json: Json | null | undefined): string => {
  if (json === null || json === undefined) {
    return '';
  }
  
  if (typeof json === 'object' && json !== null && 'email' in json) {
    return (json as any).email as string;
  } 
  
  if (typeof json === 'string') {
    try {
      const parsed = JSON.parse(json);
      if (typeof parsed === 'object' && parsed !== null && 'email' in parsed) {
        return parsed.email as string;
      }
    } catch (e) {
      // Not valid JSON, return empty string
    }
  }
  
  return '';
};

// Function to safely extract user settings
export const extractUserSettings = (json: Json | null | undefined): Record<string, any> => {
  if (json === null || json === undefined) {
    return {};
  }
  
  if (typeof json === 'object' && json !== null) {
    return json as Record<string, any>;
  }
  
  if (typeof json === 'string') {
    try {
      const parsed = JSON.parse(json);
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed as Record<string, any>;
      }
    } catch (e) {
      // Not valid JSON, return empty object
    }
  }
  
  return {};
};

// Function to extract metadata
export const extractMetadata = (json: Json | null | undefined): Record<string, any> => {
  return extractUserSettings(json); // Uses the same logic as settings
};

// Function to check if a user has a specific permission
export const hasPermission = (
  userPermissions: string[], 
  requiredPermission: string
): boolean => {
  if (!userPermissions || userPermissions.length === 0) {
    return false;
  }
  
  // Check for wildcard permission
  if (userPermissions.includes('*')) {
    return true;
  }
  
  // Check for module wildcard (e.g., 'users:*')
  const [module, action] = requiredPermission.split(':');
  if (userPermissions.includes(`${module}:*`)) {
    return true;
  }
  
  // Check for specific permission
  return userPermissions.includes(requiredPermission);
};

// Function to format date with relative time for recent dates
export const formatDateWithRelative = (dateString: string | null): string => {
  if (!dateString) return 'Never';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays < 1) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      if (diffMinutes < 1) {
        return 'Just now';
      }
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    }
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays < 30) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  }
  
  // For older dates, return formatted date
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
