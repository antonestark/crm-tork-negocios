
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
