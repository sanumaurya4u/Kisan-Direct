import { supabase } from '../../lib/supabase';
import { type Listing } from '../listings/listingsService';

export const marketplaceService = {
  async getActiveListings(filters?: { product_id?: string; location?: string; category_id?: string }) {
    let query = supabase
      .from('listings')
      .select('*, products(name, unit, category_id, product_categories(id, name)), profiles(full_name, role)')
      .eq('status', 'active');

    if (filters?.product_id) {
      query = query.eq('product_id', filters.product_id);
    }
    if (filters?.location) {
      query = query.ilike('location_name', `%${filters.location}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as (Listing & {
      profiles: { full_name: string; role: string };
      products: { name: string; unit: string; category_id: string; product_categories?: { id: string; name: string } };
    })[];
  }
};
