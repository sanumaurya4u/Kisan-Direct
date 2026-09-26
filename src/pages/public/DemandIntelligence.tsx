import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  TrendingUp,
  CheckCircle2,
  Calendar,
  Sparkles,
  Tractor,
  ShoppingCart,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  AreaChart,
  Area,
} from 'recharts';

interface ForecastDataPoint {
  month: string;
  projectedDemand: number;
  expectedSupply: number;
  deficitOrSurplus: number;
  confidenceLower: number;
  confidenceUpper: number;
}

const DEMAND_FORECAST_MODELS: Record<string, {
  cropName: string;
  region: string;
  unit: string;
  data: ForecastDataPoint[];
  aiInsight: string;
  recommendedAction: string;
}> = {
  tomato: {
    cropName: 'Hybrid Tomato',
    region: 'Nashik ➔ Mumbai / Pune Corridor',
    unit: 'Tons',
    data: [
      { month: 'Apr 2026', projectedDemand: 1200, expectedSupply: 950, deficitOrSurplus: -250, confidenceLower: 1100, confidenceUpper: 1300 },
      { month: 'May 2026', projectedDemand: 1450, expectedSupply: 1100, deficitOrSurplus: -350, confidenceLower: 1350, confidenceUpper: 1550 },
      { month: 'Jun 2026', projectedDemand: 1600, expectedSupply: 1050, deficitOrSurplus: -550, confidenceLower: 1480, confidenceUpper: 1720 },
      { month: 'Jul 2026', projectedDemand: 1750, expectedSupply: 1300, deficitOrSurplus: -450, confidenceLower: 1620, confidenceUpper: 1880 },
      { month: 'Aug 2026', projectedDemand: 1500, expectedSupply: 1400, deficitOrSurplus: -100, confidenceLower: 1400, confidenceUpper: 1600 },
      { month: 'Sep 2026', projectedDemand: 1350, expectedSupply: 1550, deficitOrSurplus: 200, confidenceLower: 1250, confidenceUpper: 1450 },
    ],
    aiInsight: 'Severe supply deficit projected for June–July (-550 Tons) due to delayed summer monsoon onset. High farmgate price window (₹32–₹40/kg expected).',
    recommendedAction: 'Farmers in Nashik and Dindori are advised to prioritize early drip-irrigated planting for May–June harvest to capture peak retail realization.',
  },
  onion: {
    cropName: 'Nashik Red Onion',
    region: 'Lasalgaon ➔ Mumbai / Export DC',
    unit: 'Tons',
    data: [
      { month: 'Apr 2026', projectedDemand: 2800, expectedSupply: 3200, deficitOrSurplus: 400, confidenceLower: 2600, confidenceUpper: 3000 },
      { month: 'May 2026', projectedDemand: 2600, expectedSupply: 2900, deficitOrSurplus: 300, confidenceLower: 2450, confidenceUpper: 2750 },
      { month: 'Jun 2026', projectedDemand: 2400, expectedSupply: 2100, deficitOrSurplus: -300, confidenceLower: 2250, confidenceUpper: 2550 },
      { month: 'Jul 2026', projectedDemand: 2300, expectedSupply: 1800, deficitOrSurplus: -500, confidenceLower: 2150, confidenceUpper: 2450 },
      { month: 'Aug 2026', projectedDemand: 2200, expectedSupply: 1600, deficitOrSurplus: -600, confidenceLower: 2050, confidenceUpper: 2350 },
      { month: 'Sep 2026', projectedDemand: 2500, expectedSupply: 1900, deficitOrSurplus: -600, confidenceLower: 2300, confidenceUpper: 2700 },
    ],
    aiInsight: 'Rabi harvest arrivals peak in April–May creating short-term local surplus (+400 Tons). Deficit begins emerging from July onwards as stocks deplete.',
    recommendedAction: 'Utilize scientific ventilated onion chawls to store 40% of harvest for July–September release, avoiding distress selling during peak April market gluts.',
  },
  wheat: {
    cropName: 'Sharbati Wheat',
    region: 'Madhya Pradesh ➔ Delhi / NCR',
    unit: 'Tons',
    data: [
      { month: 'Apr 2026', projectedDemand: 4500, expectedSupply: 5200, deficitOrSurplus: 700, confidenceLower: 4200, confidenceUpper: 4800 },
      { month: 'May 2026', projectedDemand: 4200, expectedSupply: 4800, deficitOrSurplus: 600, confidenceLower: 3900, confidenceUpper: 4500 },
      { month: 'Jun 2026', projectedDemand: 3800, expectedSupply: 3600, deficitOrSurplus: -200, confidenceLower: 3500, confidenceUpper: 4100 },
      { month: 'Jul 2026', projectedDemand: 3600, expectedSupply: 3200, deficitOrSurplus: -400, confidenceLower: 3300, confidenceUpper: 3900 },
      { month: 'Aug 2026', projectedDemand: 3500, expectedSupply: 3100, deficitOrSurplus: -400, confidenceLower: 3200, confidenceUpper: 3800 },
      { month: 'Sep 2026', projectedDemand: 3600, expectedSupply: 3300, deficitOrSurplus: -300, confidenceLower: 3300, confidenceUpper: 3900 },
    ],
    aiInsight: 'Stable institutional procurement demand from flour mills. Surplus in April/May post-harvest, followed by deficit during monsoon months.',
    recommendedAction: 'Contract directly with verified corporate flour millers on Kisan Direct at ₹32–₹34/kg farmgate with pre-scheduled warehouse dispatch.',
  },
};

const REGIONAL_CLUSTER_MATRIX = [
  { cluster: 'Nashik Cluster (MH)', demandTons: 4200, supplyTons: 3600, gap: -600, status: 'Deficit Zone' },
  { cluster: 'Pune / Baramati (MH)', demandTons: 3100, supplyTons: 3400, gap: 300, status: 'Surplus Zone' },
  { cluster: 'Navi Mumbai DC (MH)', demandTons: 5800, supplyTons: 4100, gap: -1700, status: 'High Deficit' },
  { cluster: 'Delhi Azadpur Belt', demandTons: 7200, supplyTons: 6300, gap: -900, status: 'Deficit Zone' },
  { cluster: 'Indore / Malwa (MP)', demandTons: 3600, supplyTons: 4800, gap: 1200, status: 'High Surplus' },
];

export function DemandIntelligence() {
  const navigate = useNavigate();
  const [selectedCropKey, setSelectedCropKey] = useState<string>('tomato');

  const currentModel = DEMAND_FORECAST_MODELS[selectedCropKey] || DEMAND_FORECAST_MODELS.tomato;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#14532D] via-emerald-800 to-[#14532D] text-white p-8 sm:p-12 shadow-xl border border-emerald-800/80">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-fresh/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-200 border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-fresh" />
            <span>AI Predictive Demand Modeling • SIH PS #26033</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Wholesale Demand Forecasting & Regional Gap Intelligence
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            Protecting farmers from post-harvest distress sales by predicting 6-month consumer demand curves and regional deficit windows. Know what to harvest, when to sell, and where to dispatch.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              onClick={() => navigate('/buyer/dashboard/requirements/new')}
              className="bg-fresh hover:bg-fresh-hover text-slate-950 font-bold px-6 h-11 rounded-xl shadow-md"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Post Bulk Requirement
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/prices')}
              className="bg-white/10 hover:bg-white/20 text-white border-white/25 font-bold px-6 h-11 rounded-xl"
            >
              <TrendingUp className="w-4 h-4 mr-2 text-fresh" />
              Check Spot Prices
            </Button>
          </div>
        </div>
      </div>

      {/* Crop Selector Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Select Commodity:</span>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'tomato', label: '🍅 Hybrid Tomato' },
              { key: 'onion', label: '🧅 Nashik Red Onion' },
              { key: 'wheat', label: '🌾 Sharbati Wheat' },
            ].map((crop) => (
              <button
                key={crop.key}
                onClick={() => setSelectedCropKey(crop.key)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCropKey === crop.key
                    ? 'bg-primary text-white shadow-xs scale-102'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {crop.label}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-gray-500 font-medium">
          Corridor: <strong className="text-gray-800">{currentModel.region}</strong>
        </div>
      </div>

      {/* AI Advisory Callout Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-300 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-emerald-900 font-bold text-sm">
            <Sparkles className="w-5 h-5 text-primary" />
            <span>AI Predictive Intelligence & Sowing Window Advisory</span>
          </div>
          <Badge variant="success" className="text-xs font-bold">
            High Confidence (94%)
          </Badge>
        </div>
        <p className="text-sm font-semibold text-emerald-950 leading-relaxed">
          {currentModel.aiInsight}
        </p>
        <div className="p-3 bg-white/80 rounded-xl text-xs text-emerald-800 border border-emerald-200 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <span><strong>Strategic Farmer Recommendation:</strong> {currentModel.recommendedAction}</span>
        </div>
      </div>

      {/* Projected Demand Curve Chart */}
      <Card className="border-emerald-100">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                6-Month Wholesale Demand Forecast vs Expected Farmgate Supply ({currentModel.cropName})
              </CardTitle>
              <CardDescription>
                Projected monthly consumption in {currentModel.unit} with confidence bounds
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs text-emerald-800 bg-emerald-50 border-emerald-200">
              Corridor: {currentModel.region}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentModel.data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16A34A" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#16A34A" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="supplyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis unit={` ${currentModel.unit}`} tick={{ fontSize: 11 }} />
                <RechartsTooltip
                  formatter={(value: any, name: any) => [
                    `${value} ${currentModel.unit}`,
                    name === 'projectedDemand' ? 'Projected Retail Demand' : name === 'expectedSupply' ? 'Estimated Harvest Supply' : 'Confidence Band'
                  ]}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB' }}
                />
                <Legend
                  formatter={(value) =>
                    value === 'projectedDemand'
                      ? 'Projected Demand'
                      : value === 'expectedSupply'
                      ? 'Estimated Regional Supply'
                      : 'Confidence Interval'
                  }
                />
                <Area
                  type="monotone"
                  dataKey="projectedDemand"
                  stroke="#16A34A"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#demandGrad)"
                  name="projectedDemand"
                />
                <Area
                  type="monotone"
                  dataKey="expectedSupply"
                  stroke="#2563EB"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#supplyGrad)"
                  name="expectedSupply"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Regional Supply vs Demand Deficit/Surplus Matrix (Section 26 & 30) */}
      <Card className="border-emerald-100">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Regional Supply vs Demand Gap Matrix (Live Trade Clusters)
              </CardTitle>
              <CardDescription>
                Identifies regional deficit corridors to incentivize inter-state logistics dispatching and prevent gluts.
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs text-gray-700 bg-gray-50">
              5 Major Trade Clusters
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REGIONAL_CLUSTER_MATRIX} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="cluster" tick={{ fontSize: 11 }} />
                <YAxis unit=" Tons" tick={{ fontSize: 11 }} />
                <RechartsTooltip
                  formatter={(value: any, name: any) => [
                    `${value} Tons`,
                    name === 'demandTons' ? 'Wholesale Demand' : 'Available Supply'
                  ]}
                />
                <Legend />
                <Bar dataKey="demandTons" name="Wholesale Demand (Tons)" fill="#16A34A" radius={[6, 6, 0, 0]} />
                <Bar dataKey="supplyTons" name="Available Supply (Tons)" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Matrix Data Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
            {REGIONAL_CLUSTER_MATRIX.map((c) => (
              <div key={c.cluster} className="p-3.5 rounded-xl border bg-gray-50/70 space-y-1.5 text-xs">
                <div className="font-bold text-gray-900 truncate">{c.cluster}</div>
                <div className="flex justify-between text-gray-600">
                  <span>Demand:</span>
                  <span className="font-semibold">{c.demandTons} T</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Supply:</span>
                  <span className="font-semibold">{c.supplyTons} T</span>
                </div>
                <div className="pt-1 border-t flex justify-between items-center font-bold">
                  <span>Gap:</span>
                  <span className={c.gap < 0 ? 'text-red-600' : 'text-emerald-700'}>
                    {c.gap > 0 ? `+${c.gap}` : c.gap} T
                  </span>
                </div>
                <div className="pt-1">
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    c.gap < 0 ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {c.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bottom CTA Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 rounded-2xl bg-gray-50 border border-gray-200">
        <div>
          <h3 className="font-bold text-base text-gray-900">Need specific crop demand curves for your district?</h3>
          <p className="text-xs text-gray-500">Farmers can use our Sell Smart AI tool to optimize channel allocation across retail and processors.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/farmer/sell-smart">
            <Button className="font-bold text-xs">
              <Tractor className="w-4 h-4 mr-1.5" />
              Sell Smart Allocation
            </Button>
          </Link>
          <Link to="/ai-match">
            <Button variant="outline" className="font-bold text-xs">
              Explore AI Matching
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
