
import { supabase } from "@/integrations/supabase/client";

export async function fetchServices() {
  try {
    const { data, error } = await supabase
      .from("services")
      .select(`
        *,
        service_areas(name)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
}

export async function fetchServiceAreas() {
  try {
    const { data, error } = await supabase
      .from("service_areas")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching service areas:", error);
    throw error;
  }
}

export async function createService(serviceData: any) {
  try {
    const { data, error } = await supabase
      .from("services")
      .insert([serviceData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating service:", error);
    throw error;
  }
}

export async function updateService(id: string, serviceData: any) {
  try {
    const { data, error } = await supabase
      .from("services")
      .update(serviceData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error updating service with id ${id}:`, error);
    throw error;
  }
}

export async function deleteService(id: string) {
  try {
    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error deleting service with id ${id}:`, error);
    throw error;
  }
}
