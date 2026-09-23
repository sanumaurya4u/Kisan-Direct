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
  estimated_distance_km?: number;
  estimated_duration_minutes?: number;
  status: 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  created_at: string;
  orders?: {
    total_amount: number;
    seller?: { full_name: string; phone?: string };
    buyer?: { full_name: string; phone?: string };
  };
}

export const DEFAULT_LOGISTICS_PARTNER_ID = 'a0000000-0000-0000-0000-000000000004';

export const DEFAULT_DEMO_VEHICLES: Vehicle[] = [
  {
    id: '55555555-0000-0000-0000-000000000001',
    owner_id: DEFAULT_LOGISTICS_PARTNER_ID,
    vehicle_number: 'HR-10-AJ-4491',
    vehicle_type: 'Tata 407 Reefer (Cold Storage)',
    capacity_kg: 4000,
    availability_status: 'busy',
    created_at: '2026-09-16T22:12:40.599Z',
  },
  {
    id: '55555555-0000-0000-0000-000000000002',
    owner_id: DEFAULT_LOGISTICS_PARTNER_ID,
    vehicle_number: 'DL-01-LB-8822',
    vehicle_type: 'Mahindra Bolero Maxi Truck Plus',
    capacity_kg: 1500,
    availability_status: 'available',
    created_at: '2026-09-16T22:12:40.599Z',
  },
  {
    id: '55555555-0000-0000-0000-000000000003',
    owner_id: DEFAULT_LOGISTICS_PARTNER_ID,
    vehicle_number: 'MH-15-EG-3012',
    vehicle_type: 'Eicher Pro 2049 Insulated',
    capacity_kg: 5000,
    availability_status: 'available',
    created_at: '2026-09-16T22:12:40.599Z',
  },
];

export const DEFAULT_DEMO_JOBS: Record<'pending' | 'my', LogisticsJob[]> = {
  pending: [
    {
      id: '66666666-0000-0000-0000-000000000002',
      order_id: '44444444-0000-0000-0000-000000000002',
      pickup_location: 'Patel Agro Hub, Nashik, Maharashtra',
      pickup_latitude: 19.9975,
      pickup_longitude: 73.7898,
      drop_location: 'FreshRetail Distribution Hub, Vashi, Navi Mumbai',
      drop_latitude: 19.076,
      drop_longitude: 72.8777,
      estimated_distance_km: 165,
      estimated_duration_minutes: 230,
      status: 'pending',
      created_at: '2026-09-16T22:12:40.599Z',
      orders: {
        total_amount: 16800,
        seller: { full_name: 'Ramesh Patel (Farmer)', phone: '+91 98220 12345' },
        buyer: { full_name: 'Arvind Sharma (FreshRetail Corp)', phone: '+91 98110 99887' }
      }
    }
  ],
  my: [
    {
      id: '66666666-0000-0000-0000-000000000001',
      order_id: '44444444-0000-0000-0000-000000000001',
      vehicle_id: '55555555-0000-0000-0000-000000000001',
      logistics_partner_id: DEFAULT_LOGISTICS_PARTNER_ID,
      pickup_location: 'Patel Farms, Sonipat Rural, Haryana',
      pickup_latitude: 28.9931,
      pickup_longitude: 77.0151,
      drop_location: 'FreshRetail Central Warehouse, Delhi NCR',
      drop_latitude: 28.7041,
      drop_longitude: 77.1025,
      estimated_distance_km: 48,
      estimated_duration_minutes: 80,
      status: 'in_transit',
      created_at: '2026-09-16T22:12:40.599Z',
      orders: {
        total_amount: 33200,
        seller: { full_name: 'Ramesh Patel (Farmer)', phone: '+91 98220 12345' },
        buyer: { full_name: 'Arvind Sharma (FreshRetail Corp)', phone: '+91 98110 99887' }
      }
    }
  ]
};

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
