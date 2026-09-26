import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Truck,
  Tractor,
  ShoppingCart,
  ArrowRight,
  CheckCircle2,
  Calculator,
  Sprout,
  ShieldCheck,
  Star,
  ChevronRight,
  Scale,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { supabase } from '../../lib/supabase';

export function Home() {
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState<string | null>(null);

  const handleDemoLogin = async (email: string, targetPath: string) => {
    setIsLoggingIn(email);
    try {
      await supabase.auth.signInWithPassword({
        email,
        password: 'Demo@1234',
      });
      navigate(targetPath);
    } catch (err) {
      console.error('Demo login error', err);
      navigate(targetPath);
    } finally {
      setIsLoggingIn(null);
    }
  };

  // Interactive Price Ledger Simulator State
  const [cropPrice, setCropPrice] = useState<number>(30); // ₹ per kg
  const [calcQuantity, setCalcQuantity] = useState<number>(1000); // kg

  // Traditional Mandi vs Kisan Direct Calculation
  const traditionalFarmerShare = cropPrice * 0.52; // Farmer gets only ~52% in traditional supply chain
  const traditionalIntermediaryMargin = cropPrice * 0.38;
  const traditionalLogisticsLoss = cropPrice * 0.10;

  const kisanFarmerShare = cropPrice; // Farmer gets 100% of agreed price
  const kisanLogisticsEst = cropPrice * 0.10; // ~10% estimated freight

  return (
    <div className="flex flex-col gap-16 md:gap-24 py-4 md:py-8 max-w-7xl mx-auto px-4 sm:px-6">
      {/* 1. HERO SECTION (Inspired by Farmiq & EcoFarm) */}
      <section className="relative overflow-hidden rounded-3xl md:rounded-[2.5rem] bg-[#14532D] text-white p-6 sm:p-10 md:p-14 lg:p-16 shadow-2xl border border-emerald-800/60">
        {/* Subtle background ambient gradients & leaf pattern */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-fresh/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column (Content & CTAs) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center space-x-2 bg-emerald-950/60 border border-emerald-400/30 px-3.5 py-1.5 rounded-full text-xs text-emerald-200">
              <Sprout className="w-4 h-4 text-fresh" />
              <span className="font-semibold tracking-wide">From Kisan to Customer — Direct & Fair</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white">
              India's Farmers, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-fresh to-emerald-200">
                Directly Connected
              </span> <br />
              to You.
            </h1>

            {/* Supporting Subtitle */}
            <p className="text-base sm:text-lg text-emerald-100/90 max-w-xl leading-relaxed font-normal">
              Buy fresh produce directly from farmers and FPOs. Help farmers earn up to 50% better returns while you receive top quality produce at fair, transparent prices.
            </p>

            {/* Dual CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Button
                size="lg"
                className="bg-fresh hover:bg-fresh-hover text-slate-950 font-black h-13 px-8 text-base shadow-lg hover:shadow-xl rounded-2xl group flex items-center justify-center"
                onClick={() => navigate('/marketplace')}
              >
                <span>Explore Marketplace</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border-white/25 h-13 px-8 text-base backdrop-blur-xs rounded-2xl flex items-center justify-center font-bold"
                onClick={() => navigate('/farmer/sell-smart')}
              >
                <Tractor className="w-5 h-5 mr-2 text-emerald-300" />
                <span>Sell Your Produce</span>
              </Button>
            </div>

            {/* Trust Highlights Strip */}
            <div className="pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div>
                <div className="text-2xl font-black text-white">1,000+</div>
                <div className="text-xs text-emerald-200/80 font-medium">Farmers Connected</div>
              </div>
              <div>
                <div className="text-2xl font-black text-white">50+</div>
                <div className="text-xs text-emerald-200/80 font-medium">Crop Varieties</div>
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-300">0%</div>
                <div className="text-xs text-emerald-200/80 font-medium">Middleman Fees</div>
              </div>
              <div>
                <div className="text-2xl font-black text-white">100%</div>
                <div className="text-xs text-emerald-200/80 font-medium">Direct Settlement</div>
              </div>
            </div>
          </div>

          {/* Right Column (Hero Imagery & Floating Stat Cards) */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md lg:max-w-none">
              {/* Primary Image with Rounded Bevel */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-emerald-700/40 aspect-4/3 sm:aspect-square bg-emerald-900">
                <img
                  src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=900&auto=format&fit=crop&q=80"
                  alt="Indian farmer in agricultural field"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Embedded Caption */}
                <div className="absolute bottom-4 left-4 right-4 text-white text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-300 font-bold mb-0.5">
                    <ShieldCheck className="w-4 h-4" />
                    Verified Farmer Lot
                  </div>
                  <p className="text-[11px] text-white/90">
                    Nashik & Pune Region • Direct from Farmgate
                  </p>
                </div>
              </div>

              {/* Floating Card Top-Right: Chemical Free & Fair Guarantee */}
              <div className="absolute -top-4 -right-2 sm:-right-4 bg-white text-slate-900 p-3 sm:p-4 rounded-2xl shadow-xl border border-emerald-100 flex items-center space-x-3 animate-in fade-in duration-500 max-w-[210px]">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-primary flex items-center justify-center flex-shrink-0">
                  <Scale className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <div className="text-xs font-black text-gray-900">100% Direct</div>
                  <div className="text-[10px] text-gray-500 font-medium">Zero hidden cuts or agent fees</div>
                </div>
              </div>

              {/* Floating Card Bottom-Left: Farmer Community Badge */}
              <div className="absolute -bottom-5 -left-2 sm:-left-4 bg-white text-slate-900 p-3 sm:p-4 rounded-2xl shadow-xl border border-emerald-100 flex items-center space-x-3 max-w-[230px]">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
                  <Tractor className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <div className="text-xs font-black text-gray-900">1,000+ Kisans</div>
                  <div className="text-[10px] text-gray-500 font-medium">Across Maharashtra, Punjab & UP</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS & IMPACT STRIP (Inspired by Reference) */}
      <section className="bg-white rounded-2xl md:rounded-3xl border border-emerald-100 p-6 md:p-8 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
          <div className="pt-2 md:pt-0">
            <div className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight">1,000+</div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Farmers Connected</div>
            <div className="text-[11px] text-emerald-600 mt-0.5">Across 42 FPO federations</div>
          </div>
          <div className="pt-4 md:pt-0">
            <div className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight">₹0</div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Platform Commission</div>
            <div className="text-[11px] text-emerald-600 mt-0.5">Free for farmers & growers</div>
          </div>
          <div className="pt-4 md:pt-0">
            <div className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight">100%</div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Farmer Realization</div>
            <div className="text-[11px] text-emerald-600 mt-0.5">Direct to bank account</div>
          </div>
          <div className="pt-4 md:pt-0">
            <div className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight">48 Hrs</div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Farmgate Dispatch</div>
            <div className="text-[11px] text-emerald-600 mt-0.5">Optimized cold-chain transit</div>
          </div>
        </div>
      </section>

      {/* 3. SERVICES / FEATURES SECTION: "Everything a [Kisan] Needs" */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-1.5">
            <span className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              Everything a
            </span>
            <span className="pill-highlight text-xl sm:text-2xl md:text-3xl font-black">
              Kisan
            </span>
            <span className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              Needs
            </span>
          </div>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            From direct harvest listings to AI price forecasts and cold-chain logistics, we provide everything needed to eliminate middleman losses.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Service Card 1: Sell Your Produce */}
          <div className="bg-white p-6 rounded-2xl border border-emerald-100/80 shadow-kisan-card hover:shadow-kisan-hover transition-all duration-300 hover:-translate-y-1 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-primary flex items-center justify-center font-bold text-xl">
              🌾
            </div>
            <h3 className="text-lg font-bold text-gray-900">Sell Your Produce</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              List harvested crops with photos, grade, quantity, and your desired price. Connect directly with institutional and retail buyers.
            </p>
            <div className="pt-2">
              <Link to="/farmer/sell-smart" className="text-xs font-bold text-primary flex items-center hover:underline">
                Explore Selling Tools <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>

          {/* Service Card 2: Buy Fresh Produce */}
          <div className="bg-white p-6 rounded-2xl border border-emerald-100/80 shadow-kisan-card hover:shadow-kisan-hover transition-all duration-300 hover:-translate-y-1 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl">
              🛒
            </div>
            <h3 className="text-lg font-bold text-gray-900">Buy Fresh Produce</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Discover freshly harvested crops directly from verified farmers and FPOs with zero intermediate commissions or hidden fees.
            </p>
            <div className="pt-2">
              <Link to="/marketplace" className="text-xs font-bold text-primary flex items-center hover:underline">
                Browse Marketplace <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>

          {/* Service Card 3: Market Prices & Sell Smart */}
          <div className="bg-white p-6 rounded-2xl border border-emerald-100/80 shadow-kisan-card hover:shadow-kisan-hover transition-all duration-300 hover:-translate-y-1 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl">
              📈
            </div>
            <h3 className="text-lg font-bold text-gray-900">Market Prices & Forecasts</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Understand current crop prices and 90-day wholesale demand curves. Our AI engine guides you on when and where to sell.
            </p>
            <div className="pt-2">
              <Link to="/prices" className="text-xs font-bold text-primary flex items-center hover:underline">
                View Price Benchmarks <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>

          {/* Service Card 4: Direct Connection */}
          <div className="bg-white p-6 rounded-2xl border border-emerald-100/80 shadow-kisan-card hover:shadow-kisan-hover transition-all duration-300 hover:-translate-y-1 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-xl">
              🤝
            </div>
            <h3 className="text-lg font-bold text-gray-900">Direct Connection & AI Match</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Connect farmers and buyers without unnecessary layers of middlemen. Direct communication and automated requirement matching.
            </p>
            <div className="pt-2">
              <Link to="/ai-match" className="text-xs font-bold text-primary flex items-center hover:underline">
                Explore AI Match Studio <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>

          {/* Service Card 5: Farmgate Logistics */}
          <div className="bg-white p-6 rounded-2xl border border-emerald-100/80 shadow-kisan-card hover:shadow-kisan-hover transition-all duration-300 hover:-translate-y-1 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xl">
              🚚
            </div>
            <h3 className="text-lg font-bold text-gray-900">Delivery & Farmgate Logistics</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Orders automatically trigger pickup by verified fleet partners. Real-time GPS map tracking and temperature-monitored transit.
            </p>
            <div className="pt-2">
              <Link to="/logistics" className="text-xs font-bold text-primary flex items-center hover:underline">
                Fleet & Route Map Details <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>

          {/* Service Card 6: Fair Pricing */}
          <div className="bg-white p-6 rounded-2xl border border-emerald-100/80 shadow-kisan-card hover:shadow-kisan-hover transition-all duration-300 hover:-translate-y-1 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-yellow-100 text-yellow-800 flex items-center justify-center font-bold text-xl">
              💰
            </div>
            <h3 className="text-lg font-bold text-gray-900">100% Fair Pricing</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Every rupee is transparently accounted for. Transparent price ledger ensures 0% hidden commissions and 100% net farmer realization.
            </p>
            <div className="pt-2">
              <a href="#simulator" className="text-xs font-bold text-primary flex items-center hover:underline">
                Try Price Simulator <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE PRICE TRANSPARENCY SIMULATOR (Preserves Full Simulator Logic) */}
      <section id="simulator" className="space-y-6">
        <div className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div>
              <div className="inline-flex items-center space-x-1.5 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Interactive Simulator
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2.5">
                <Calculator className="w-7 h-7 text-primary" />
                Price Transparency Ledger
              </h2>
              <p className="text-sm text-gray-500 mt-1 max-w-xl">
                Compare your actual in-hand return under traditional multi-tier APMC Mandis versus the direct Kisan Direct platform.
              </p>
            </div>

            {/* Inputs Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto bg-gray-50 p-4 rounded-2xl border border-gray-200/80">
              <div className="w-full sm:w-44">
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Crop Price (₹/kg)
                </label>
                <input
                  type="number"
                  value={cropPrice}
                  onChange={(e) => setCropPrice(Math.max(5, Number(e.target.value) || 0))}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="w-full sm:w-44">
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Consignment (kg)
                </label>
                <input
                  type="number"
                  value={calcQuantity}
                  onChange={(e) => setCalcQuantity(Math.max(50, Number(e.target.value) || 0))}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Comparison Split Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Traditional Mandi Card */}
            <div className="p-6 rounded-2xl border border-red-200 bg-red-50/30 space-y-4">
              <div className="flex justify-between items-center text-sm font-bold text-gray-800">
                <span className="flex items-center gap-1.5 text-red-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  Traditional APMC Mandi Channel
                </span>
                <Badge variant="destructive" className="text-xs font-bold">~48% Value Drain</Badge>
              </div>

              <div className="space-y-2.5 text-xs text-gray-600 pt-2">
                <div className="flex justify-between">
                  <span>Consumer / Wholesale Gross Value</span>
                  <span className="font-semibold text-gray-800">₹{(cropPrice * calcQuantity).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Agent Commissions & Brokerage (38%)</span>
                  <span>- ₹{(traditionalIntermediaryMargin * calcQuantity).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Loading, Mandi Cess & Spoilage (10%)</span>
                  <span>- ₹{(traditionalLogisticsLoss * calcQuantity).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-red-200 flex justify-between items-center text-sm">
                <span className="font-bold text-gray-700">Net Farmer In-Hand:</span>
                <span className="text-2xl font-black text-gray-800">
                  ₹{(traditionalFarmerShare * calcQuantity).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Kisan Direct Card */}
            <div className="p-6 rounded-2xl border-2 border-emerald-600 bg-emerald-50/50 space-y-4 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                Recommended
              </div>

              <div className="flex justify-between items-center text-sm font-bold text-primary">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-fresh" />
                  Kisan Direct Platform
                </span>
                <Badge variant="success" className="text-xs font-bold">0% Platform Fee</Badge>
              </div>

              <div className="space-y-2.5 text-xs text-gray-600 pt-2">
                <div className="flex justify-between">
                  <span>Agreed Direct Farmgate Price</span>
                  <span className="font-semibold text-gray-900">₹{(cropPrice * calcQuantity).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Kisan Direct Platform Commission</span>
                  <span>₹0.00 (Zero Hidden Cuts)</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Logistics Cost (Directly billed to buyer)</span>
                  <span>+ ₹{(kisanLogisticsEst * calcQuantity).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-emerald-200 flex justify-between items-center text-sm">
                <span className="font-bold text-primary">Net Farmer Realization:</span>
                <span className="text-3xl font-black text-primary">
                  ₹{(kisanFarmerShare * calcQuantity).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW KISAN DIRECT WORKS (4-Step Visual Process) */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-1.5">
            <span className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              How
            </span>
            <span className="pill-highlight text-xl sm:text-2xl md:text-3xl font-black">
              Kisan Direct
            </span>
            <span className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              Works
            </span>
          </div>
          <p className="text-sm text-gray-500 max-w-xl mx-auto">
            A simple 4-step process connecting India's agricultural supply chain directly from farm to fork.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm relative space-y-4 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-primary flex items-center justify-center font-black text-lg">
              1
            </div>
            <h3 className="text-base font-bold text-gray-900">Register & Profile</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Create your profile as a Farmer, FPO, Consumer, or Bulk Buyer. Verified badges establish immediate credibility.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm relative space-y-4 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-primary flex items-center justify-center font-black text-lg">
              2
            </div>
            <h3 className="text-base font-bold text-gray-900">List or Discover</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Farmers list produce lots with photos, quantity, and grade. Buyers publish procurement requirements.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm relative space-y-4 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-primary flex items-center justify-center font-black text-lg">
              3
            </div>
            <h3 className="text-base font-bold text-gray-900">AI Match & Connect</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Our 6-factor heuristic match engine pairs compatible farmer harvest lots with verified buyer purchase demand.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm relative space-y-4 hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-primary flex items-center justify-center font-black text-lg">
              4
            </div>
            <h3 className="text-base font-bold text-gray-900">Trade & Dispatch</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Automated logistics dispatch assigns vehicles for farmgate pickup, route tracking, and escrow settlement.
            </p>
          </div>
        </div>
      </section>

      {/* 6. THE PROBLEM VS KISAN DIRECT SOLUTION */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* The Problem */}
        <div className="bg-red-50/40 border border-red-200 rounded-3xl p-6 sm:p-8 space-y-4">
          <Badge variant="destructive" className="text-xs font-bold px-3 py-1">
            Current Agriculture Reality
          </Badge>
          <h3 className="text-xl sm:text-2xl font-black text-gray-900">
            The Middleman Trap in Traditional Mandis
          </h3>
          <ul className="space-y-3.5 text-xs sm:text-sm text-gray-700">
            <li className="flex items-start">
              <span className="text-red-500 font-black mr-2.5 text-base">✕</span>
              <span><strong>4 to 6 Intermediaries:</strong> Village aggregators, kachha arhtiyas, and commission brokers take cuts at every step.</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 font-black mr-2.5 text-base">✕</span>
              <span><strong>Only 40–50% Farmer Realization:</strong> Farmers receive less than half of the price paid by consumers in metro retail.</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 font-black mr-2.5 text-base">✕</span>
              <span><strong>25–30% Post-Harvest Losses:</strong> Uncoordinated logistics and lack of farmgate cold transit result in massive wastage.</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 font-black mr-2.5 text-base">✕</span>
              <span><strong>Information Asymmetry:</strong> Farmers have no visibility into wholesale demand trends before harvest.</span>
            </li>
          </ul>
        </div>

        {/* The Solution */}
        <div className="bg-emerald-50/50 border border-emerald-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <Badge variant="success" className="text-xs font-bold px-3 py-1">
            The Kisan Direct Solution
          </Badge>
          <h3 className="text-xl sm:text-2xl font-black text-gray-900">
            Transparent, Disintermediated Commerce
          </h3>
          <ul className="space-y-3.5 text-xs sm:text-sm text-gray-700">
            <li className="flex items-start">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2.5 flex-shrink-0 mt-0.5" />
              <span><strong>Direct Marketplace:</strong> Verified buyers and consumers purchase directly from farmer and FPO listings.</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2.5 flex-shrink-0 mt-0.5" />
              <span><strong>100% Net Realization:</strong> Transparent price ledgers ensure 0% commission deducted from the farmer.</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2.5 flex-shrink-0 mt-0.5" />
              <span><strong>Farmgate Cold-Chain Dispatch:</strong> Orders automatically trigger GPS-optimized pickup jobs right from the farm.</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2.5 flex-shrink-0 mt-0.5" />
              <span><strong>AI Demand Forecasting:</strong> 90-day predictive curves guide farmers on high-demand deficit commodities.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 7. FARMER STORIES / TRUST SECTION: "What Our [Farmers] Say" */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-1.5">
            <span className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              What Our
            </span>
            <span className="pill-highlight text-xl sm:text-2xl md:text-3xl font-black">
              Farmers
            </span>
            <span className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              Say
            </span>
          </div>
          <p className="text-sm text-gray-500 max-w-xl mx-auto">
            Real stories of Indian smallholders who have transformed their income through direct selling.
          </p>
        </div>

        {/* Featured Testimonial Banner (Inspired by EcoFarm reference) */}
        <div className="bg-[#F0FDF4] border border-emerald-200 rounded-3xl p-6 sm:p-10 md:p-12 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Farmer Photo */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-lg border-2 border-emerald-300/60 aspect-4/3 bg-emerald-900">
                <img
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80"
                  alt="Ramesh Patel, Indian farmer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-bold text-emerald-800 shadow-xs">
                  🌾 Verified Kisan
                </div>
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="md:col-span-7 space-y-4 text-left">
              <div className="flex items-center space-x-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400" />
                ))}
              </div>

              <blockquote className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
                "Direct selling through Kisan Direct helps us reach retail supermarket chains without depending on traditional mandi middlemen. We listed 50 quintals of hybrid tomatoes and received 100% of our asking price directly to our bank account within 24 hours."
              </blockquote>

              <div className="pt-2 border-t border-emerald-200">
                <div className="font-extrabold text-base text-gray-900">Ramesh Patel</div>
                <div className="text-xs text-gray-600">Patel Agro Farms • Nashik, Maharashtra (5.5 Acres)</div>
                <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                  Increased net harvest realization by +44%
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. DEDICATED PORTALS FOR SUPPLY CHAIN PARTICIPANTS */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Dedicated Portals for Every Participant
          </h2>
          <p className="text-sm text-gray-500">
            Purpose-built workflows tailored for Indian agricultural realities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Farmer & FPO */}
          <Card className="hover:shadow-lg transition-all duration-300 border-t-4 border-t-emerald-600 rounded-2xl flex flex-col justify-between">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-primary flex items-center justify-center">
                <Tractor className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Farmers & FPO Co-operatives</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                List harvested lots directly, view regional buyer demand before harvest, and access AI-driven "Sell Smart" price optimization.
              </p>
              <div className="pt-2 space-y-2">
                <Button
                  className="w-full font-bold cursor-pointer"
                  disabled={isLoggingIn === 'farmer@kisandirect.com'}
                  onClick={() => handleDemoLogin('farmer@kisandirect.com', '/farmer/dashboard')}
                >
                  {isLoggingIn === 'farmer@kisandirect.com' ? 'Logging In...' : '🌾 1-Click Demo Farmer'}
                </Button>
                <Button
                  variant="outline"
                  className="w-full font-semibold text-xs border-emerald-300 text-emerald-800 hover:bg-emerald-50 cursor-pointer"
                  onClick={() => navigate('/register?role=farmer')}
                >
                  Register as Farmer
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Bulk Buyers */}
          <Card className="hover:shadow-lg transition-all duration-300 border-t-4 border-t-blue-600 rounded-2xl flex flex-col justify-between">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Institutional & Bulk Buyers</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Post purchase requirements for retail hypermarkets or food processing units. Connect with verified farmer lots with live match scoring.
              </p>
              <div className="pt-2 space-y-2">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                  disabled={isLoggingIn === 'buyer@kisandirect.com'}
                  onClick={() => handleDemoLogin('buyer@kisandirect.com', '/buyer/dashboard')}
                >
                  {isLoggingIn === 'buyer@kisandirect.com' ? 'Logging In...' : '🛒 1-Click Demo Buyer'}
                </Button>
                <Button
                  variant="outline"
                  className="w-full font-semibold text-xs border-blue-300 text-blue-800 hover:bg-blue-50 cursor-pointer"
                  onClick={() => navigate('/register?role=bulk_buyer')}
                >
                  Register as Buyer
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Logistics Partners */}
          <Card className="hover:shadow-lg transition-all duration-300 border-t-4 border-t-amber-600 rounded-2xl flex flex-col justify-between">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Logistics & Fleet Partners</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Register vehicles (Tata 407, Bolero Maxi, Reefer), accept automated farmgate pickup jobs, and visualize Leaflet map routes.
              </p>
              <div className="pt-2 space-y-2">
                <Button
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold cursor-pointer"
                  disabled={isLoggingIn === 'logistics@kisandirect.com'}
                  onClick={() => handleDemoLogin('logistics@kisandirect.com', '/logistics/dashboard')}
                >
                  {isLoggingIn === 'logistics@kisandirect.com' ? 'Logging In...' : '🚚 1-Click Demo Fleet'}
                </Button>
                <Button
                  variant="outline"
                  className="w-full font-semibold text-xs border-amber-300 text-amber-800 hover:bg-amber-50 cursor-pointer"
                  onClick={() => navigate('/logistics')}
                >
                  View Fleet & Route Map
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 9. FINAL CALL TO ACTION BANNER */}
      <section className="bg-gradient-to-r from-[#14532D] via-emerald-800 to-[#14532D] rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ready to Experience Fair Agricultural Trade?
          </h2>
          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
            Join thousands of farmers, FPOs, and verified buyers already transacting directly on Kisan Direct. Zero commission, full transparency.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <Button
              size="lg"
              className="bg-fresh hover:bg-fresh-hover text-slate-950 font-black h-12 px-6 rounded-xl shadow-md cursor-pointer"
              onClick={() => navigate('/marketplace')}
            >
              Browse Fresh Marketplace
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/30 h-12 px-6 rounded-xl font-bold cursor-pointer"
              onClick={() => navigate('/register?role=farmer')}
            >
              Register as Farmer
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/30 h-12 px-6 rounded-xl font-bold cursor-pointer"
              onClick={() => navigate('/register?role=bulk_buyer')}
            >
              Register as Buyer
            </Button>
          </div>
        </div>
      </section>

      {/* 10. Prototype Metrics Disclaimer */}
      <section className="text-center text-xs text-gray-400 max-w-xl mx-auto pb-4">
        <p>
          Prototype Demonstration: All transaction curves, match scores, demand indices, and route simulations are illustrative demo data for Smart India Hackathon.
        </p>
      </section>
    </div>
  );
}
