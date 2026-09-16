import { useState } from 'react';
import { RouteMap } from '../../components/ui/Map';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Compass,
  Truck,
  Clock,
  Navigation,
  Leaf,
} from 'lucide-react';

interface DemoRouteCorridor {
  id: string;
  name: string;
  crop: string;
  pickup: { lat: number; lng: number; label: string };
  drop: { lat: number; lng: number; label: string };
  distanceKm: number;
  duration: string;
  vehicle: string;
  capacityKg: number;
  loadKg: number;
  fuelSavedLiters: number;
  co2SavedKg: number;
  status: 'In Transit' | 'Scheduled' | 'Optimizing';
}

const DEMO_CORRIDORS: DemoRouteCorridor[] = [
  {
    id: 'corridor-1',
    name: 'Sonipat – Delhi NCR Fast Corridor (NH44)',
    crop: 'Tomato (Hybrid Red)',
    pickup: { lat: 28.9931, lng: 77.0151, label: 'Patel Farms, Sonipat Rural, Haryana' },
    drop: { lat: 28.7041, lng: 77.1025, label: 'FreshRetail Central Warehouse, Azadpur, Delhi' },
    distanceKm: 48.5,
    duration: '1h 22m',
    vehicle: 'Tata 407 Reefer (HR-10-AJ-4491)',
    capacityKg: 4000,
    loadKg: 3500,
    fuelSavedLiters: 4.8,
    co2SavedKg: 12.6,
    status: 'In Transit',
  },
  {
    id: 'corridor-2',
    name: 'Nashik – Mumbai Western Expressway Corridor',
    crop: 'Potato & Pink Onion',
    pickup: { lat: 19.9975, lng: 73.7898, label: 'Patel Agro Hub, Nashik, Maharashtra' },
    drop: { lat: 19.0760, lng: 72.8777, label: 'FreshRetail Distribution Hub, Vashi, Navi Mumbai' },
    distanceKm: 165.2,
    duration: '3h 45m',
    vehicle: 'Eicher Pro 2049 Insulated (MH-15-EG-3012)',
    capacityKg: 5000,
    loadKg: 4800,
    fuelSavedLiters: 14.2,
    co2SavedKg: 38.0,
    status: 'Scheduled',
  },
  {
    id: 'corridor-3',
    name: 'Pune – Mumbai Cold-Chain Link',
    crop: 'Sharbati Wheat & Green Vegetables',
    pickup: { lat: 18.5204, lng: 73.8567, label: 'Sahyadri Kisan FPO Depot, Pune' },
    drop: { lat: 19.1363, lng: 72.8277, label: 'Andheri Central Retail Depot, Mumbai' },
    distanceKm: 148.0,
    duration: '3h 10m',
    vehicle: 'Mahindra Bolero Maxi Truck (DL-01-LB-8822)',
    capacityKg: 1500,
    loadKg: 1450,
    fuelSavedLiters: 9.5,
    co2SavedKg: 25.1,
    status: 'Scheduled',
  },
];

export function RouteOptimizationView() {
  const [selectedCorridorId, setSelectedCorridorId] = useState<string>('corridor-1');

  const corridor =
    DEMO_CORRIDORS.find((c) => c.id === selectedCorridorId) || DEMO_CORRIDORS[0];

  const capacityUtilization = Math.round((corridor.loadKg / corridor.capacityKg) * 100);

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
              <Compass className="w-5 h-5" />
            </span>
            <Badge variant="outline" className="text-xs font-semibold">Phase 8 Feature</Badge>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mt-1">
            Cold-Chain Route Optimization Engine
          </h1>
          <p className="text-xs text-gray-500">
            Algorithmic waypoint planning, reefer temperature integrity, and capacity consolidation.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="success" className="text-xs">
            Demo / Estimated Route
          </Badge>
        </div>
      </div>

      {/* Corridor Selector Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        <span className="text-gray-400 font-bold uppercase tracking-wider mr-1">Corridor:</span>
        {DEMO_CORRIDORS.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCorridorId(c.id)}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              selectedCorridorId === c.id
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Main 2-Column Split: Route Summary on Left, Map on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Route Summary (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-gray-200 shadow-xs">
            <CardHeader className="pb-3 border-b bg-gray-50/50">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-bold text-gray-900">Route Summary</CardTitle>
                <Badge variant={corridor.status === 'In Transit' ? 'success' : 'outline'} className="text-xs">
                  {corridor.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {/* Pickup & Destination Nodes */}
              <div className="space-y-3 relative pl-6 border-l-2 border-dashed border-gray-300 ml-2">
                {/* Pickup Node */}
                <div className="relative">
                  <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-600 ring-4 ring-emerald-100" />
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                    Farmgate Pickup
                  </span>
                  <div className="font-bold text-gray-900 text-sm">{corridor.pickup.label}</div>
                  <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                    {corridor.pickup.lat.toFixed(4)}° N, {corridor.pickup.lng.toFixed(4)}° E
                  </div>
                </div>

                {/* Destination Node */}
                <div className="relative pt-3">
                  <span className="absolute -left-[31px] top-3 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-blue-100" />
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                    Buyer Distribution Hub
                  </span>
                  <div className="font-bold text-gray-900 text-sm">{corridor.drop.label}</div>
                  <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                    {corridor.drop.lat.toFixed(4)}° N, {corridor.drop.lng.toFixed(4)}° E
                  </div>
                </div>
              </div>

              {/* Corridor Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100 text-xs">
                <div className="bg-gray-50 p-3 rounded-lg border">
                  <span className="text-gray-500 block text-[11px]">Total Distance</span>
                  <span className="text-lg font-black text-gray-900">{corridor.distanceKm} km</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border">
                  <span className="text-gray-500 block text-[11px]">Estimated Transit ETA</span>
                  <span className="text-lg font-black text-primary flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {corridor.duration}
                  </span>
                </div>
              </div>

              {/* Vehicle & Capacity Utilization */}
              <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-amber-900 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-amber-700" />
                    {corridor.vehicle}
                  </span>
                  <span className="font-bold text-amber-900">{capacityUtilization}% Load</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-amber-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${capacityUtilization}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-amber-800">
                  <span>Commodity: <strong>{corridor.crop}</strong></span>
                  <span>{corridor.loadKg} / {corridor.capacityKg} kg</span>
                </div>
              </div>

              {/* Green Logistics Footprint */}
              <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-xs space-y-1">
                <div className="flex items-center text-emerald-800 font-bold text-[11px]">
                  <Leaf className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  Corridor Consolidation Impact
                </div>
                <div className="flex justify-between text-gray-600 text-[11px]">
                  <span>Fuel Saved vs Independent Trips:</span>
                  <span className="font-bold text-gray-800">~{corridor.fuelSavedLiters} Liters</span>
                </div>
                <div className="flex justify-between text-gray-600 text-[11px]">
                  <span>CO₂ Emissions Mitigated:</span>
                  <span className="font-bold text-emerald-700">-{corridor.co2SavedKg} kg CO₂</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <Button className="w-full font-bold shadow-xs">
                  <Navigation className="w-4 h-4 mr-2" />
                  Dispatch Navigation Instructions to Driver
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Interactive Leaflet Map (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <Card className="border-gray-200 overflow-hidden shadow-xs">
            <CardHeader className="p-4 border-b bg-gray-50 flex flex-row justify-between items-center">
              <div className="flex items-center space-x-2">
                <Navigation className="w-4 h-4 text-primary" />
                <span className="font-bold text-sm text-gray-900">Live Geospatial Transit Path</span>
              </div>
              <Badge variant="outline" className="text-[10px] font-mono">
                OpenStreetMap / Leaflet
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[480px] w-full relative">
                <RouteMap pickup={corridor.pickup} drop={corridor.drop} />
              </div>
            </CardContent>
          </Card>

          <p className="text-[11px] text-gray-400 text-center">
            Map bounds dynamically fit the farmgate pickup and buyer destination markers with optimized highway corridors.
          </p>
        </div>
      </div>
    </div>
  );
}
