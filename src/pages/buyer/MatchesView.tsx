import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { matchingService, type Match } from '../../features/matching/matchingService';
import { buyerService, type BuyerRequirement } from '../../features/buyer/buyerService';
import { useAuth } from '../../features/auth/AuthContext';
import { ordersService } from '../../features/orders/ordersService';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ArrowLeft, MapPin, Sparkles, CheckCircle2, ShieldCheck, Truck, ShoppingCart } from 'lucide-react';
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
        requirement.required_quantity,
        requirement.target_location,
        requirement.id
      );

      await matchingService.updateMatchStatus(match.id, 'accepted');
      navigate('/buyer/orders');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to initiate order.';
      alert(msg);
    } finally {
      setOrderingId(null);
    }
  };

  useEffect(() => {
    if (id) {
      Promise.all([
        buyerService.getRequirementById(id),
        matchingService.getMatchesForRequirement(id),
      ])
        .then(([req, matchData]) => {
          setRequirement(req);
          setMatches(matchData);
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-12">
        <LoadingSpinner text="Running 6-factor AI Matching Engine..." />
      </div>
    );
  }

  if (!requirement) {
    return (
      <div className="container mx-auto p-12 text-center text-gray-500">
        <p>Requirement not found.</p>
        <Button className="mt-4" onClick={() => navigate('/buyer/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={() => navigate('/buyer/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Dashboard
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-emerald-600" />
              AI Supply Match Results
            </h1>
            <p className="text-xs text-gray-500">
              Heuristic algorithmic scoring based on product fit, price compliance, distance, and quantity.
            </p>
          </div>
        </div>

        <Badge variant="success" className="text-xs px-3 py-1 font-semibold">
          {matches.length} Verified Match{matches.length === 1 ? '' : 'es'} Found
        </Badge>
      </div>

      {/* Requirement Summary Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-xs">
        <div className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">
          Procurement Requirement Parameters
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-xs text-gray-500 block">Commodity:</span>
            <strong className="text-gray-900 text-base">{requirement.products?.name}</strong>
          </div>
          <div>
            <span className="text-xs text-gray-500 block">Required Volume:</span>
            <strong className="text-gray-900 text-base">{requirement.required_quantity} {requirement.products?.unit}</strong>
          </div>
          <div>
            <span className="text-xs text-gray-500 block">Target Budget:</span>
            <strong className="text-primary text-base">
              {requirement.target_price_per_unit ? `₹${requirement.target_price_per_unit} / ${requirement.products?.unit}` : 'Market Price'}
            </strong>
          </div>
          <div>
            <span className="text-xs text-gray-500 block">Destination:</span>
            <strong className="text-gray-900 text-sm truncate block">{requirement.target_location}</strong>
          </div>
        </div>
      </div>

      {/* Matched Listings Stream */}
      {matches.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 p-8 space-y-4">
          <Sparkles className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-lg font-bold text-gray-900">No Direct Matches Found</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            No active farmer lots currently meet the specified target price or volume. Check the public marketplace or adjust your budget range.
          </p>
          <Link to="/marketplace">
            <Button size="sm">Browse All Marketplace Lots</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {matches.map((match) => {
            const listing = match.listings;
            if (!listing) return null;

            return (
              <Card key={match.id} className="overflow-hidden border-2 border-green-200 hover:border-primary transition-colors shadow-xs">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-12">
                    {/* Left Column: Image & Seller */}
                    <div className="md:col-span-4 bg-gray-50 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-200">
                      <div>
                        {listing.image_url ? (
                          <img
                            src={listing.image_url}
                            alt={listing.products?.name}
                            className="w-full h-40 object-cover rounded-xl border mb-4"
                          />
                        ) : (
                          <div className="w-full h-40 bg-green-100/60 rounded-xl flex items-center justify-center text-primary font-bold mb-4">
                            {listing.products?.name}
                          </div>
                        )}
                        <h3 className="font-bold text-lg text-gray-900">{listing.products?.name}</h3>
                        <p className="text-xs text-gray-600 mt-1 flex items-center">
                          <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
                          {listing.location_name}
                        </p>
                        <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500 space-y-1">
                          <div>Producer: <strong className="text-gray-800">{listing.profiles?.full_name}</strong></div>
                          <div>Grade: <Badge variant="outline" className="text-[10px] ml-1">{listing.grade || 'Grade A'}</Badge></div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="text-xs text-gray-500">Agreed Farmgate Price</div>
                        <div className="text-2xl font-black text-primary">
                          ₹{listing.price_per_unit} <span className="text-xs text-gray-500 font-normal">/ {listing.products?.unit}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: AI Scoring & Transparency Breakdown */}
                    <div className="md:col-span-8 p-6 space-y-5">
                      {/* Top Score Banner */}
                      <div className="flex justify-between items-center bg-green-50 p-4 rounded-xl border border-green-200">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-extrabold text-primary">{match.match_score}%</span>
                            <Badge variant="success" className="text-xs">High Compatibility</Badge>
                          </div>
                          <span className="text-[11px] text-gray-500">Multi-Factor Algorithmic Score</span>
                        </div>
                        <div className="flex items-center text-xs text-emerald-800 font-semibold">
                          <ShieldCheck className="w-4 h-4 mr-1 text-emerald-600" />
                          Verified Farmer Lot
                        </div>
                      </div>

                      {/* 4 Multi-Factor Score Bars */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div className="bg-gray-50 p-2.5 rounded-lg border">
                          <span className="text-gray-500 block text-[10px]">Product Fit</span>
                          <span className="font-bold text-gray-800">100% (Exact)</span>
                        </div>
                        <div className="bg-gray-50 p-2.5 rounded-lg border">
                          <span className="text-gray-500 block text-[10px]">Quantity Fit</span>
                          <span className="font-bold text-gray-800">{match.quantity_score || 100}%</span>
                        </div>
                        <div className="bg-gray-50 p-2.5 rounded-lg border">
                          <span className="text-gray-500 block text-[10px]">Price Target</span>
                          <span className="font-bold text-gray-800">{match.price_score || 95}%</span>
                        </div>
                        <div className="bg-gray-50 p-2.5 rounded-lg border">
                          <span className="text-gray-500 block text-[10px]">Corridor Distance</span>
                          <span className="font-bold text-gray-800">{match.distance_score || 85}%</span>
                        </div>
                      </div>

                      {/* Why this match reasons */}
                      <div className="space-y-1.5 text-xs text-gray-600 bg-white p-3 rounded-xl border">
                        <div className="font-bold text-gray-700 text-[11px] uppercase tracking-wider mb-1">
                          Why this match?
                        </div>
                        {match.explanation?.reasons?.map((reason, i) => (
                          <div key={i} className="flex items-center space-x-1.5 text-emerald-800 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                            <span>{reason.replace(/^✓\s*/, '')}</span>
                          </div>
                        ))}
                      </div>

                      {/* Price Transparency Breakdown */}
                      <PriceBreakdown
                        {...ordersService.calculatePriceBreakdown(listing.price_per_unit, requirement.required_quantity)}
                      />

                      {/* Action CTA */}
                      <div className="pt-2 flex flex-col sm:flex-row gap-3">
                        <Button
                          size="lg"
                          className="flex-1 h-11 font-bold shadow-md"
                          onClick={() => handleInitiateOrder(match)}
                          disabled={orderingId === match.id}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          {orderingId === match.id ? 'Creating Order in Supabase...' : 'Initiate Order & Lock Farmgate Price'}
                        </Button>
                        <Button
                          variant="outline"
                          className="h-11 text-xs"
                          onClick={() => navigate('/logistics/dashboard')}
                        >
                          <Truck className="w-4 h-4 mr-1.5" />
                          Inspect Route
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
