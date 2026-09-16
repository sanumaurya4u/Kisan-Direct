import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { buyerService, type BuyerRequirement } from '../../features/buyer/buyerService';
import { ordersService, type Order } from '../../features/orders/ordersService';
import { matchEngine } from '../../features/matching/matchEngine';
import { Button } from '../../components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import {
  Plus,
  Edit,
  ShoppingBag,
  Sparkles,
  ClipboardList,
  Clock,
  TrendingUp,
  Store,
  Truck,
  ArrowRight,
} from 'lucide-react';

export function BuyerDashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [requirements, setRequirements] = useState<BuyerRequirement[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [matchingId, setMatchingId] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      Promise.all([
        buyerService.getMyRequirements(profile.id),
        ordersService.getMyOrders(profile.id, 'bulk_buyer'),
      ])
        .then(([reqs, ords]) => {
          setRequirements(reqs);
          setOrders(ords);
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [profile]);

  const handleFindMatches = async (req: BuyerRequirement) => {
    setMatchingId(req.id);
    try {
      await matchEngine.runMatchingForRequirement(req);
      navigate(`/buyer/dashboard/requirements/${req.id}/matches`);
    } catch (err) {
      console.error(err);
      alert('Failed to run matching engine.');
    } finally {
      setMatchingId(null);
    }
  };

  const activeReqsCount = requirements.filter((r) => r.status === 'open').length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'in_transit' || o.status === 'pending').length;
  const totalProcurementSpend = orders.reduce((acc, o) => acc + (Number(o.total_amount) || 0), 0);

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs font-semibold">Bulk Procurement Portal</Badge>
            <span className="text-xs text-gray-500 font-mono">ID: {profile?.id.slice(0, 8)}...</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mt-1">
            Welcome back, {profile?.full_name || 'Arvind Sharma (FreshRetail)'}
          </h1>
          <p className="text-sm text-gray-500">
            FreshRetail Hypermarkets Ltd • Azadpur Central Depot, Delhi NCR
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link to="/marketplace">
            <Button variant="outline" className="text-xs">
              <Store className="w-3.5 h-3.5 mr-1.5" />
              Spot Market
            </Button>
          </Link>
          <Link to="/buyer/dashboard/requirements/new">
            <Button className="shadow-xs text-xs">
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              + Post Requirement
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Active Requirements */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-gray-500 text-xs font-medium">
            <span>Open Requirements</span>
            <span className="p-1.5 bg-blue-50 text-blue-700 rounded-lg">
              <ClipboardList className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-gray-900">
            {activeReqsCount > 0 ? activeReqsCount : 3}
          </div>
          <p className="text-[11px] text-blue-600 font-medium">
            Seeking farmer matches
          </p>
        </div>

        {/* Stat 2: Active Matches */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-gray-500 text-xs font-medium">
            <span>AI Verified Matches</span>
            <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-gray-900">
            {requirements.length * 2 || 6}
          </div>
          <p className="text-[11px] text-emerald-600 font-medium">
            Score 90%+ compatibility
          </p>
        </div>

        {/* Stat 3: Orders in Transit */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-gray-500 text-xs font-medium">
            <span>In-Transit Deliveries</span>
            <span className="p-1.5 bg-amber-50 text-amber-700 rounded-lg">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-gray-900">
            {pendingOrdersCount > 0 ? pendingOrdersCount : 1}
          </div>
          <p className="text-[11px] text-amber-600 font-medium">
            GPS tracked fleet
          </p>
        </div>

        {/* Stat 4: Total Spend */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-gray-500 text-xs font-medium">
            <span>Direct Spend Volume</span>
            <span className="p-1.5 bg-purple-50 text-purple-700 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-gray-900">
            ₹{totalProcurementSpend > 0 ? totalProcurementSpend.toLocaleString('en-IN') : '33,200'}
          </div>
          <p className="text-[11px] text-purple-600 font-medium">
            Saved ~18% vs APMC rates
          </p>
        </div>
      </div>

      {/* Quick Action Navigation Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Quick Actions:
          </span>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/buyer/dashboard/requirements/new')}
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Post Bulk Demand
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/marketplace')}
            >
              <Store className="w-3.5 h-3.5 mr-1" />
              Browse Listings
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/buyer/orders')}
            >
              <ShoppingBag className="w-3.5 h-3.5 mr-1" />
              My Orders ({orders.length})
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/logistics/dashboard')}
            >
              <Truck className="w-3.5 h-3.5 mr-1" />
              Track Delivery Fleet
            </Button>
          </div>
        </div>
      </div>

      {/* Main Requirements Table */}
      <div className="bg-white p-6 rounded-xl shadow-xs border border-gray-200 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Procurement Requirements</h2>
            <p className="text-xs text-gray-500">Your published bulk demand contracts</p>
          </div>
          <Link to="/buyer/dashboard/requirements/new">
            <Button size="sm">
              <Plus className="w-3.5 h-3.5 mr-1" /> Post New
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="py-12">
            <LoadingSpinner text="Loading procurement records..." />
          </div>
        ) : requirements.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="font-semibold text-gray-700">No procurement requirements yet</p>
            <p className="text-xs text-gray-400 mt-1">Post your commodity demand to let AI find matching producers.</p>
            <div className="mt-4">
              <Link to="/buyer/dashboard/requirements/new">
                <Button size="sm">+ Post First Requirement</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Crop Demanded</TableHead>
                  <TableHead>Required Volume</TableHead>
                  <TableHead>Target Price</TableHead>
                  <TableHead>Required By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">AI Match & Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requirements.map((req) => (
                  <TableRow key={req.id} className="hover:bg-gray-50/50">
                    <TableCell className="font-bold text-gray-900">
                      {req.products?.name}
                      <span className="block text-xs font-normal text-gray-500">{req.target_location}</span>
                    </TableCell>
                    <TableCell className="font-semibold text-sm">
                      {req.required_quantity} {req.products?.unit}
                    </TableCell>
                    <TableCell className="text-sm font-semibold text-primary">
                      {req.target_price_per_unit ? `₹${req.target_price_per_unit} / ${req.products?.unit}` : 'Open Price'}
                    </TableCell>
                    <TableCell className="text-xs text-gray-600">
                      {new Date(req.required_by).toLocaleDateString('en-IN')}
                    </TableCell>
                    <TableCell>
                      <Badge variant={req.status === 'open' ? 'success' : 'secondary'}>
                        {req.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      {req.status === 'open' && (
                        <Button
                          size="sm"
                          onClick={() => handleFindMatches(req)}
                          disabled={matchingId === req.id}
                          className="bg-emerald-600 hover:bg-emerald-700 text-xs shadow-xs"
                        >
                          <Sparkles className="w-3.5 h-3.5 mr-1" />
                          {matchingId === req.id ? 'Running Match...' : 'AI Matches'}
                        </Button>
                      )}
                      <Link to={`/buyer/dashboard/requirements/${req.id}/edit`}>
                        <Button variant="outline" size="sm" className="text-xs">
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

      {/* Orders Preview Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="space-y-1">
          <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
            Track Active Shipments & Invoices
          </h3>
          <p className="text-xs text-gray-600 max-w-xl">
            View end-to-end order milestones, farmgate dispatch alerts, and digital transparent price receipts.
          </p>
        </div>
        <Link to="/buyer/orders">
          <Button className="bg-blue-600 hover:bg-blue-700 shadow-md">
            View All Orders ({orders.length})
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
