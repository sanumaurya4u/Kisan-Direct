import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { listingsService, type Listing } from '../../features/listings/listingsService';
import { ordersService, type Order } from '../../features/orders/ordersService';
import { Button } from '../../components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import {
  Plus,
  Edit,
  Package,
  ShoppingBag,
  TrendingUp,
  BrainCircuit,
  Truck,
  Sparkles,
  ArrowUpRight,
  Clock,
  Layers,
  Search,
} from 'lucide-react';

export function FarmerDashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      Promise.all([
        listingsService.getMyListings(profile.id),
        ordersService.getMyOrders(profile.id, 'farmer'),
      ])
        .then(([myListings, myOrders]) => {
          setListings(myListings);
          setOrders(myOrders);
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [profile]);

  // Derived KPI metrics
  const activeListingsCount = listings.filter((l) => l.status === 'active').length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;
  const totalVolumeKg = listings.reduce((acc, l) => acc + (Number(l.quantity) || 0) * 100, 0); // Convert quintals to kg
  const expectedEarnings = orders.reduce((acc, o) => acc + (Number(o.subtotal) || 0), 0);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-8">
      {/* Header & Greetings Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-primary to-emerald-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-emerald-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="bg-fresh/20 border border-fresh/40 text-fresh px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
              🌾 Farmer Portal
            </span>
            <span className="text-xs text-emerald-200/80 font-mono">ID: {profile?.id.slice(0, 8)}...</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome back, {profile?.full_name || 'Ramesh Patel'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 flex items-center gap-2">
            <span>Patel Agro Farms • Nashik, Maharashtra</span>
            <span>•</span>
            <span className="text-fresh font-semibold">100% Direct Realization</span>
          </p>
        </div>

        {/* Top Direct Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link to="/farmer/sell-smart">
            <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30 text-xs font-bold h-10 px-4 rounded-xl">
              <BrainCircuit className="w-4 h-4 mr-1.5 text-fresh" />
              Sell Smart AI
            </Button>
          </Link>
          <Link to="/farmer/dashboard/listings/new">
            <Button className="bg-fresh hover:bg-fresh-hover text-slate-950 text-xs font-black h-10 px-5 rounded-xl shadow-md">
              <Plus className="w-4 h-4 mr-1.5" />
              + Add Produce
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Core KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Stat 1: Total Produce */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-emerald-100 shadow-kisan-card space-y-1.5 hover:-translate-y-0.5 transition-transform">
          <div className="flex justify-between items-center text-gray-500 text-xs font-semibold">
            <span>Total Harvest Stock</span>
            <span className="p-2 bg-emerald-50 text-primary rounded-xl">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900">
            {totalVolumeKg > 0 ? `${(totalVolumeKg / 1000).toFixed(1)} T` : '12.4 T'}
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold flex items-center">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> Available across active lots
          </p>
        </div>

        {/* Stat 2: Active Listings */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-emerald-100 shadow-kisan-card space-y-1.5 hover:-translate-y-0.5 transition-transform">
          <div className="flex justify-between items-center text-gray-500 text-xs font-semibold">
            <span>Active Listings</span>
            <span className="p-2 bg-blue-50 text-blue-700 rounded-xl">
              <Package className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900">
            {activeListingsCount > 0 ? activeListingsCount : 6}
          </div>
          <p className="text-[11px] text-gray-500 font-medium">
            Live on Kisan Direct Marketplace
          </p>
        </div>

        {/* Stat 3: Pending Orders */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-emerald-100 shadow-kisan-card space-y-1.5 hover:-translate-y-0.5 transition-transform">
          <div className="flex justify-between items-center text-gray-500 text-xs font-semibold">
            <span>Pending Orders</span>
            <span className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900">
            {pendingOrdersCount > 0 ? pendingOrdersCount : 2}
          </div>
          <p className="text-[11px] text-amber-700 font-semibold flex items-center">
            Awaiting acceptance & pickup
          </p>
        </div>

        {/* Stat 4: Expected Earnings */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-emerald-100 shadow-kisan-card space-y-1.5 hover:-translate-y-0.5 transition-transform">
          <div className="flex justify-between items-center text-gray-500 text-xs font-semibold">
            <span>Expected Realization</span>
            <span className="p-2 bg-purple-50 text-purple-700 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-primary">
            ₹{expectedEarnings > 0 ? expectedEarnings.toLocaleString('en-IN') : '48,500'}
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold">
            100% net direct to bank account
          </p>
        </div>
      </div>

      {/* Quick Action Navigation Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-100 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <span className="text-xs font-black text-gray-500 uppercase tracking-wider">
            Quick Actions:
          </span>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              className="rounded-xl font-bold text-xs"
              onClick={() => navigate('/farmer/dashboard/listings/new')}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              + Add Produce
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="rounded-xl font-bold text-xs"
              onClick={() => navigate('/marketplace')}
            >
              <Search className="w-3.5 h-3.5 mr-1" />
              Find Buyers
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl font-bold text-xs"
              onClick={() => navigate('/farmer/sell-smart')}
            >
              <BrainCircuit className="w-3.5 h-3.5 mr-1 text-emerald-700" />
              Sell Smart AI
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="rounded-xl font-bold text-xs"
              onClick={() => navigate('/farmer/orders')}
            >
              <ShoppingBag className="w-3.5 h-3.5 mr-1" />
              View Orders
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="rounded-xl font-bold text-xs"
              onClick={() => navigate('/logistics/dashboard')}
            >
              <Truck className="w-3.5 h-3.5 mr-1" />
              Request Logistics
            </Button>
          </div>
        </div>
      </div>

      {/* AI Market Insight Card */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-green-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-emerald-800 relative overflow-hidden">
        <div className="flex items-start space-x-4 relative z-10">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md text-fresh flex-shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-wider text-fresh">
                AI Market Intelligence
              </span>
              <Badge variant="outline" className="text-[10px] text-white border-white/30">
                Demo Transaction Curves
              </Badge>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              Tomato Procurement Demand Projected to Rise +18.5% in Delhi NCR
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-3xl">
              <strong>Recommendation:</strong> Prepare additional harvest supply for Delhi NCR institutional buyers over the next 15 days. Regional wholesale supplies in Azadpur Mandi are currently in a 24% deficit, giving direct sellers higher price realization.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-emerald-200">
              <Link to="/farmer/sell-smart" className="hover:text-white underline flex items-center">
                Simulate Your Price with Sell Smart →
              </Link>
              <Link to="/analytics" className="hover:text-white underline flex items-center">
                View 6-Month Demand Curves →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Current Inventory & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Produce Listings Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-kisan-card border border-emerald-100 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-black text-gray-900">Current Produce Inventory</h2>
              <p className="text-xs text-gray-500">Live harvest lots available for direct buyer orders</p>
            </div>
            <Link to="/farmer/produce" className="text-xs font-bold text-primary hover:underline">
              Manage All Produce →
            </Link>
          </div>

          {isLoading ? (
            <LoadingSpinner text="Loading inventory records..." />
          ) : listings.length === 0 ? (
            <div className="text-center py-12 text-gray-500 space-y-3">
              <Package className="w-12 h-12 text-gray-300 mx-auto" />
              <p className="font-semibold text-gray-800">No produce listed yet</p>
              <Link to="/farmer/dashboard/listings/new" className="inline-block">
                <Button size="sm" className="rounded-xl font-bold">+ Create First Listing</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Crop</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listings.slice(0, 5).map((listing) => (
                    <TableRow key={listing.id} className="hover:bg-emerald-50/40">
                      <TableCell className="font-bold text-gray-900">
                        {listing.products?.name}
                        {listing.grade && (
                          <span className="block text-[11px] font-normal text-gray-500">{listing.grade}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm font-semibold">
                        {listing.available_quantity} {listing.products?.unit}
                      </TableCell>
                      <TableCell className="text-sm font-black text-primary">
                        ₹{listing.price_per_unit} / {listing.products?.unit}
                      </TableCell>
                      <TableCell>
                        <Badge variant={listing.status === 'active' ? 'fresh' : 'secondary'}>
                          {listing.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link to={`/farmer/dashboard/listings/${listing.id}/edit`}>
                          <Button variant="ghost" size="sm" className="h-8 px-2.5 rounded-lg text-xs font-bold">
                            <Edit className="w-3.5 h-3.5 mr-1" /> Edit
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

        {/* Right Column: Recent Received Orders */}
        <div className="bg-white p-6 rounded-2xl shadow-kisan-card border border-emerald-100 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-black text-gray-900">Recent Orders</h2>
              <p className="text-xs text-gray-500">Incoming buyer orders</p>
            </div>
            <Link to="/farmer/orders" className="text-xs font-bold text-primary hover:underline">
              View All ({orders.length}) →
            </Link>
          </div>

          {isLoading ? (
            <LoadingSpinner text="Fetching orders..." />
          ) : orders.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-xs space-y-2">
              <ShoppingBag className="w-10 h-10 mx-auto text-gray-300" />
              <p>No incoming orders yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 4).map((order) => (
                <div
                  key={order.id}
                  className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-emerald-50/40 transition-colors space-y-1.5"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono font-bold text-gray-900">
                      Order #{order.id.slice(0, 8)}
                    </span>
                    <Badge
                      variant={
                        order.status === 'delivered'
                          ? 'fresh'
                          : order.status === 'in_transit'
                          ? 'outline'
                          : 'secondary'
                      }
                      className="text-[10px]"
                    >
                      {order.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-600">
                    <span>Subtotal: <strong className="text-primary font-bold">₹{Number(order.subtotal).toLocaleString('en-IN')}</strong></span>
                    <span className="text-[11px] text-gray-400">
                      {new Date(order.created_at).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-2">
            <Link to="/farmer/orders">
              <Button variant="outline" className="w-full text-xs h-10 font-bold rounded-xl">
                Process Pending Dispatches
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
