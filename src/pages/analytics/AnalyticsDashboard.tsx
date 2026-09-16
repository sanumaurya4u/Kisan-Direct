import { useEffect, useState } from 'react';
import { forecastService, type DemandForecast } from '../../features/analytics/forecastService';
import { DemandForecastChart } from './DemandForecastChart';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import {
  TrendingUp,
  BrainCircuit,
  AlertCircle,
  BarChart3,
  Calendar,
  Sparkles,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Supply vs Demand Comparison Dataset (Section 26)
const SUPPLY_DEMAND_DATA = [
  { product: 'Tomato', supply: 8.2, demand: 11.4, deficit: -3.2, status: 'Supply Deficit (-28%)' },
  { product: 'Potato', supply: 9.5, demand: 7.1, deficit: 2.4, status: 'Supply Surplus (+33%)' },
  { product: 'Onion', supply: 6.8, demand: 7.5, deficit: -0.7, status: 'Moderate Deficit (-9%)' },
  { product: 'Wheat', supply: 14.0, demand: 16.8, deficit: -2.8, status: 'Supply Deficit (-16%)' },
  { product: 'Rice', supply: 11.2, demand: 10.5, deficit: 0.7, status: 'Balanced Supply' },
];

export function AnalyticsDashboard() {
  const [forecasts, setForecasts] = useState<DemandForecast[]>([]);
  const [region, setRegion] = useState('Delhi NCR');
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await forecastService.seedDemoForecastsIfEmpty();
        const data = await forecastService.getForecastsForRegion(region);
        setForecasts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [region]);

  const filteredForecasts = selectedCrop === 'all'
    ? forecasts
    : forecasts.filter((f) => f.products?.name.toLowerCase() === selectedCrop.toLowerCase());

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
              <BrainCircuit className="w-5 h-5" />
            </span>
            <Badge variant="success" className="text-xs">AI Forecasting Engine</Badge>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mt-1">
            AI Demand Intelligence & Crop Forecasting
          </h1>
          <p className="text-xs text-gray-500">
            Predictive demand curves based on historical mandi arrivals, wholesale purchasing, and seasonal consumption indices.
          </p>
        </div>

        {/* Region and Crop Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-1.5 bg-white border border-gray-300 rounded-lg px-2.5 py-1 text-xs">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-semibold text-gray-700">Region:</span>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="bg-transparent font-bold text-gray-900 outline-hidden"
            >
              <option value="Delhi NCR">Delhi NCR</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Punjab">Punjab</option>
              <option value="Haryana">Haryana</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5 bg-white border border-gray-300 rounded-lg px-2.5 py-1 text-xs">
            <span className="font-semibold text-gray-700">Crop:</span>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="bg-transparent font-bold text-gray-900 outline-hidden"
            >
              <option value="all">All Commodities</option>
              <option value="Tomato">Tomato</option>
              <option value="Onion">Onion</option>
              <option value="Potato">Potato</option>
              <option value="Wheat">Wheat</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3 Core Metric KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
            <span>Current Month Demand</span>
            <span className="p-1 bg-green-50 text-green-700 rounded-md">
              <BarChart3 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-gray-900">12.4 Tons</div>
          <p className="text-[11px] text-gray-500">
            Based on active procurement contracts in {region}
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
            <span>Predicted 30-Day Demand</span>
            <span className="p-1 bg-emerald-50 text-emerald-700 rounded-md">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-primary">14.7 Tons</div>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center">
            <TrendingUp className="w-3.5 h-3.5 mr-1" /> +18.5% Projected Expansion
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
            <span>Market Imbalance Status</span>
            <span className="p-1 bg-amber-50 text-amber-700 rounded-md">
              <Sparkles className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-amber-700">Supply Deficit</div>
          <p className="text-[11px] text-gray-500">
            Tomato & Onion command deficit premiums
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="py-16">
          <LoadingSpinner text="Running demand projections..." />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Section 25: 6-Month Projected Demand Line / Area Chart */}
          <Card className="border-gray-200 shadow-xs">
            <CardHeader className="pb-2 flex flex-row justify-between items-center">
              <div>
                <CardTitle className="text-base font-bold text-gray-900">
                  6-Month Forward Demand Curve ({region})
                </CardTitle>
                <p className="text-xs text-gray-500 mt-0.5">
                  Light background distinguishes predicted forecast horizon from historical baseline.
                </p>
              </div>
              <Badge variant="outline" className="text-xs">
                Unit: Quintals (100 kg)
              </Badge>
            </CardHeader>
            <CardContent className="pt-4">
              <DemandForecastChart data={filteredForecasts} />
            </CardContent>
          </Card>

          {/* Section 26: Regional Supply vs Demand Deficit Bar Chart */}
          <Card className="border-gray-200 shadow-xs">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Commodity Supply vs Demand Analysis ({region})
                  </CardTitle>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Comparison of available harvest stock against buyer procurement requirements.
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  Illustrative Prototype Model
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-6">
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={SUPPLY_DEMAND_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="product" tick={{ fill: '#475569', fontSize: 12 }} />
                    <YAxis unit=" T" tick={{ fill: '#475569', fontSize: 12 }} />
                    <Tooltip
                      formatter={(val: unknown) => [`${val} Tons`, '']}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Bar dataKey="supply" name="Harvest Supply (Tons)" fill="#166534" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="demand" name="Buyer Demand (Tons)" fill="#D97706" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Data Table Interpretation (Prompt Section 26) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-xs space-y-1">
                  <div className="font-bold text-amber-900">Tomato → Supply Deficit (-3.2 T)</div>
                  <p className="text-gray-600">
                    Demand exceeds regional supply by 28%. Farmers should prioritize immediate dispatch to capture high spot realization.
                  </p>
                </div>
                <div className="p-3 bg-green-50/70 rounded-xl border border-green-200 text-xs space-y-1">
                  <div className="font-bold text-green-900">Potato → Supply Surplus (+2.4 T)</div>
                  <p className="text-gray-600">
                    Harvest supplies exceed immediate procurement by 33%. Stagger sales or leverage cold-chain storage to prevent price drop.
                  </p>
                </div>
                <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 text-xs space-y-1">
                  <div className="font-bold text-blue-900">Onion → Moderate Deficit (-0.7 T)</div>
                  <p className="text-gray-600">
                    Consistent wholesale interest from food processors. Prices expected to remain firm across the next 45 days.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Decision Support Advisory Box */}
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-6 flex items-start space-x-4 shadow-xs">
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <h4 className="font-bold text-emerald-950 text-base">
                Actionable Smart Sourcing & Planting Advisory
              </h4>
              <p className="text-xs text-emerald-900/90 leading-relaxed max-w-4xl">
                Farmers in <strong>{region}</strong> are advised to increase acreage for <strong>Tomato</strong> and <strong>Onion</strong> in the forthcoming planting rotation. Institutional buyers are currently locking forward procurement contracts with <strong>100% net direct payout</strong> and guaranteed farmgate pickup through Kisan Direct logistics partners.
              </p>
              <div className="pt-1 flex items-center space-x-2 text-[11px] text-gray-500">
                <AlertCircle className="w-3.5 h-3.5 text-gray-400" />
                <span>Demonstration Notice: Projections are illustrative demo metrics generated for the SIH 2026 hackathon.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
