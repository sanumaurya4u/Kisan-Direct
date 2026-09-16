import { supabase } from '../../lib/supabase';

export interface AdminMetrics {
  totalFarmers: number;
  totalFPOs: number;
  totalBuyers: number;
  totalLogistics: number;
  activeListings: number;
  totalOrders: number;
  gmv: number;
  totalJobs: number;
}

export const adminService = {
  async getMetrics(): Promise<AdminMetrics> {
    // We execute concurrent count queries.
    const [
      { count: farmers },
      { count: fpos },
      { count: buyers },
      { count: logistics },
      { count: listings },
      { count: orders },
      { data: orderData },
      { count: jobs }
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'farmer'),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'fpo'),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'bulk_buyer'),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'logistics_partner'),
      supabase.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('total_amount').neq('status', 'cancelled').neq('status', 'rejected'),
      supabase.from('logistics_jobs').select('*', { count: 'exact', head: true })
    ]);

    const gmv = orderData?.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0) || 0;

    return {
      totalFarmers: farmers || 0,
      totalFPOs: fpos || 0,
      totalBuyers: buyers || 0,
      totalLogistics: logistics || 0,
      activeListings: listings || 0,
      totalOrders: orders || 0,
      gmv,
      totalJobs: jobs || 0
    };
  }
};
