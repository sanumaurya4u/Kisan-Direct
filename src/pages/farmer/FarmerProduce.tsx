import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { listingsService, type Listing } from '../../features/listings/listingsService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import {
  Plus,
  Edit,
  Search,
  Package,
  TrendingUp,
  BrainCircuit,
  Pause,
  Play,
  Trash2,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function FarmerProduce() {
  const { profile } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const loadListings = () => {
    if (profile) {
      setIsLoading(true);
      listingsService.getMyListings(profile.id)
        .then(setListings)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  };

  useEffect(() => {
    loadListings();
  }, [profile]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleListingStatus = async (listing: Listing) => {
    const nextStatus = listing.status === 'active' ? 'paused' : 'active';
    try {
      await supabase
        .from('listings')
        .update({ status: nextStatus })
        .eq('id', listing.id);
      loadListings();
    } catch (err) {
      console.error(err);
      alert('Failed to update listing status.');
    }
  };

  const deleteListing = async (id: string) => {
    if (!confirm('Are you sure you want to remove this produce listing?')) return;
    try {
      await listingsService.deleteListing(id);
      loadListings();
    } catch (err) {
      console.error(err);
      alert('Failed to delete listing.');
    }
  };

  const filteredListings = listings.filter((listing) => {
    const matchesSearch = listing.products?.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      listing.location_name.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || listing.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Produce Inventory</h1>
          <p className="text-sm text-gray-500">
            Manage your harvest stock, track buyer demand, and update active lots.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link to="/farmer/sell-smart">
            <Button variant="outline" className="text-emerald-700 border-emerald-300">
              <BrainCircuit className="w-4 h-4 mr-1.5" />
              Price Analyzer
            </Button>
          </Link>
          <Link to="/farmer/dashboard/listings/new">
            <Button>
              <Plus className="w-4 h-4 mr-1.5" />
              + Add New Produce
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <Input
            placeholder="Search produce name or harvest location..."
            className="pl-9 h-10 text-sm"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs text-gray-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-700 font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="paused">Paused Only</option>
          </select>
        </div>
      </div>

      {/* Produce Listings Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12">
            <LoadingSpinner text="Fetching produce inventory..." />
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900">No Produce Lots Found</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
              {searchFilter
                ? 'No items match your search keyword. Try clearing filters.'
                : 'Start listing your harvest to reach buyers directly without middlemen.'}
            </p>
            <div className="mt-4">
              <Link to="/farmer/dashboard/listings/new">
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add Produce Now
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product & Variety</TableHead>
                  <TableHead>Available Stock</TableHead>
                  <TableHead>Farmgate Price</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Regional Demand</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredListings.map((listing) => (
                  <TableRow key={listing.id} className="hover:bg-gray-50/50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {listing.image_url ? (
                          <img
                            src={listing.image_url}
                            alt={listing.products?.name}
                            className="w-10 h-10 rounded-lg object-cover border"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-green-50 text-primary flex items-center justify-center font-bold text-xs">
                            {listing.products?.name?.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-gray-900 text-sm">{listing.products?.name}</div>
                          <div className="text-xs text-gray-500">{listing.location_name}</div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="font-medium text-sm">
                      {listing.available_quantity} {listing.products?.unit}
                    </TableCell>

                    <TableCell className="font-bold text-sm text-primary">
                      ₹{listing.price_per_unit} / {listing.products?.unit}
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className="text-xs font-semibold">
                        {listing.grade || 'Standard'}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center space-x-1.5 text-xs text-emerald-700 font-semibold">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                        <span>High Demand</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={listing.status === 'active' ? 'success' : 'secondary'}
                        className="text-xs"
                      >
                        {listing.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => toggleListingStatus(listing)}
                          title={listing.status === 'active' ? 'Pause Listing' : 'Activate Listing'}
                          className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {listing.status === 'active' ? (
                            <Pause className="w-4 h-4 text-amber-600" />
                          ) : (
                            <Play className="w-4 h-4 text-green-600" />
                          )}
                        </button>
                        <Link to={`/farmer/dashboard/listings/${listing.id}/edit`}>
                          <button
                            title="Edit Listing"
                            className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </Link>
                        <button
                          onClick={() => deleteListing(listing.id)}
                          title="Delete Listing"
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
