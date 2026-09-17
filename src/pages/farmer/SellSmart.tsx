import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  BrainCircuit,
  TrendingUp,
  Users,
  Truck,
  Calculator,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Building2,
  Store,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Badge } from '../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

interface CropAnalysis {
  name: string;
  demandLevel: 'HIGH' | 'VERY HIGH' | 'MODERATE';
  demandBadge: 'success' | 'secondary' | 'outline';
  potentialBuyers: number;
  minPrice: number;
  maxPrice: number;
  recommendedPrice: number;
  unit: string;
  logisticsPerKg: number;
  deficitPercentage: number;
  advice: string;
}

const CROP_DATABASE: Record<string, CropAnalysis> = {
  Tomato: {
    name: 'Tomato',
    demandLevel: 'VERY HIGH',
    demandBadge: 'success',
    potentialBuyers: 8,
    minPrice: 28,
    maxPrice: 34,
    recommendedPrice: 31,
    unit: 'kg',
    logisticsPerKg: 3.2,
    deficitPercentage: 24,
    advice: 'Regional wholesale markets in Delhi NCR face a 24% supply deficit. Sell in lots of 1,000kg+ directly to supermarket retail aggregators.',
  },
  Onion: {
    name: 'Onion',
    demandLevel: 'HIGH',
    demandBadge: 'success',
    potentialBuyers: 12,
    minPrice: 24,
    maxPrice: 28,
    recommendedPrice: 26,
    unit: 'kg',
    logisticsPerKg: 2.8,
    deficitPercentage: 15,
    advice: 'Nashik pink onions have strong forward demand from food processing units in Sahibabad and Okhla.',
  },
  Potato: {
    name: 'Potato',
    demandLevel: 'MODERATE',
    demandBadge: 'secondary',
    potentialBuyers: 6,
    minPrice: 15,
    maxPrice: 18,
    recommendedPrice: 16.5,
    unit: 'kg',
    logisticsPerKg: 2.1,
    deficitPercentage: 5,
    advice: 'Cold-store reserves in Western UP are stabilizing prices. Direct wholesale contracts avoid mandi storage distress fees.',
  },
  Wheat: {
    name: 'Wheat',
    demandLevel: 'HIGH',
    demandBadge: 'success',
    potentialBuyers: 14,
    minPrice: 28,
    maxPrice: 32,
    recommendedPrice: 30,
    unit: 'kg',
    logisticsPerKg: 2.5,
    deficitPercentage: 18,
    advice: 'Institutional flour mills seek cleaned Sharbati grade. Deliver in 5-ton bulk bags for maximum freight density.',
  },
  Apple: {
    name: 'Apple',
    demandLevel: 'HIGH',
    demandBadge: 'success',
    potentialBuyers: 5,
    minPrice: 55,
    maxPrice: 70,
    recommendedPrice: 62,
    unit: 'kg',
    logisticsPerKg: 4.5,
    deficitPercentage: 20,
    advice: 'Grade A Royal Delicious commands a premium in metro retail hypermarkets. Reefer transit is mandatory.',
  },
};

export function SellSmart() {
  const navigate = useNavigate();
  const [selectedCrop, setSelectedCrop] = useState<string>('Tomato');
  const [quantityKg, setQuantityKg] = useState<number>(1500);
  const [location, setLocation] = useState<string>('Nashik, Maharashtra');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analysis = CROP_DATABASE[selectedCrop] || CROP_DATABASE['Tomato'];

  const handleSimulate = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 400);
  };

  const totalCropValue = analysis.recommendedPrice * quantityKg;
  const estimatedFreight = analysis.logisticsPerKg * quantityKg;

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
              <BrainCircuit className="w-5 h-5" />
            </span>
            <Badge variant="fresh" className="text-xs">AI Advisory Engine • भाव सलाहकार</Badge>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-2 tracking-tight">
            Sell Smart — Market Price & Demand Optimizer
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time price discovery based on 90-day wholesale procurement curves and regional supply deficits.
          </p>
        </div>

        <Link to="/analytics">
          <Button variant="outline" className="text-xs">
            <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
            View Historical Demand Curves
          </Button>
        </Link>
      </div>

      {/* Input Parameters Form Card */}
      <Card className="border-gray-200/80 shadow-kisan-card rounded-2xl overflow-hidden bg-white">
        <CardHeader className="bg-emerald-50/50 border-b border-emerald-100/60 pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-primary" />
              Specify Your Harvest Parameters (फसल और मात्रा चुनें)
            </CardTitle>
            {/* Quick Crop Selector Pills */}
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(CROP_DATABASE).map((crop) => (
                <button
                  key={crop}
                  type="button"
                  onClick={() => {
                    setSelectedCrop(crop);
                    handleSimulate();
                  }}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                    selectedCrop === crop
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-primary/50'
                  }`}
                >
                  {crop}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <Label htmlFor="cropSelect" className="font-semibold text-gray-700 text-xs uppercase tracking-wider">
                Crop / Commodity
              </Label>
              <select
                id="cropSelect"
                value={selectedCrop}
                onChange={(e) => {
                  setSelectedCrop(e.target.value);
                  handleSimulate();
                }}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm bg-white font-semibold text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                {Object.keys(CROP_DATABASE).map((crop) => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="harvestQuantity" className="font-semibold text-gray-700 text-xs uppercase tracking-wider">
                Harvest Volume ({analysis.unit})
              </Label>
              <Input
                id="harvestQuantity"
                type="number"
                value={quantityKg}
                onChange={(e) => setQuantityKg(Math.max(10, Number(e.target.value) || 0))}
                className="h-10 text-base font-bold text-gray-900"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="farmLocation" className="font-semibold text-gray-700 text-xs uppercase tracking-wider">
                Farmgate Location
              </Label>
              <Input
                id="farmLocation"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-10 text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Market Analysis Results */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-emerald-600" />
            AI Market Analysis: {analysis.name}
          </h2>
          <span className="text-xs text-gray-500 font-mono bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {isAnalyzing ? 'Recalculating...' : 'Confidence: 93.4% • Active Algorithm'}
          </span>
        </div>

        {/* 4 Summary Stat Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Demand Level */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-kisan-card space-y-2 hover:shadow-kisan-hover transition-all">
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Regional Demand Level</div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-black text-gray-900">{analysis.demandLevel}</span>
              <Badge variant={analysis.demandBadge} className="text-xs">
                +{analysis.deficitPercentage}% Deficit
              </Badge>
            </div>
            <p className="text-[11px] text-emerald-700 font-semibold">
              High buyer bidding pressure
            </p>
          </div>

          {/* Card 2: Potential Buyers */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-kisan-card space-y-2 hover:shadow-kisan-hover transition-all">
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Active Procurement Buyers</div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-black text-gray-900">{analysis.potentialBuyers}</span>
              <span className="text-xs text-gray-400">within 150 km</span>
            </div>
            <p className="text-[11px] text-gray-500 flex items-center">
              <Users className="w-3.5 h-3.5 mr-1 text-blue-600 shrink-0" />
              Retail chains & food processors
            </p>
          </div>

          {/* Card 3: Expected Price Range */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-kisan-card space-y-2 hover:shadow-kisan-hover transition-all">
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Optimal Price Range</div>
            <div className="text-xl font-bold text-primary">
              ₹{analysis.minPrice} – ₹{analysis.maxPrice} <span className="text-xs text-gray-500 font-normal">/ kg</span>
            </div>
            <p className="text-[11px] text-gray-600">
              Target: <strong className="text-emerald-700 font-bold">₹{analysis.recommendedPrice}/kg</strong>
            </p>
          </div>

          {/* Card 4: Estimated Freight */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-kisan-card space-y-2 hover:shadow-kisan-hover transition-all">
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Estimated Freight Cost</div>
            <div className="text-xl font-bold text-gray-800">
              ₹{analysis.logisticsPerKg.toFixed(2)} <span className="text-xs text-gray-500 font-normal">/ kg</span>
            </div>
            <p className="text-[11px] text-gray-500 flex items-center">
              <Truck className="w-3.5 h-3.5 mr-1 text-amber-600 shrink-0" />
              Direct farmgate pickup rate
            </p>
          </div>
        </div>

        {/* Actionable Advice & Distribution Strategy */}
        <div className="bg-gradient-to-r from-emerald-50 via-[#F0FDF4] to-green-50 border border-emerald-200/80 rounded-2xl p-6 sm:p-7 space-y-5 shadow-xs">
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-gray-900 text-base">Strategic Selling Recommendation</h3>
              <p className="text-xs sm:text-sm text-gray-700 mt-1 leading-relaxed">{analysis.advice}</p>
            </div>
          </div>

          {/* Recommended Buyer Distribution Breakdown */}
          <div className="pt-4 border-t border-emerald-200/60">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
              Recommended Harvest Allocation Strategy
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-800 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-blue-600" /> Retail Chains (60%)
                  </span>
                  <span className="font-bold text-primary">₹{analysis.recommendedPrice}/kg</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Allocate {(quantityKg * 0.6).toFixed(0)} kg to institutional supermarkets for stable cashflow.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-800 flex items-center gap-1.5">
                    <Store className="w-4 h-4 text-amber-600" /> Food Processors (30%)
                  </span>
                  <span className="font-bold text-gray-700">₹{(analysis.recommendedPrice - 1.5).toFixed(1)}/kg</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Allocate {(quantityKg * 0.3).toFixed(0)} kg to processing units with zero grading rejection.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-800 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-purple-600" /> Spot Marketplace (10%)
                  </span>
                  <span className="font-bold text-emerald-600">₹{(analysis.recommendedPrice + 2).toFixed(1)}/kg</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Keep {(quantityKg * 0.1).toFixed(0)} kg buffer for retail consumer orders at peak spot rates.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Realization Summary and Publishing CTA */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-7 shadow-kisan-card flex flex-col md:flex-row justify-between items-center gap-5">
          <div>
            <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
              Simulated Consignment Value ({quantityKg.toLocaleString('en-IN')} kg)
            </div>
            <div className="text-3xl font-black text-primary mt-0.5">
              ₹{totalCropValue.toLocaleString('en-IN')}
              <span className="text-xs text-gray-500 font-normal ml-2 block sm:inline">
                (Est. Logistics: ₹{estimatedFreight.toLocaleString('en-IN')} • ₹0 Commission)
              </span>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full md:w-auto h-12 px-6 shadow-kisan-hover font-bold text-sm"
            onClick={() => navigate('/farmer/dashboard/listings/new')}
          >
            Publish Listing at Recommended ₹{analysis.recommendedPrice}/kg
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Footnote */}
        <div className="flex items-center space-x-2 text-[11px] text-gray-400 justify-center">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>
            Demonstration Note: AI price recommendations are generated using synthetic 90-day wholesale indices.
          </span>
        </div>
      </div>
    </div>
  );
}
