import { supabase } from '../../lib/supabase';
import { type Listing } from '../listings/listingsService';
import { type BuyerRequirement } from '../buyer/buyerService';

export interface Match {
  id: string;
  requirement_id: string;
  listing_id: string;
  match_score: number;
  product_score: number;
  quantity_score: number;
  distance_score: number;
  price_score: number;
  availability_score: number;
  explanation: { reasons: string[] };
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  created_at: string;
  listings?: Listing & { profiles: { full_name: string; role: string } };
  buyer_requirements?: BuyerRequirement;
}

export const matchingService = {
  async getMatchesForRequirement(requirementId: string) {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        listings (*, products(name, unit), profiles(full_name, role)),
        buyer_requirements (*)
      `)
      .eq('requirement_id', requirementId)
      .order('match_score', { ascending: false });

    if (error) throw error;
    return data as Match[];
  },

  async saveMatches(matches: Partial<Match>[]) {
    const { data, error } = await supabase
      .from('matches')
      .upsert(matches, { onConflict: 'requirement_id,listing_id' })
      .select();
      
    if (error) throw error;
    return data;
  },
  
  async updateMatchStatus(matchId: string, status: Match['status']) {
    const { data, error } = await supabase
      .from('matches')
      .update({ status })
      .eq('id', matchId)
      .select()
      .single();
      
    if (error) throw error;
    return data as Match;
  }
};
