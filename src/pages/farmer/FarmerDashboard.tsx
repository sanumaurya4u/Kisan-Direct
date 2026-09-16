import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { listingsService, type Listing } from '../../features/listings/listingsService';
import { Button } from '../../components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Plus, Edit } from 'lucide-react';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export function FarmerDashboard() {
  const { profile } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      listingsService.getMyListings(profile.id)
        .then(setListings)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [profile]);

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Farmer Dashboard</h1>
          <p className="text-gray-500">Welcome back, {profile?.full_name}</p>
        </div>
        <div className="flex space-x-2">
          <Link to="/analytics">
            <Button variant="outline">Market Analytics</Button>
          </Link>
          <Link to="/farmer/orders">
            <Button variant="outline">Received Orders</Button>
          </Link>
          <Link to="/farmer/dashboard/listings/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Listing
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">My Produce Listings</h2>
        {isLoading ? (
          <LoadingSpinner text="Loading your inventory..." />
        ) : listings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>You haven't created any listings yet.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price (₹)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listings.map(listing => (
                <TableRow key={listing.id}>
                  <TableCell className="font-medium">
                    {listing.products?.name}
                    {listing.grade && <span className="text-xs text-gray-500 block">{listing.grade}</span>}
                  </TableCell>
                  <TableCell>{listing.available_quantity} {listing.products?.unit}</TableCell>
                  <TableCell>₹{listing.price_per_unit} / {listing.products?.unit}</TableCell>
                  <TableCell>
                    <Badge variant={listing.status === 'active' ? 'success' : 'secondary'}>
                      {listing.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{listing.location_name}</TableCell>
                  <TableCell className="text-right">
                    <Link to={`/farmer/dashboard/listings/${listing.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" /> Edit
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
