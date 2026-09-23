import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { VehiclesList } from './VehiclesList';
import { JobsList } from './JobsList';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { supabase } from '../../lib/supabase';
import {
  Truck,
  Compass,
  Clock,
  CheckCircle2,
  Layers,
  ArrowRight,
} from 'lucide-react';

export function LogisticsDashboard() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'pending' | 'my' | 'vehicles'>('pending');
  const [stats, setStats] = useState({
    activeShipments: 1,
    availableVehicles: 2,
    pendingJobs: 1,
    completedDeliveries: 4,
  });

  useEffect(() => {
    // Quick metric count fetch
    Promise.all([
      supabase.from('logistics_jobs').select('*', { count: 'exact', head: true }).eq('status', 'in_transit'),
      supabase.from('vehicles').select('*', { count: 'exact', head: true }).eq('availability_status', 'available'),
      supabase.from('logistics_jobs').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('logistics_jobs').select('*', { count: 'exact', head: true }).eq('status', 'delivered'),
    ]).then(([active, avail, pend, comp]) => {
      setStats({
        activeShipments: active.count ?? 1,
        availableVehicles: avail.count ?? 2,
        pendingJobs: pend.count ?? 1,
        completedDeliveries: comp.count ?? 4,
      });
    }).catch(err => {
      console.error('Failed to fetch dashboard metrics:', err);
    });
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
              <Truck className="w-5 h-5" />
            </span>
            <Badge variant="outline" className="text-xs font-semibold">Fleet Partner Portal</Badge>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mt-1">
            Logistics & Dispatch Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Welcome, {profile?.full_name || 'Vikram Singh'} • Kisan Express Cold-Chain Fleet (Delhi-NCR Hub)
          </p>
        </div>

        <Link to="/logistics/routes">
          <Button className="bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-xs">
            <Compass className="w-4 h-4 mr-2" />
            Open Route Optimizer
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </Link>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Shipments */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-kisan-card space-y-1 hover:shadow-kisan-hover transition-all">
          <div className="flex justify-between items-center text-gray-500 text-xs font-medium uppercase tracking-wider">
            <span>Active Deliveries</span>
            <span className="p-1.5 bg-blue-50 text-blue-700 rounded-xl">
              <Truck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl md:text-3xl font-black text-gray-900">
            {stats.activeShipments}
          </div>
          <p className="text-[11px] text-blue-600 font-medium">
            In-Transit via NH44 corridor
          </p>
        </div>

        {/* Available Fleet Vehicles */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-kisan-card space-y-1 hover:shadow-kisan-hover transition-all">
          <div className="flex justify-between items-center text-gray-500 text-xs font-medium uppercase tracking-wider">
            <span>Available Vehicles</span>
            <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-xl">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl md:text-3xl font-black text-gray-900">
            {stats.availableVehicles}
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold">
            Ready for farmgate dispatch
          </p>
        </div>

        {/* Pending Pickup Jobs */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-kisan-card space-y-1 hover:shadow-kisan-hover transition-all">
          <div className="flex justify-between items-center text-gray-500 text-xs font-medium uppercase tracking-wider">
            <span>Pending Farmgate Jobs</span>
            <span className="p-1.5 bg-amber-50 text-amber-700 rounded-xl">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl md:text-3xl font-black text-gray-900">
            {stats.pendingJobs}
          </div>
          <p className="text-[11px] text-amber-700 font-medium">
            Requires vehicle assignment
          </p>
        </div>

        {/* Completed Deliveries */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-kisan-card space-y-1 hover:shadow-kisan-hover transition-all">
          <div className="flex justify-between items-center text-gray-500 text-xs font-medium uppercase tracking-wider">
            <span>Completed Trips</span>
            <span className="p-1.5 bg-purple-50 text-purple-700 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl md:text-3xl font-black text-gray-900">
            {stats.completedDeliveries}
          </div>
          <p className="text-[11px] text-purple-600 font-medium">
            99.2% on-time delivery rate
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-4">
        <div className="flex space-x-2 border-b border-gray-200">
          <button
            className={`py-2.5 px-4 font-bold text-xs uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === 'pending'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('pending')}
          >
            Available Jobs ({stats.pendingJobs})
          </button>
          <button
            className={`py-2.5 px-4 font-bold text-xs uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === 'my'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('my')}
          >
            Active Shipments ({stats.activeShipments})
          </button>
          <button
            className={`py-2.5 px-4 font-bold text-xs uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === 'vehicles'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('vehicles')}
          >
            My Fleet Registry ({stats.availableVehicles + stats.activeShipments})
          </button>
        </div>

        <div>
          {activeTab === 'pending' && <JobsList type="pending" />}
          {activeTab === 'my' && <JobsList type="my" />}
          {activeTab === 'vehicles' && <VehiclesList />}
        </div>
      </div>
    </div>
  );
}
