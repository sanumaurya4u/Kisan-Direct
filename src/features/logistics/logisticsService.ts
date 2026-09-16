import { supabase } from '../../lib/supabase';

export interface Vehicle {
  id: string;
  owner_id: string;
  vehicle_number: string;
  vehicle_type: string;
  capacity_kg: number;
  availability_status: 'available' | 'busy' | 'maintenance';
  created_at: string;
}

export interface LogisticsJob {
  id: string;
  order_id: string;
  vehicle_id?: string;
  logistics_partner_id?: string;
  pickup_location: string;
  pickup_latitude?: number;
  pickup_longitude?: number;
  drop_location: string;
  drop_latitude?: number;
  drop_longitude?: number;
  status: 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  created_at: string;
  orders?: {
    total_amount: number;
    seller?: { full_name: string; phone?: string };
    buyer?: { full_name: string; phone?: string };
  };
}

export const logisticsService = {
  async getMyVehicles(ownerId: string) {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Vehicle[];
  },

  async addVehicle(vehicle: Partial<Vehicle>) {
    const { data, error } = await supabase
      .from('vehicles')
      .insert(vehicle)
      .select()
      .single();
    if (error) throw error;
    return data as Vehicle;
  },

  async getPendingJobs() {
    const { data, error } = await supabase
      .from('logistics_jobs')
      .select(`
        *,
        orders (
          total_amount,
          seller:profiles!orders_seller_id_fkey(full_name, phone),
          buyer:profiles!orders_buyer_id_fkey(full_name, phone)
        )
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as LogisticsJob[];
  },

  async getMyJobs(partnerId: string) {
    const { data, error } = await supabase
      .from('logistics_jobs')
      .select(`
        *,
        orders (
          total_amount,
          seller:profiles!orders_seller_id_fkey(full_name, phone),
          buyer:profiles!orders_buyer_id_fkey(full_name, phone)
        )
      `)
      .eq('logistics_partner_id', partnerId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as LogisticsJob[];
  },

  async acceptJob(jobId: string, partnerId: string, vehicleId: string) {
    const { data, error } = await supabase
      .from('logistics_jobs')
      .update({
        logistics_partner_id: partnerId,
        vehicle_id: vehicleId,
        status: 'assigned'
      })
      .eq('id', jobId)
      .eq('status', 'pending')
      .select()
      .single();
    if (error) throw error;
    
    // Set vehicle to busy
    await supabase.from('vehicles').update({ availability_status: 'busy' }).eq('id', vehicleId);
    
    return data;
  },

  async updateJobStatus(jobId: string, status: LogisticsJob['status'], vehicleId?: string) {
    const { error } = await supabase
      .from('logistics_jobs')
      .update({ status })
      .eq('id', jobId);
    if (error) throw error;

    if (status === 'delivered' || status === 'cancelled') {
      // Free up vehicle
      if (vehicleId) {
        await supabase.from('vehicles').update({ availability_status: 'available' }).eq('id', vehicleId);
      }
    }
  }
};
