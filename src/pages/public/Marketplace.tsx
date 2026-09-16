import { useEffect, useState } from 'react';
import { marketplaceService } from '../../features/marketplace/marketplaceService';
import { type Listing } from '../../features/listings/listingsService';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { MapPin, Search } from 'lucide-react';

type MarketplaceListing = Listing & { profiles: { full_name: string; role: string } };

export function Marketplace() {
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
        <h1 className="text-3xl font-bold mb-4">Marketplace</h1>
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
        <div className="text-center py-12 text-gray-500">
          No listings found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map(listing => (
            <Card key={listing.id} className="overflow-hidden hover:shadow-md transition-shadow">
              {listing.image_url ? (
                <img src={listing.image_url} alt={listing.products?.name} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                  No Image Available
                </div>
              )}
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{listing.products?.name}</h3>
                  <span className="font-bold text-primary">₹{listing.price_per_unit}/{listing.products?.unit}</span>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Quantity: {listing.available_quantity} {listing.products?.unit}</p>
                  {listing.grade && <p>Grade: {listing.grade}</p>}
                  <p className="flex items-center mt-2">
                    <MapPin className="h-3 w-3 mr-1" />
                    {listing.location_name}
                  </p>
                  <p className="text-xs text-gray-400 mt-4 pt-2 border-t">
                    Sold by {listing.profiles?.full_name} ({listing.profiles?.role})
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
