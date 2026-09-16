import { supabase } from '../../lib/supabase';

export interface BuyerRequirement {
  id: string;
  buyer_id: string;
  product_id: string;
  required_quantity: number;
  remaining_quantity: number;
  target_price_per_unit?: number;
  target_location: string;
  required_by: string;
  status: 'open' | 'partially_fulfilled' | 'fulfilled' | 'cancelled' | 'expired';
  created_at: string;
  products?: {
    name: string;
    unit: string;
  };
}

export const buyerService = {
  async getMyRequirements(buyerId: string) {
    const { data, error } = await supabase
      .from('buyer_requirements')
      .select('*, products(name, unit)')
      .eq('buyer_id', buyerId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as BuyerRequirement[];
  },

  async getRequirementById(id: string) {
    const { data, error } = await supabase
      .from('buyer_requirements')
      .select('*, products(name, unit)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as BuyerRequirement;
  },

  async createRequirement(reqData: Partial<BuyerRequirement>) {
    const { data, error } = await supabase
      .from('buyer_requirements')
      .insert(reqData)
      .select()
      .single();
    if (error) throw error;
    return data as BuyerRequirement;
  },

  async updateRequirement(id: string, reqData: Partial<BuyerRequirement>) {
    const { data, error } = await supabase
      .from('buyer_requirements')
      .update(reqData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as BuyerRequirement;
  }
};
