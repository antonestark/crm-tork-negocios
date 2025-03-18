
import { Client } from "@/types/clients";

/**
 * Helper function to create a proper Client object from database data
 * Handles field mapping between database structure and our application type
 */
export function formatClientFromDatabase(clientData: any): Client | null {
  if (!clientData || typeof clientData !== 'object' || 'error' in clientData) {
    return null;
  }

  return {
    id: clientData.id || '',
    company_name: clientData.company_name || '',
    trading_name: clientData.trading_name || '',
    responsible: clientData.responsible || '',
    room: clientData.room || '',
    meeting_room_credits: clientData.meeting_room_credits || 0,
    status: clientData.status || 'active',
    contract_start_date: clientData.contract_start_date || '',
    contract_end_date: clientData.contract_end_date || '',
    cnpj: clientData.cnpj || '',
    address: clientData.address || '',
    email: clientData.email || '',
    phone: clientData.phone || '',
    monthly_value: clientData.monthly_value || 0,
    notes: clientData.notes || '',
    created_at: clientData.created_at || '',
    updated_at: clientData.updated_at || ''
  };
}
