import { supabase } from '../../lib/supabase';
import { type Listing } from '../listings/listingsService';

export const marketplaceService = {
  async getActiveListings(filters?: { product_id?: string; location?: string }) {
    let query = supabase
      .from('listings')
      .select('*, products(name, unit), profiles(full_name, role)')
      .eq('status', 'active');

    if (filters?.product_id) {
      query = query.eq('product_id', filters.product_id);
    }
    if (filters?.location) {
      query = query.ilike('location_name', `%${filters.location}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    // Map the returned object to the Listing interface (profiles is joined)
    return data as (Listing & { profiles: { full_name: string; role: string } })[];
  }
};
