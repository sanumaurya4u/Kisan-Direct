import { supabase } from '../../lib/supabase';
import { type BuyerRequirement } from '../buyer/buyerService';
import { type Listing } from '../listings/listingsService';
import { matchingService } from './matchingService';

export const matchEngine = {
  async runMatchingForRequirement(requirement: BuyerRequirement) {
    // 1. Fetch all active listings for the required product
    const { data: listingsData, error } = await supabase
      .from('listings')
      .select('*, products(name, unit)')
      .eq('product_id', requirement.product_id)
      .eq('status', 'active');

    if (error) throw error;
    
    const listings = listingsData as Listing[];
    const matchesToSave = [];

    // 2. Score each listing
    for (const listing of listings) {
      let product_score = 100; // already filtered by product_id
      
      // Quantity Score
      let quantity_score = 0;
      if (listing.available_quantity >= requirement.remaining_quantity) {
        quantity_score = 100;
      } else {
        quantity_score = Math.round((listing.available_quantity / requirement.remaining_quantity) * 100);
      }

      // Price Score
      let price_score = 100;
      if (requirement.target_price_per_unit) {
        if (listing.price_per_unit <= requirement.target_price_per_unit) {
          price_score = 100;
        } else {
          // Penalize higher prices (drop to 0 if double the target)
          const diff = listing.price_per_unit - requirement.target_price_per_unit;
          const penalty = (diff / requirement.target_price_per_unit) * 100;
          price_score = Math.max(0, 100 - penalty);
        }
      }

      // Distance Score (simplified string matching for hackathon, since lat/long might not be present)
      let distance_score = 50; 
      if (listing.location_name.toLowerCase().includes(requirement.target_location.toLowerCase()) || 
          requirement.target_location.toLowerCase().includes(listing.location_name.toLowerCase())) {
        distance_score = 100;
      }

      const availability_score = 100; // simplified

      // Calculate total weighted score (Price and Quantity most important)
      const match_score = Math.round((product_score * 0.2) + (quantity_score * 0.3) + (price_score * 0.3) + (distance_score * 0.2));

      // Build explanation
      const reasons = ["✓ Product matches exactly"];
      if (quantity_score === 100) reasons.push("✓ Full quantity available");
      else reasons.push(`- Partial quantity available (${listing.available_quantity})`);
      
      if (price_score === 100) reasons.push("✓ Price is within target");
      else reasons.push("- Price exceeds target");

      if (distance_score === 100) reasons.push("✓ Location matches target");

      // Only save reasonably good matches (e.g. score > 40)
      if (match_score > 40) {
        matchesToSave.push({
          requirement_id: requirement.id,
          listing_id: listing.id,
          match_score,
          product_score,
          quantity_score,
          distance_score,
          price_score,
          availability_score,
          explanation: { reasons },
          status: 'pending' as const
        });
      }
    }

    if (matchesToSave.length > 0) {
      // NOTE: Our matches table doesn't have a unique constraint on requirement_id+listing_id natively right now
      // Since upsert might fail without a unique constraint, we will just insert.
      // Wait, in a real scenario we need a unique constraint. For this phase, we'll delete old pending matches and insert new ones.
      await supabase
        .from('matches')
        .delete()
        .eq('requirement_id', requirement.id)
        .eq('status', 'pending');

      await matchingService.saveMatches(matchesToSave);
    }
    
    return matchesToSave.length;
  }
};
