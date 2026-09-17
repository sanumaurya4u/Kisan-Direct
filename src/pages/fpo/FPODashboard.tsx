import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { listingsService, type Listing } from '../../features/listings/listingsService';
import { Button } from '../../components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import {
  Plus,
  Edit,
  Building2,
  Users,
  Scale,
  TrendingUp,
  Package,
  Store,
  Truck,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export function FPODashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
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

  const totalVolume = listings.reduce((acc, l) => acc + (Number(l.available_quantity) || 0), 0);
  const totalValue = listings.reduce((acc, l) => acc + ((Number(l.available_quantity) || 0) * (Number(l.price_per_unit) || 0)), 0);

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 max-w-6xl">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
              <Building2 className="w-5 h-5" />
            </span>
            <Badge variant="fresh" className="text-xs">FPO Cooperative Hub • किसान उत्पादक संगठन</Badge>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-2 tracking-tight">
            {profile?.full_name || 'Sahyadri Kisan Producer Company'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Registered Producer Organization • 420 Member Farmers • Pune & Western Maharashtra Cluster
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <Link to="/farmer/sell-smart">
            <Button variant="outline" className="text-xs">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
              AI Price Optimizer
            </Button>
          </Link>
          <Link to="/fpo/dashboard/listings/new">
            <Button className="shadow-kisan-hover text-xs font-bold">
              <Plus className="w-4 h-4 mr-1.5" />
              + Aggregate Harvest Lot
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Active Lots */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-kisan-card space-y-1 hover:shadow-kisan-hover transition-all">
          <div className="flex justify-between items-center text-gray-500 text-xs font-medium uppercase tracking-wider">
            <span>Co-op Lots</span>
            <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-xl">
              <Package className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl md:text-3xl font-black text-gray-900">
            {listings.length > 0 ? listings.length : 3}
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold">
            Active in marketplace
          </p>
        </div>

        {/* Stat 2: Member Farmers */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-kisan-card space-y-1 hover:shadow-kisan-hover transition-all">
          <div className="flex justify-between items-center text-gray-500 text-xs font-medium uppercase tracking-wider">
            <span>Member Kisans</span>
            <span className="p-1.5 bg-blue-50 text-blue-700 rounded-xl">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl md:text-3xl font-black text-gray-900">
            420
          </div>
          <p className="text-[11px] text-blue-600 font-medium">
            Aggregated farm landholdings
          </p>
        </div>

        {/* Stat 3: Volume Aggregated */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-kisan-card space-y-1 hover:shadow-kisan-hover transition-all">
          <div className="flex justify-between items-center text-gray-500 text-xs font-medium uppercase tracking-wider">
            <span>Aggregated Volume</span>
            <span className="p-1.5 bg-amber-50 text-amber-700 rounded-xl">
              <Scale className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl md:text-3xl font-black text-gray-900">
            {totalVolume > 0 ? `${(totalVolume / 1000).toFixed(1)} MT` : '18.5 MT'}
          </div>
          <p className="text-[11px] text-amber-700 font-medium">
            Ready for institutional dispatch
          </p>
        </div>

        {/* Stat 4: Direct GMV */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-kisan-card space-y-1 hover:shadow-kisan-hover transition-all">
          <div className="flex justify-between items-center text-gray-500 text-xs font-medium uppercase tracking-wider">
            <span>Direct Co-op GMV</span>
            <span className="p-1.5 bg-purple-50 text-purple-700 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl md:text-3xl font-black text-gray-900">
            ₹{totalValue > 0 ? totalValue.toLocaleString('en-IN') : '5,42,000'}
          </div>
          <p className="text-[11px] text-purple-600 font-medium">
            100% Realization • ₹0 Brokerage
          </p>
        </div>
      </div>

      {/* Quick Action Navigation Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-kisan-card">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Cooperative Actions:
          </span>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/fpo/dashboard/listings/new')}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Aggregate New Produce
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/marketplace')}
            >
              <Store className="w-3.5 h-3.5 mr-1" />
              Public Marketplace
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/analytics')}
            >
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              Regional Deficit Curves
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/logistics/dashboard')}
            >
              <Truck className="w-3.5 h-3.5 mr-1" />
              Dispatch Logistics
            </Button>
          </div>
        </div>
      </div>

      {/* Main Listings Table */}
      <div className="bg-white p-6 rounded-2xl shadow-kisan-card border border-gray-200/80 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Aggregated Farmgate Lots</h2>
            <p className="text-xs text-gray-500">Live inventory aggregated from member smallholder farms</p>
          </div>
          <Link to="/fpo/dashboard/listings/new">
            <Button size="sm" className="shadow-xs font-bold">
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Lot
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="py-12">
            <LoadingSpinner text="Loading cooperative produce lots..." />
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="font-semibold text-gray-700">No collective harvest lots listed yet</p>
            <p className="text-xs text-gray-400 mt-1">Aggregate produce from member farmers to attract institutional bulk bids.</p>
            <div className="mt-4">
              <Link to="/fpo/dashboard/listings/new">
                <Button size="sm">+ Create First Lot</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Crop / Commodity</TableHead>
                  <TableHead>Aggregated Volume</TableHead>
                  <TableHead>Farmgate Rate (₹)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aggregation Hub</TableHead>
                  <TableHead className="text-right">Manage Lot</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listings.map((listing) => (
                  <TableRow key={listing.id} className="hover:bg-gray-50/50">
                    <TableCell className="font-bold text-gray-900">
                      {listing.products?.name}
                      {listing.grade && (
                        <span className="text-xs font-normal text-emerald-700 block">
                          Grade: {listing.grade}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="font-semibold text-sm">
                      {listing.available_quantity} {listing.products?.unit}
                    </TableCell>
                    <TableCell className="font-bold text-primary">
                      ₹{listing.price_per_unit} / {listing.products?.unit}
                    </TableCell>
                    <TableCell>
                      <Badge variant={listing.status === 'active' ? 'success' : 'secondary'}>
                        {listing.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-gray-600">{listing.location_name}</TableCell>
                    <TableCell className="text-right">
                      <Link to={`/fpo/dashboard/listings/${listing.id}/edit`}>
                        <Button variant="outline" size="sm" className="text-xs">
                          <Edit className="w-3.5 h-3.5 mr-1" /> Edit Lot
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Institutional Procurement Connect Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-green-50 to-amber-50 border border-emerald-200 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="space-y-1">
          <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Direct Institutional Buyer Contracts
          </h3>
          <p className="text-xs text-gray-600 max-w-xl">
            Match your FPO’s aggregated supply directly with institutional retail chains like Reliance Retail, BigBasket, and Mother Dairy.
          </p>
        </div>
        <Link to="/marketplace">
          <Button className="bg-primary hover:bg-emerald-900 text-white shadow-kisan-hover font-bold">
            Explore Open Bulk Demands
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

