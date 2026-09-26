import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  TrendingUp,
  Calculator,
  ArrowRight,
  Tractor,
  ShoppingCart,
  Sparkles,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from 'recharts';

interface CommodityPrice {
  id: string;
  name: string;
  category: string;
  kisanPrice: number;
  mandiPrice: number;
  retailPrice: number;
  farmerGainPct: number;
  trend: 'up' | 'stable' | 'down';
  changeText: string;
  unit: string;
  region: string;
}

const COMMODITY_PRICES: CommodityPrice[] = [
  {
    id: '1',
    name: 'Hybrid Tomato (Grade A)',
    category: 'Vegetables',
    kisanPrice: 28,
    mandiPrice: 18,
    retailPrice: 42,
    farmerGainPct: 55,
    trend: 'up',
    changeText: '+₹4/kg this week (high retail demand)',
    unit: 'kg',
    region: 'Nashik & Pune Hub',
  },
  {
    id: '2',
    name: 'Nashik Red Onion (Export Grade)',
    category: 'Vegetables',
    kisanPrice: 32,
    mandiPrice: 22,
    retailPrice: 48,
    farmerGainPct: 45,
    trend: 'up',
    changeText: '+₹3/kg (storage depletion season)',
    unit: 'kg',
    region: 'Lasalgaon & Kalwan',
  },
  {
    id: '3',
    name: 'Jyoti Potato (Cold-Storage Lot)',
    category: 'Vegetables',
    kisanPrice: 20,
    mandiPrice: 14,
    retailPrice: 32,
    farmerGainPct: 42,
    trend: 'stable',
    changeText: 'Stable procurement volume',
    unit: 'kg',
    region: 'Agra & Jalandhar Belt',
  },
  {
    id: '4',
    name: 'Sharbati Wheat (Premium Milling)',
    category: 'Grains',
    kisanPrice: 34,
    mandiPrice: 27,
    retailPrice: 48,
    farmerGainPct: 26,
    trend: 'stable',
    changeText: 'Consistent bulk flour miller bids',
    unit: 'kg',
    region: 'Sehore & Indore, MP',
  },
  {
    id: '5',
    name: 'Pusa 1121 Basmati Rice',
    category: 'Grains',
    kisanPrice: 78,
    mandiPrice: 62,
    retailPrice: 110,
    farmerGainPct: 25,
    trend: 'up',
    changeText: '+₹5/kg (export demand expansion)',
    unit: 'kg',
    region: 'Karnal & Taraori, Haryana',
  },
  {
    id: '6',
    name: 'Devgad Alphonso Mango (GI Tagged)',
    category: 'Fruits',
    kisanPrice: 650,
    mandiPrice: 420,
    retailPrice: 950,
    farmerGainPct: 54,
    trend: 'up',
    changeText: 'Early harvest premium bookings',
    unit: 'Dozen',
    region: 'Ratnagiri & Devgad, Konkan',
  },
];

const HISTORICAL_PRICE_TRENDS = [
  { month: 'Oct 2025', mandiPrice: 19, kisanPrice: 26, retailPrice: 38 },
  { month: 'Nov 2025', mandiPrice: 17, kisanPrice: 25, retailPrice: 36 },
  { month: 'Dec 2025', mandiPrice: 15, kisanPrice: 23, retailPrice: 34 },
  { month: 'Jan 2026', mandiPrice: 18, kisanPrice: 27, retailPrice: 40 },
  { month: 'Feb 2026', mandiPrice: 21, kisanPrice: 30, retailPrice: 44 },
  { month: 'Mar 2026 (Live)', mandiPrice: 22, kisanPrice: 32, retailPrice: 48 },
];

export function PriceIntelligence() {
  const navigate = useNavigate();
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [calcPrice, setCalcPrice] = useState<number>(30);
  const [calcVolume, setCalcVolume] = useState<number>(1500);

  // Calculation formulas:
  // Traditional mandi: farmer gets 52%, middlemen take 38%, logistics/wastage 10%
  const traditionalNet = calcPrice * 0.52 * calcVolume;
  const traditionalDrain = calcPrice * 0.38 * calcVolume;
  const traditionalLoss = calcPrice * 0.10 * calcVolume;
  // Kisan direct: farmer gets 100% of farmgate price, freight is billed separately to buyer
  const kisanNet = calcPrice * calcVolume;
  const extraGain = kisanNet - traditionalNet;

  const filteredCommodities = selectedCrop === 'all'
    ? COMMODITY_PRICES
    : COMMODITY_PRICES.filter(c => c.category.toLowerCase() === selectedCrop.toLowerCase());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#14532D] via-emerald-800 to-[#14532D] text-white p-8 sm:p-12 shadow-xl border border-emerald-800/80">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-fresh/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-200 border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-fresh" />
            <span>SIH 2026 Problem Statement #26033 • DoCA Benchmark</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Agricultural Price Intelligence & Fair Value Benchmark
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            Eliminating information asymmetry between rural farmgates and urban wholesale markets. Real-time price realization benchmarks comparing traditional APMC Mandis with Kisan Direct disintermediated trade.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              onClick={() => navigate('/marketplace')}
              className="bg-fresh hover:bg-fresh-hover text-slate-950 font-bold px-6 h-11 rounded-xl shadow-md"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Browse Live Marketplace
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/demand')}
              className="bg-white/10 hover:bg-white/20 text-white border-white/25 font-bold px-6 h-11 rounded-xl"
            >
              <TrendingUp className="w-4 h-4 mr-2 text-fresh" />
              View Demand Forecasts
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metric Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-emerald-100 shadow-xs">
          <CardContent className="p-5 text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-primary">₹0.00</div>
            <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">Intermediary Brokerage</div>
            <p className="text-[11px] text-emerald-600">100% of price goes to producer</p>
          </CardContent>
        </Card>
        <Card className="border-emerald-100 shadow-xs">
          <CardContent className="p-5 text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">+42.8%</div>
            <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">Avg Farmer Surplus</div>
            <p className="text-[11px] text-emerald-600">Compared to local mandi distress sales</p>
          </CardContent>
        </Card>
        <Card className="border-emerald-100 shadow-xs">
          <CardContent className="p-5 text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-blue-600">-18.5%</div>
            <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">Buyer Procurement Cost</div>
            <p className="text-[11px] text-blue-600">Compared to multi-tier middleman rates</p>
          </CardContent>
        </Card>
        <Card className="border-emerald-100 shadow-xs">
          <CardContent className="p-5 text-center space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-amber-600">T+0</div>
            <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">Escrow Settlement</div>
            <p className="text-[11px] text-amber-600">Direct to bank on delivery confirm</p>
          </CardContent>
        </Card>
      </div>

      {/* Spot Price Benchmark Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Live Commodity Spot Price Comparison
            </h2>
            <p className="text-xs text-gray-500">
              Direct farmgate realization vs traditional APMC wholesale auction rates (Demo Data grounded in DoCA benchmarks)
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-semibold text-gray-500">Filter:</span>
            {['all', 'Vegetables', 'Grains', 'Fruits'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCrop(cat)}
                className={`px-3 py-1.5 rounded-full font-semibold transition-colors cursor-pointer ${
                  selectedCrop === cat
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat === 'all' ? 'All Crops' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCommodities.map((item) => (
            <Card key={item.id} className="border-emerald-100 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base font-bold text-gray-900">{item.name}</CardTitle>
                    <CardDescription className="text-xs text-gray-500 mt-0.5">{item.region}</CardDescription>
                  </div>
                  <Badge variant="success" className="text-xs font-bold">
                    +{item.farmerGainPct}% Realization
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4 text-xs">
                <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-xl bg-gray-50/80 border border-gray-100">
                  <div>
                    <div className="text-[10px] text-gray-500 uppercase font-medium">Mandi In-Hand</div>
                    <div className="text-sm font-extrabold text-red-600 line-through">₹{item.mandiPrice}</div>
                    <div className="text-[9px] text-gray-400">per {item.unit}</div>
                  </div>
                  <div className="border-x border-gray-200">
                    <div className="text-[10px] text-primary uppercase font-bold">Kisan Direct</div>
                    <div className="text-base font-black text-primary">₹{item.kisanPrice}</div>
                    <div className="text-[9px] text-emerald-700 font-bold">0% Middleman</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 uppercase font-medium">Metro Retail</div>
                    <div className="text-sm font-bold text-gray-700">₹{item.retailPrice}</div>
                    <div className="text-[9px] text-gray-400">per {item.unit}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg font-medium">
                  <span>Trend:</span>
                  <span className="font-semibold">{item.changeText}</span>
                </div>

                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    className="flex-1 text-xs font-bold"
                    onClick={() => navigate('/marketplace')}
                  >
                    Buy This Crop
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs font-bold"
                    onClick={() => navigate('/farmer/sell-smart')}
                  >
                    Sell Smart AI
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Historical Trend Chart (6-Month Mandi vs Kisan Direct Realization) */}
      <Card className="border-emerald-100">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                6-Month Price Realization Trend (Nashik Tomato Corridor)
              </CardTitle>
              <CardDescription>
                Comparison of net farmer realization per kg: Traditional Mandi vs Kisan Direct vs Metro Retail Benchmark
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs text-emerald-800 bg-emerald-50 border-emerald-200">
              Audited SIH Trend Data
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={HISTORICAL_PRICE_TRENDS} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis unit="₹" tick={{ fontSize: 11 }} />
                <RechartsTooltip
                  formatter={(value: any, name: any) => [
                    `₹${value}/kg`,
                    name === 'kisanPrice' ? 'Kisan Direct Farmgate' : name === 'mandiPrice' ? 'Traditional Mandi In-Hand' : 'Metro Retail Consumer Price'
                  ]}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB' }}
                />
                <Legend
                  formatter={(value) =>
                    value === 'kisanPrice'
                      ? 'Kisan Direct (Net to Farmer)'
                      : value === 'mandiPrice'
                      ? 'Traditional Mandi (Net to Farmer)'
                      : 'Metro Retail Price'
                  }
                />
                <Line
                  type="monotone"
                  dataKey="kisanPrice"
                  stroke="#16A34A"
                  strokeWidth={3}
                  activeDot={{ r: 6 }}
                  name="kisanPrice"
                />
                <Line
                  type="monotone"
                  dataKey="mandiPrice"
                  stroke="#DC2626"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  name="mandiPrice"
                />
                <Line
                  type="monotone"
                  dataKey="retailPrice"
                  stroke="#2563EB"
                  strokeWidth={2}
                  name="retailPrice"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Price Transparency Simulator */}
      <Card className="border-2 border-emerald-600 bg-white">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 mb-1">
                <Badge variant="success" className="text-[10px] font-bold">
                  Simulate Your Consignment
                </Badge>
              </div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                Interactive Price Breakdown Simulator
              </CardTitle>
              <CardDescription>
                Input your crop price and lot size to see how much more you earn by cutting out middleman deductions.
              </CardDescription>
            </div>
            {/* Input Controls */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto bg-gray-50 p-3 rounded-2xl border">
              <div>
                <label className="text-[11px] font-bold text-gray-600 block mb-1">Crop Price (₹/kg)</label>
                <input
                  type="number"
                  value={calcPrice}
                  min={5}
                  onChange={(e) => setCalcPrice(Math.max(5, Number(e.target.value) || 0))}
                  className="w-28 bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-600 block mb-1">Quantity (kg)</label>
                <input
                  type="number"
                  value={calcVolume}
                  min={100}
                  onChange={(e) => setCalcVolume(Math.max(50, Number(e.target.value) || 0))}
                  className="w-32 bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Traditional Mandi Breakdown */}
            <div className="p-5 rounded-2xl bg-red-50/40 border border-red-200 space-y-3">
              <div className="flex justify-between items-center text-sm font-bold text-red-900">
                <span>Traditional APMC Mandi</span>
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">~48% Drain</span>
              </div>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Gross Consignment Value:</span>
                  <span className="font-semibold text-gray-900">₹{(calcPrice * calcVolume).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Kachha/Pakka Arhtiya Brokerage (38%):</span>
                  <span>- ₹{traditionalDrain.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Mandi Cess, Spoilage & Handling (10%):</span>
                  <span>- ₹{traditionalLoss.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="pt-3 border-t border-red-200 flex justify-between items-center">
                <span className="font-bold text-gray-700 text-sm">Net Farmer In-Hand:</span>
                <span className="text-2xl font-black text-gray-900">₹{traditionalNet.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Kisan Direct Breakdown */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 border-2 border-emerald-600 space-y-3 relative overflow-hidden">
              <div className="flex justify-between items-center text-sm font-bold text-primary">
                <span>Kisan Direct Direct Platform</span>
                <span className="text-xs bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-bold">100% Retained</span>
              </div>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Direct Farmgate Agreed Value:</span>
                  <span className="font-semibold text-gray-900">₹{(calcPrice * calcVolume).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Kisan Direct Platform Fee:</span>
                  <span>₹0.00 (Zero Hidden Cuts)</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Logistics Freight (Billed to Buyer):</span>
                  <span>+ ₹{(calcPrice * 0.10 * calcVolume).toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="pt-3 border-t border-emerald-300 flex justify-between items-center">
                <span className="font-bold text-primary text-sm">Net Farmer Realization:</span>
                <span className="text-2xl font-black text-primary">₹{kisanNet.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-100/60 rounded-xl text-xs text-emerald-900 flex flex-col sm:flex-row justify-between items-center gap-2 border border-emerald-300 font-semibold">
            <span>🎉 Your Estimated Additional Earnings on Kisan Direct:</span>
            <span className="text-base font-black text-emerald-800">
              + ₹{extraGain.toLocaleString('en-IN')} (+{(extraGain / traditionalNet * 100).toFixed(0)}% More Income)
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Bottom CTA Strip */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 rounded-2xl bg-gray-50 border border-gray-200">
        <div>
          <h3 className="font-bold text-base text-gray-900">Ready to sell at true farmgate value?</h3>
          <p className="text-xs text-gray-500">List your harvest lot in 2 minutes. Free registration for farmers and FPOs.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/farmer/sell-smart">
            <Button className="font-bold text-xs">
              <Tractor className="w-4 h-4 mr-1.5" />
              Sell Produce Now
            </Button>
          </Link>
          <Link to="/marketplace">
            <Button variant="outline" className="font-bold text-xs">
              View Marketplace
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
