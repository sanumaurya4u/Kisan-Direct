import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Truck,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet Default Icon
const pickupIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const dropIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface RouteCorridor {
  id: string;
  name: string;
  description: string;
  pickupName: string;
  pickupCoords: [number, number];
  dropName: string;
  dropCoords: [number, number];
  distanceKm: number;
  eta: string;
  assignedVehicle: string;
  capacityUtilization: number;
  carbonSavingsKg: number;
  status: 'scheduled' | 'in_transit' | 'completed';
  cargo: string;
  waypoints: [number, number][];
}

const TRANSIT_CORRIDORS: RouteCorridor[] = [
  {
    id: 'corridor-1',
    name: 'Nashik Agro Hub ➔ Navi Mumbai DC',
    description: 'High-volume perishable vegetable corridor linking Nashik farmgates with Mumbai retail hypermarkets.',
    pickupName: 'Patel Agro Farmgate, Dindori, Nashik',
    pickupCoords: [19.9975, 73.7898],
    dropName: 'AgroFresh Central Distribution Center, Navi Mumbai',
    dropCoords: [19.0760, 72.8777],
    distanceKm: 165,
    eta: '4h 15m',
    assignedVehicle: 'Eicher Pro 2049 (Reefer 5 MT)',
    capacityUtilization: 88,
    carbonSavingsKg: 42,
    status: 'in_transit',
    cargo: '1,500 kg Hybrid Tomatoes + 2,000 kg Red Onions',
    waypoints: [
      [19.9975, 73.7898],
      [19.7000, 73.4800], // Kasara Ghat highway
      [19.2183, 73.0867], // Kalyan bypass
      [19.0760, 72.8777],
    ],
  },
  {
    id: 'corridor-2',
    name: 'Pune / Baramati ➔ Mumbai Vashi Mandi',
    description: 'Daily fresh fruit and vegetable transit route via Mumbai-Pune Expressway.',
    pickupName: 'Baramati FPO Hub, Pune, Maharashtra',
    pickupCoords: [18.1517, 74.5774],
    dropName: 'Vashi Wholesale Terminal, Navi Mumbai',
    dropCoords: [19.0771, 72.9986],
    distanceKm: 210,
    eta: '4h 45m',
    assignedVehicle: 'Tata 407 (Insulated 2.5 MT)',
    capacityUtilization: 92,
    carbonSavingsKg: 58,
    status: 'scheduled',
    cargo: '2,200 kg Grapes & Pomegranates',
    waypoints: [
      [18.1517, 74.5774],
      [18.5204, 73.8567], // Pune City Bypass
      [18.7546, 73.4062], // Lonavala Expressway
      [19.0771, 72.9986],
    ],
  },
  {
    id: 'corridor-3',
    name: 'Nagpur Citrus Belt ➔ Pune Wholesale Hub',
    description: 'Specialized refrigerated cold-chain transit for Nagpur mandarin oranges.',
    pickupName: 'Katol Citrus Mandi, Nagpur',
    pickupCoords: [21.2727, 78.5833],
    dropName: 'Market Yard Gultekdi, Pune',
    dropCoords: [18.4967, 73.8647],
    distanceKm: 710,
    eta: '12h 30m',
    assignedVehicle: 'Ashok Leyland Ecomet Reefer (8 MT)',
    capacityUtilization: 95,
    carbonSavingsKg: 140,
    status: 'in_transit',
    cargo: '7,500 kg Export Mandarin Oranges',
    waypoints: [
      [21.2727, 78.5833],
      [20.7453, 78.6022], // Wardha
      [19.8762, 75.3433], // Chhatrapati Sambhajinagar
      [18.4967, 73.8647],
    ],
  },
];

export function LogisticsHub() {
  const [selectedCorridorId, setSelectedCorridorId] = useState<string>('corridor-1');
  const [simulatedStatus, setSimulatedStatus] = useState<string | null>(null);

  const activeCorridor = TRANSIT_CORRIDORS.find(c => c.id === selectedCorridorId) || TRANSIT_CORRIDORS[0];

  const handleSimulateStatus = (newStatus: string) => {
    setSimulatedStatus(newStatus);
    setTimeout(() => setSimulatedStatus(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#14532D] via-emerald-800 to-[#14532D] text-white p-8 sm:p-12 shadow-xl border border-emerald-800/80">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-fresh/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-200 border border-white/15">
            <Compass className="w-3.5 h-3.5 text-fresh" />
            <span>Farmgate Cold-Chain Logistics • SIH PS #26033</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Farmgate Cold-Chain & Route Optimization Hub
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            Eliminating 25–30% post-harvest spoilage through automated logistics dispatching, route aggregation, and refrigerated transit. Track agricultural corridors, verify carrier permits, and optimize freight payload utilization.
          </p>
        </div>
      </div>

      {/* Fleet KPI Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-emerald-100 shadow-xs">
          <CardContent className="p-5 text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-primary">3 Vehicles</div>
            <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">Active Fleet Size</div>
            <p className="text-[11px] text-emerald-600">Reefer & Insulated Cargo</p>
          </CardContent>
        </Card>
        <Card className="border-emerald-100 shadow-xs">
          <CardContent className="p-5 text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">10.5 MT</div>
            <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">Total Payload Capacity</div>
            <p className="text-[11px] text-emerald-600">Multi-farmer lot consolidation</p>
          </CardContent>
        </Card>
        <Card className="border-emerald-100 shadow-xs">
          <CardContent className="p-5 text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-blue-600">&lt; 48 Hrs</div>
            <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">Farmgate Pickup SLA</div>
            <p className="text-[11px] text-blue-600">Automated dispatch trigger</p>
          </CardContent>
        </Card>
        <Card className="border-emerald-100 shadow-xs">
          <CardContent className="p-5 text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-amber-600">91.6%</div>
            <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">Capacity Utilization</div>
            <p className="text-[11px] text-amber-600">Zero empty return deadheading</p>
          </CardContent>
        </Card>
      </div>

      {/* Corridor Selector Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs">
        <div>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Active Agricultural Corridor:</span>
          <span className="text-base font-bold text-gray-900">{activeCorridor.name}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {TRANSIT_CORRIDORS.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCorridorId(c.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCorridorId === c.id
                  ? 'bg-primary text-white shadow-xs scale-102'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {c.name.split('➔')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Leaflet Route Map */}
      <Card className="border-emerald-100 overflow-hidden">
        <CardHeader className="border-b pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Compass className="w-5 h-5 text-primary" />
                Live Highway Corridor Map (Leaflet / OpenStreetMap)
              </CardTitle>
              <CardDescription>
                {activeCorridor.description}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs text-emerald-800 bg-emerald-50 border-emerald-200">
                ● Live GPS Sync (Simulated)
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-96 w-full relative z-0">
            <MapContainer
              center={activeCorridor.pickupCoords}
              zoom={8}
              scrollWheelZoom={false}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Pickup Marker */}
              <Marker position={activeCorridor.pickupCoords} icon={pickupIcon}>
                <Popup>
                  <div className="p-1 space-y-1 text-xs">
                    <strong className="text-emerald-800">🌾 Farmgate Pickup Point</strong>
                    <div>{activeCorridor.pickupName}</div>
                    <div className="text-gray-500">Cargo: {activeCorridor.cargo}</div>
                  </div>
                </Popup>
              </Marker>

              {/* Drop Marker */}
              <Marker position={activeCorridor.dropCoords} icon={dropIcon}>
                <Popup>
                  <div className="p-1 space-y-1 text-xs">
                    <strong className="text-red-700">🏢 Delivery Hub Destination</strong>
                    <div>{activeCorridor.dropName}</div>
                  </div>
                </Popup>
              </Marker>

              {/* Highway Polyline Route */}
              <Polyline
                positions={activeCorridor.waypoints}
                color="#16A34A"
                weight={5}
                opacity={0.8}
                dashArray="8, 6"
              />
            </MapContainer>
          </div>

          {/* Route Stats Footer Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-gray-50 border-t border-gray-100 text-xs">
            <div>
              <span className="text-gray-500 block">Total Transit Distance</span>
              <span className="text-sm font-bold text-gray-900">{activeCorridor.distanceKm} km</span>
            </div>
            <div>
              <span className="text-gray-500 block">Estimated Travel Time</span>
              <span className="text-sm font-bold text-gray-900">{activeCorridor.eta}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Truck Payload Utilization</span>
              <span className="text-sm font-bold text-primary">{activeCorridor.capacityUtilization}% (Optimized)</span>
            </div>
            <div>
              <span className="text-gray-500 block">Estimated Carbon Offset</span>
              <span className="text-sm font-bold text-emerald-700">-{activeCorridor.carbonSavingsKg} kg CO₂</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Fleet Dispatches Table & Status Controls */}
      <Card className="border-emerald-100">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                Active Logistics Dispatches & Fleet Assignment Roster
              </CardTitle>
              <CardDescription>
                Simulated real-time telematics and status progression across verified commercial carriers
              </CardDescription>
            </div>
            <Link to="/logistics/dashboard">
              <Button size="sm" variant="outline" className="text-xs font-bold">
                Logistics Partner Portal →
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {simulatedStatus && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
              <span>{simulatedStatus}</span>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wider border-b">
                <tr>
                  <th className="py-3 px-4">Corridor & Cargo</th>
                  <th className="py-3 px-4">Vehicle & Permit</th>
                  <th className="py-3 px-4">Distance / ETA</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {TRANSIT_CORRIDORS.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/50">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-gray-900">{c.name}</div>
                      <div className="text-[11px] text-gray-500">{c.cargo}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-gray-800">{c.assignedVehicle}</div>
                      <div className="text-[10px] text-gray-400 font-mono">MH-15-EG-4412 • Reefer Certified</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-gray-900">{c.distanceKm} km</div>
                      <div className="text-[11px] text-gray-500">{c.eta}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        c.status === 'in_transit'
                          ? 'bg-blue-100 text-blue-800 animate-pulse'
                          : c.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {c.status === 'in_transit' ? 'In Transit 🚚' : c.status === 'completed' ? 'Delivered ✓' : 'Scheduled ⏱'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSimulateStatus(`Dispatched status update sent for ${c.assignedVehicle}. Driver GPS confirmed at checkpoint.`)}
                        className="text-[11px] font-semibold h-8"
                      >
                        Ping GPS
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSimulateStatus(`Delivery receipt signed for ${c.name}. Escrow settlement triggered to producer.`)}
                        className="text-[11px] font-bold h-8"
                      >
                        Mark Delivered
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
