import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Truck,
  Tractor,
  ShoppingCart,
  ArrowRight,
  CheckCircle2,
  Calculator,
  Zap,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export function Home() {
  const navigate = useNavigate();

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
    <div className="flex flex-col gap-16 py-4">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-900 via-primary to-emerald-900 text-white px-6 py-16 md:py-24 shadow-xl">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-xs font-semibold tracking-wide text-primary-light">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Smart India Hackathon 2026 Prototype — Problem Statement #26033</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            From Farm to Market, <br className="hidden sm:inline" />
            <span className="text-emerald-300">Directly.</span>
          </h1>

          <p className="text-lg md:text-xl text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
            Connect farmers and FPOs directly with consumers and bulk buyers, while AI helps forecast demand and optimize farmgate logistics.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Button
              size="lg"
              className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold h-12 px-8 shadow-lg text-base w-full sm:w-auto"
              onClick={() => navigate('/marketplace')}
            >
              Explore Marketplace
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/30 h-12 px-8 text-base w-full sm:w-auto backdrop-blur-xs"
              onClick={() => navigate('/about')}
            >
              How Kisan Direct Works
            </Button>
          </div>

          {/* Quick Stat Highlights */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-white/15 max-w-3xl mx-auto text-left">
            <div>
              <div className="text-2xl md:text-3xl font-bold text-white">0%</div>
              <div className="text-xs text-emerald-200">Platform Commission</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-white">100%</div>
              <div className="text-xs text-emerald-200">Net Farmer Realization</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-white">6-Factor</div>
              <div className="text-xs text-emerald-200">AI Supply-Demand Match</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-white">Farmgate</div>
              <div className="text-xs text-emerald-200">Logistics Routing</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Visual Supply Chain Flow Diagram */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-2 text-xs font-semibold uppercase tracking-wider">
            Intelligent Pipeline
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            How Kisan Direct Transforms the Food Supply Chain
          </h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto mt-2">
            Disintermediating traditional multi-tier APMC mandi trading through intelligent digital coordination.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center text-center">
            {/* Step 1: Farmer / FPO */}
            <div className="flex flex-col items-center p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center mb-3 shadow-sm">
                <Tractor className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm">1. Farmer / FPO</h3>
              <p className="text-xs text-gray-500 mt-1">Publishes harvested produce directly at farmgate price.</p>
            </div>

            {/* Arrow 1 */}
            <div className="hidden md:flex justify-center text-gray-300">
              <ArrowRight className="w-6 h-6" />
            </div>

            {/* Step 2: Kisan Direct Platform & AI */}
            <div className="flex flex-col items-center p-4 bg-emerald-50 rounded-xl border border-emerald-300 ring-2 ring-emerald-500/20 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-3 shadow-sm">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm">2. AI Match Engine</h3>
              <p className="text-xs text-gray-500 mt-1">Multi-factor heuristic matching (Score 90%+) with price transparency.</p>
            </div>

            {/* Arrow 2 */}
            <div className="hidden md:flex justify-center text-gray-300">
              <ArrowRight className="w-6 h-6" />
            </div>

            {/* Step 3: Optimized Logistics & Delivery */}
            <div className="flex flex-col items-center p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center mb-3 shadow-sm">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm">3. Smart Logistics</h3>
              <p className="text-xs text-gray-500 mt-1">Farmgate pickup, reefer fleet routing, and GPS delivery tracking.</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-3">
            <span className="flex items-center text-emerald-700 font-semibold">
              <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
              End-to-End Traceability & Transparent Escrow Settlement
            </span>
            <span className="text-gray-400">
              Direct connection to Retailers, Processing Units, and Consumers
            </span>
          </div>
        </div>
      </section>

      {/* 3. The Problem vs Kisan Direct Solution */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* The Problem */}
          <div className="bg-red-50/50 border border-red-200 rounded-2xl p-6 md:p-8">
            <div className="inline-flex items-center space-x-1.5 bg-red-100 text-red-800 text-xs font-bold px-2.5 py-1 rounded-full mb-4">
              <span>Current Problem</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">The Middleman Trap in Agriculture</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-red-500 font-bold mr-2 text-base">✕</span>
                <span><strong>4 to 6 Intermediaries:</strong> Village aggregators, commission agents, wholesalers, and semi-wholesalers dilute value.</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 font-bold mr-2 text-base">✕</span>
                <span><strong>Only 40–50% Realization:</strong> Farmers often receive less than half of what end consumers pay in retail.</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 font-bold mr-2 text-base">✕</span>
                <span><strong>25–30% Post-Harvest Loss:</strong> Fragmented logistics and poor cold-chain coordination cause massive spoilage.</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 font-bold mr-2 text-base">✕</span>
                <span><strong>Information Asymmetry:</strong> Farmers have zero visibility into wholesale demand trends before planting.</span>
              </li>
            </ul>
          </div>

          {/* The Solution */}
          <div className="bg-emerald-50/60 border border-emerald-300 rounded-2xl p-6 md:p-8">
            <div className="inline-flex items-center space-x-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full mb-4">
              <span>The Kisan Direct Solution</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Transparent, Disintermediated Commerce</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                <span><strong>Zero Middlemen:</strong> Verified institutional buyers and consumers transact directly with farmer/FPO listings.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                <span><strong>100% Crop Value Retained:</strong> Transparent price ledgers ensure 0% hidden commissions.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                <span><strong>Automated Dispatch & Routing:</strong> Orders automatically spawn logistics jobs with map-optimized corridors.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                <span><strong>AI Demand Forecasting:</strong> Predictive trends inform farmers what crops will command deficit premiums.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Interactive Price Transparency Simulator */}
      <section className="container mx-auto px-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <Badge variant="outline" className="mb-1 text-xs">Phase 10 Feature</Badge>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Calculator className="w-6 h-6 text-primary" />
                Interactive Price Transparency Ledger
              </h2>
              <p className="text-xs text-gray-500">
                Simulate a harvest consignment to compare farmer returns under APMC Mandis vs Kisan Direct.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex-1 md:w-40">
                <label className="text-[11px] font-bold text-gray-500 block mb-1">Crop Price (₹/kg)</label>
                <input
                  type="number"
                  value={cropPrice}
                  onChange={(e) => setCropPrice(Math.max(5, Number(e.target.value) || 0))}
                  className="w-full border rounded-lg px-3 py-1.5 text-sm font-semibold"
                />
              </div>
              <div className="flex-1 md:w-40">
                <label className="text-[11px] font-bold text-gray-500 block mb-1">Consignment (kg)</label>
                <input
                  type="number"
                  value={calcQuantity}
                  onChange={(e) => setCalcQuantity(Math.max(50, Number(e.target.value) || 0))}
                  className="w-full border rounded-lg px-3 py-1.5 text-sm font-semibold"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            {/* Traditional Mandi */}
            <div className="p-5 rounded-xl border border-gray-200 bg-gray-50 space-y-3">
              <div className="flex justify-between items-center text-sm font-bold text-gray-700">
                <span>Traditional APMC Mandi Channel</span>
                <span className="text-red-600 font-bold">~48% Value Drain</span>
              </div>
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Consumer / Wholesale Price</span>
                  <span className="font-semibold">₹{(cropPrice * calcQuantity).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Agent Commissions & Brokerage (38%)</span>
                  <span>- ₹{(traditionalIntermediaryMargin * calcQuantity).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Transit Leakage & Loading Fees (10%)</span>
                  <span>- ₹{(traditionalLogisticsLoss * calcQuantity).toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-200 flex justify-between items-center text-sm font-bold text-gray-900">
                <span>Net Farmer Realization</span>
                <span className="text-lg text-gray-700">
                  ₹{(traditionalFarmerShare * calcQuantity).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Kisan Direct */}
            <div className="p-5 rounded-xl border-2 border-primary bg-green-50/50 space-y-3 shadow-xs">
              <div className="flex justify-between items-center text-sm font-bold text-primary">
                <span>Kisan Direct Platform</span>
                <Badge variant="success" className="text-xs">0% Platform Fee</Badge>
              </div>
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Agreed Farmgate Price</span>
                  <span className="font-semibold">₹{(cropPrice * calcQuantity).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Kisan Direct Platform Fee</span>
                  <span className="text-emerald-700 font-bold">₹0.00 (Free First)</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Logistics Cost (Billed transparently to buyer)</span>
                  <span>+ ₹{(kisanLogisticsEst * calcQuantity).toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="pt-3 border-t border-green-200 flex justify-between items-center text-sm font-bold text-primary">
                <span>Net Farmer In-Hand Realization</span>
                <span className="text-xl text-primary font-black">
                  ₹{(kisanFarmerShare * calcQuantity).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Role Personas Pathways */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Dedicated Portals for Every Supply Chain Participant
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Role-tailored tools designed for Indian agricultural realities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Farmer & FPO */}
          <Card className="hover:shadow-md transition-shadow border-t-4 border-t-green-600">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 text-primary flex items-center justify-center">
                <Tractor className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Farmers & FPO Co-operatives</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                List harvested lots directly, view regional buyer demand before harvest, and access AI-driven "Sell Smart" pricing advice.
              </p>
              <div className="pt-2">
                <Button
                  className="w-full"
                  onClick={() => navigate('/login')}
                >
                  Enter Farmer Portal
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Bulk Buyers & Retailers */}
          <Card className="hover:shadow-md transition-shadow border-t-4 border-t-blue-600">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Institutional & Bulk Buyers</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Post purchase requirements for retail chains or food processing units. Let the 6-factor AI matching engine connect verified farmer lots.
              </p>
              <div className="pt-2">
                <Button
                  variant="outline"
                  className="w-full border-blue-600 text-blue-700 hover:bg-blue-50"
                  onClick={() => navigate('/login')}
                >
                  Enter Buyer Portal
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Logistics Partners */}
          <Card className="hover:shadow-md transition-shadow border-t-4 border-t-amber-600">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Logistics & Fleet Partners</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Register vehicles (Tata 407, Bolero Maxi, Reefer), accept automated farmgate pickup jobs, and visualize Leaflet map routes.
              </p>
              <div className="pt-2">
                <Button
                  variant="outline"
                  className="w-full border-amber-600 text-amber-700 hover:bg-amber-50"
                  onClick={() => navigate('/login')}
                >
                  Enter Logistics Fleet
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 6. Prototype Metrics Disclaimer */}
      <section className="container mx-auto px-4">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center text-xs text-gray-500">
          <p className="font-semibold text-gray-700">Prototype Demonstration Notice:</p>
          <p className="mt-0.5">
            All transaction figures, match scores, demand curves, and route simulations are illustrative demo data.
          </p>
        </div>
      </section>
    </div>
  );
}
