import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { matchingService, type Match } from '../../features/matching/matchingService';
import { buyerService, type BuyerRequirement } from '../../features/buyer/buyerService';
import { useAuth } from '../../features/auth/AuthContext';
import { ordersService } from '../../features/orders/ordersService';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, MapPin } from 'lucide-react';
import { PriceBreakdown } from '../../components/ui/PriceBreakdown';

export function MatchesView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [requirement, setRequirement] = useState<BuyerRequirement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orderingId, setOrderingId] = useState<string | null>(null);

  const handleInitiateOrder = async (match: Match) => {
    if (!profile || !requirement) return;
    const listing = match.listings;
    if (!listing) return;
    
    setOrderingId(match.id);
    try {
      await ordersService.createOrderFromListing(
        listing, 
        profile.id, 
        requirement.required_quantity, // order full required amount
        requirement.target_location, // use target as delivery addr
        requirement.id
      );
      
      // Update match status to accepted (or could be 'ordered')
      await matchingService.updateMatchStatus(match.id, 'accepted');
      navigate('/buyer/orders');
    } catch (err: any) {
      alert(err.message || "Failed to initiate order.");
    } finally {
      setOrderingId(null);
    }
  };

  useEffect(() => {
    if (id) {
      Promise.all([
        buyerService.getRequirementById(id),
        matchingService.getMatchesForRequirement(id)
      ])
      .then(([req, matchData]) => {
        setRequirement(req);
        setMatches(matchData);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
    }
  }, [id]);

  if (isLoading) return <div className="p-8 text-center">Loading matches...</div>;
  if (!requirement) return <div className="p-8 text-center">Requirement not found.</div>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6 flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/buyer/dashboard')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <h1 className="text-2xl font-bold">Suggested Matches</h1>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-8 border border-gray-200">
        <h2 className="font-semibold text-gray-700 mb-2">Requirement Details</h2>
        <div className="flex flex-wrap gap-4 text-sm">
          <div><strong>Product:</strong> {requirement.products?.name}</div>
          <div><strong>Needed:</strong> {requirement.required_quantity} {requirement.products?.unit}</div>
          <div><strong>Target Price:</strong> {requirement.target_price_per_unit ? `₹${requirement.target_price_per_unit}` : 'Any'}</div>
          <div><strong>Location:</strong> {requirement.target_location}</div>
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
          No suitable matches found for this requirement yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {matches.map(match => {
            const listing = match.listings;
            if (!listing) return null;

            return (
              <Card key={match.id} className="overflow-hidden">
                <CardContent className="p-0 flex flex-col sm:flex-row">
                  {listing.image_url ? (
                    <img src={listing.image_url} alt={listing.products?.name} className="w-full sm:w-48 h-48 object-cover" />
                  ) : (
                    <div className="w-full sm:w-48 h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg">{listing.products?.name}</h3>
                        <p className="text-sm text-gray-500">by {listing.profiles?.full_name}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-primary">{match.match_score}%</div>
                        <span className="text-xs text-gray-500">Match Score</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm mt-2 mb-4">
                      <div><strong>Price:</strong> ₹{listing.price_per_unit}/{listing.products?.unit}</div>
                      <div><strong>Available:</strong> {listing.available_quantity} {listing.products?.unit}</div>
                      <div className="col-span-2 flex items-center text-gray-600">
                        <MapPin className="w-3 h-3 mr-1" /> {listing.location_name}
                      </div>
                    </div>

                    <div className="mt-auto">
                      <div className="text-xs space-y-1 mb-4 text-gray-600">
                        {match.explanation.reasons.map((reason, i) => (
                          <div key={i} className={reason.startsWith('✓') ? 'text-green-700 font-medium' : ''}>
                            {reason}
                          </div>
                        ))}
                      </div>
                      
                      {requirement && match.listings && (
                        <div className="mb-4">
                          <PriceBreakdown 
                            {...ordersService.calculatePriceBreakdown(match.listings.price_per_unit, requirement.required_quantity)}
                          />
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button 
                          className="w-full" 
                          onClick={() => handleInitiateOrder(match)}
                          disabled={orderingId === match.id}
                        >
                          {orderingId === match.id ? 'Processing...' : 'Initiate Order'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
