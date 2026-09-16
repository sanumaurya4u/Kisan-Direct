import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { marketplaceService } from '../../features/marketplace/marketplaceService';
import { type Listing } from '../../features/listings/listingsService';
import { useAuth } from '../../features/auth/AuthContext';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { MapPin, Search, ShoppingCart, Leaf } from 'lucide-react';

type MarketplaceListing = Listing & { profiles: { full_name: string; role: string } };

export function Marketplace() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Basic filters
  const [searchLocation, setSearchLocation] = useState('');

  const fetchListings = () => {
    setIsLoading(true);
    marketplaceService.getActiveListings({ location: searchLocation })
      .then(setListings)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchListings();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
        <p className="text-gray-500 mb-4">Browse fresh produce directly from farmers and FPOs — no middlemen.</p>
        <div className="flex gap-2 max-w-md">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Filter by location..." 
              className="pl-9"
              value={searchLocation}
              onChange={e => setSearchLocation(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchListings()}
            />
          </div>
          <Button onClick={fetchListings}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner text="Fetching active market listings..." />
      ) : listings.length === 0 ? (
        <div className="text-center py-16">
          <Leaf className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">No listings found</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your search or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map(listing => (
            <Card key={listing.id} className="overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              {listing.image_url ? (
                <img src={listing.image_url} alt={listing.products?.name} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
                  <Leaf className="w-12 h-12 text-green-300" />
                </div>
              )}
              <CardContent className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{listing.products?.name}</h3>
                  <span className="font-bold text-primary">₹{listing.price_per_unit}/{listing.products?.unit}</span>
                </div>
                <div className="space-y-1 text-sm text-gray-600 flex-1">
                  <p>Quantity: {listing.available_quantity} {listing.products?.unit}</p>
                  {listing.grade && <Badge variant="outline" className="text-xs">{listing.grade}</Badge>}
                  <p className="flex items-center mt-2">
                    <MapPin className="h-3 w-3 mr-1" />
                    {listing.location_name}
                  </p>
                  <p className="text-xs text-gray-400 mt-2 pt-2 border-t">
                    Sold by {listing.profiles?.full_name} ({listing.profiles?.role})
                  </p>
                </div>
                <Button 
                  className="w-full mt-4"
                  onClick={() => {
                    if (!user) { navigate('/login'); return; }
                    navigate('/buyer/dashboard');
                  }}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {user ? 'Go to Dashboard to Order' : 'Login to Order'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

