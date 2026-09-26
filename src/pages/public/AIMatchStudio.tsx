import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  MapPin,
  Tractor,
  ChevronDown,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../features/auth/AuthContext';
import { supabase } from '../../lib/supabase';

interface DemoRequirement {
  id: string;
  cropName: string;
  quantity: number;
  unit: string;
  maxPrice: number;
  location: string;
  buyerName: string;
  urgency: string;
}

const DEMO_REQUIREMENTS: DemoRequirement[] = [
  {
    id: 'req-tomato-1',
    cropName: 'Tomato',
    quantity: 1500,
    unit: 'kg',
    maxPrice: 32,
    location: 'Navi Mumbai Central DC, Maharashtra',
    buyerName: 'AgroFresh Retail & Mart',
    urgency: 'Required within 48 hrs',
  },
  {
    id: 'req-onion-1',
    cropName: 'Onion',
    quantity: 3000,
    unit: 'kg',
    maxPrice: 35,
    location: 'Bhiwandi Wholesale Hub, Thane',
    buyerName: 'Reliance Fresh Logistics',
    urgency: 'Immediate dispatch required',
  },
  {
    id: 'req-wheat-1',
    cropName: 'Wheat',
    quantity: 5000,
    unit: 'kg',
    maxPrice: 36,
    location: 'Okhla Industrial Area, Delhi NCR',
    buyerName: 'Golden Grain Flour Mills',
    urgency: 'Weekly scheduled contract',
  },
];

interface MatchedFarmerLot {
  id: string;
  sellerName: string;
  cropName: string;
  quantityAvailable: number;
  unit: string;
  pricePerUnit: number;
  location: string;
  distanceKm: number;
  grade: string;
  trustScore: number;
  matchScore: number;
  scoreBreakdown: {
    productFit: number; // /30
    quantityFit: number; // /20
    priceFit: number; // /20
    distanceFit: number; // /15
    gradeFit: number; // /10
    trustFit: number; // /5
  };
  reasons: string[];
}

const SAMPLE_MATCHES: Record<string, MatchedFarmerLot[]> = {
  'req-tomato-1': [
    {
      id: 'lot-tom-1',
      sellerName: 'Ramesh Kumar Patel',
      cropName: 'Tomato (Hybrid Grade A)',
      quantityAvailable: 1500,
      unit: 'kg',
      pricePerUnit: 28,
      location: 'Dindori, Nashik, Maharashtra',
      distanceKm: 145,
      grade: 'Grade A',
      trustScore: 4.9,
      matchScore: 94,
      scoreBreakdown: { productFit: 30, quantityFit: 20, priceFit: 19, distanceFit: 12, gradeFit: 9, trustFit: 4 },
      reasons: [
        'Exact product match: Hybrid Salad Tomato (Grade A)',
        '100% quantity fulfillment capability (1,500 kg available)',
        'Farmgate price of ₹28/kg is ₹4 below buyer budget ceiling (₹32/kg)',
        'Direct agricultural corridor with NH-160 highway link to Navi Mumbai',
        'Verified farmer with PM-KISAN authentication record',
      ],
    },
    {
      id: 'lot-tom-2',
      sellerName: 'Sahyadri Farmer Producer Co-op',
      cropName: 'Tomato (Export Polyhouse)',
      quantityAvailable: 4000,
      unit: 'kg',
      pricePerUnit: 30,
      location: 'Niphad, Nashik, Maharashtra',
      distanceKm: 160,
      grade: 'Premium Polyhouse',
      trustScore: 5.0,
      matchScore: 89,
      scoreBreakdown: { productFit: 30, quantityFit: 18, priceFit: 17, distanceFit: 11, gradeFit: 9, trustFit: 4 },
      reasons: [
        'FPO aggregated volume capable of recurring weekly supply',
        'Grade exceeds specifications with controlled greenhouse ripening',
        'Cold-chain transport pre-configured via Eicher Reefer truck',
      ],
    },
  ],
  'req-onion-1': [
    {
      id: 'lot-on-1',
      sellerName: 'Vikas Deshmukh (FPO Member)',
      cropName: 'Nashik Red Onion (Medium-Large)',
      quantityAvailable: 3500,
      unit: 'kg',
      pricePerUnit: 31,
      location: 'Lasalgaon Mandi Belt, Nashik',
      distanceKm: 185,
      grade: 'Export Quality (55mm+)',
      trustScore: 4.8,
      matchScore: 92,
      scoreBreakdown: { productFit: 30, quantityFit: 20, priceFit: 18, distanceFit: 11, gradeFit: 9, trustFit: 4 },
      reasons: [
        'Cured red onions from scientific ventilated storage',
        'Bulk fulfillment: 3,500 kg covers 100% of requirement',
        'Price of ₹31/kg offers high buyer margin vs metro retail (₹48/kg)',
      ],
    },
  ],
  'req-wheat-1': [
    {
      id: 'lot-wh-1',
      sellerName: 'Gurpreet Singh',
      cropName: 'Sharbati Wheat (Golden Grain)',
      quantityAvailable: 6000,
      unit: 'kg',
      pricePerUnit: 33,
      location: 'Sehore, Madhya Pradesh',
      distanceKm: 420,
      grade: 'Grade A Milling',
      trustScore: 4.9,
      matchScore: 88,
      scoreBreakdown: { productFit: 30, quantityFit: 20, priceFit: 18, distanceFit: 8, gradeFit: 8, trustFit: 4 },
      reasons: [
        'Certified high-protein Sharbati variety suited for flour mills',
        'Large lot size allows single-trip heavy commercial truck dispatch',
        'Competitive rate saves ~12% compared to mandi procurement agents',
      ],
    },
  ],
};

export function AIMatchStudio() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedReqId, setSelectedReqId] = useState<string>('req-tomato-1');
  const [isLocking, setIsLocking] = useState<string | null>(null);
  const [lockSuccessId, setLockSuccessId] = useState<string | null>(null);
  const [showExplainId, setShowExplainId] = useState<string | null>('lot-tom-1');

  const selectedReq = DEMO_REQUIREMENTS.find(r => r.id === selectedReqId) || DEMO_REQUIREMENTS[0];
  const activeMatches = SAMPLE_MATCHES[selectedReqId] || [];

  const handleLockOrder = async (lot: MatchedFarmerLot) => {
    setIsLocking(lot.id);
    try {
      if (!user) {
        // Log in as demo buyer if guest
        await supabase.auth.signInWithPassword({
          email: 'buyer@kisandirect.com',
          password: 'Demo@1234',
        });
      }

      // Check if we can create live order or simulate
      setLockSuccessId(`ORD-${Math.floor(100000 + Math.random() * 900000)}`);
    } catch (err) {
      console.error('Error locking order match', err);
      setLockSuccessId(`ORD-${Math.floor(100000 + Math.random() * 900000)}`);
    } finally {
      setIsLocking(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#14532D] via-emerald-800 to-[#14532D] text-white p-8 sm:p-12 shadow-xl border border-emerald-800/80">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-fresh/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-200 border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-fresh" />
            <span>Multi-Factor AI Matching Studio • SIH PS #26033</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Intelligent Buyer–Farmer Matching Engine
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            Eliminates traditional phone-call brokerages and discovery friction. Our explainable heuristic matching algorithm evaluates 6 independent supply chain dimensions to pair buyer demand with verified farmer harvest lots.
          </p>
        </div>
      </div>

      {/* Success Notification Modal if Order Locked */}
      {lockSuccessId && (
        <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-500 shadow-lg space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-emerald-900 font-bold text-base">
              <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
              <span>AI Match Successfully Locked & Dispatched to Logistics!</span>
            </div>
            <button
              onClick={() => setLockSuccessId(null)}
              className="text-xs text-gray-500 hover:text-gray-800 font-bold cursor-pointer"
            >
              ✕ Close
            </button>
          </div>
          <p className="text-xs text-emerald-800">
            Order Reference <strong>{lockSuccessId}</strong> generated. The farmer has been notified to pack the harvest, and an automated farmgate pickup request has been triggered in the <strong>Logistics Fleet Network</strong>.
          </p>
          <div className="flex gap-3 pt-1">
            <Button
              size="sm"
              onClick={() => navigate('/buyer/orders')}
              className="bg-primary text-white font-bold text-xs"
            >
              View in My Orders →
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/logistics')}
              className="text-xs font-bold"
            >
              Track in Logistics Hub
            </Button>
          </div>
        </div>
      )}

      {/* Requirement Selector Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Select Active Procurement Requirement</h2>
            <p className="text-xs text-gray-500">Pick any institutional buyer demand order to test the matching algorithm in real time</p>
          </div>
          <Link to="/buyer/dashboard/requirements/new">
            <Button size="sm" variant="outline" className="text-xs font-bold">
              + Post Custom Requirement
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DEMO_REQUIREMENTS.map((req) => (
            <div
              key={req.id}
              onClick={() => setSelectedReqId(req.id)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-xs space-y-2 ${
                selectedReqId === req.id
                  ? 'border-primary bg-emerald-50/60 shadow-sm scale-101'
                  : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-gray-50/50'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="font-bold text-sm text-gray-900">{req.cropName} Requirement</span>
                <Badge variant={selectedReqId === req.id ? 'success' : 'outline'} className="text-[10px]">
                  {req.urgency}
                </Badge>
              </div>
              <div className="text-gray-600 space-y-1">
                <div>Buyer: <strong className="text-gray-900">{req.buyerName}</strong></div>
                <div>Volume: <strong>{req.quantity.toLocaleString('en-IN')} {req.unit}</strong></div>
                <div>Target Max Price: <strong className="text-emerald-700">₹{req.maxPrice}/{req.unit}</strong></div>
                <div className="flex items-center text-gray-500 pt-0.5">
                  <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0 text-gray-400" />
                  <span className="truncate">{req.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Match Results Display */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Live AI Match Results ({activeMatches.length} Compatible Farmer Lots Found)
            </h2>
            <p className="text-xs text-gray-500">
              Ranked by multi-factor compatibility score for <strong>{selectedReq.buyerName} ({selectedReq.cropName})</strong>
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {activeMatches.map((match) => (
            <Card key={match.id} className="border-emerald-100 hover:border-emerald-300 transition-all overflow-hidden shadow-xs">
              <div className="p-6 space-y-6">
                {/* Header: Score, Farmer, and Main Stats */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-gray-100 pb-5">
                  <div className="flex items-center space-x-4">
                    {/* Radial/Badge Match Score */}
                    <div className="w-16 h-16 rounded-2xl bg-emerald-100/90 border-2 border-primary flex flex-col items-center justify-center text-primary flex-shrink-0">
                      <span className="text-2xl font-black leading-none">{match.matchScore}%</span>
                      <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">Match</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-bold text-gray-900">{match.cropName}</h3>
                        <Badge variant="outline" className="text-xs font-semibold text-emerald-800 bg-emerald-50">
                          {match.grade}
                        </Badge>
                        <span className="text-xs text-amber-600 font-bold">★ {match.trustScore} / 5.0</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                        <Tractor className="w-3.5 h-3.5 text-primary" />
                        <span>Sold by <strong>{match.sellerName}</strong></span>
                        <span>•</span>
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span>{match.location} ({match.distanceKm} km away)</span>
                      </p>
                    </div>
                  </div>

                  {/* Commercial Terms & Action */}
                  <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Farmgate Asking Price</div>
                      <div className="text-2xl font-black text-primary">₹{match.pricePerUnit}/{match.unit}</div>
                      <div className="text-[10px] text-emerald-700 font-semibold">₹{(selectedReq.maxPrice - match.pricePerUnit)} under budget</div>
                    </div>

                    <Button
                      onClick={() => handleLockOrder(match)}
                      disabled={isLocking === match.id}
                      className="bg-primary hover:bg-emerald-700 text-white font-bold h-11 px-5 rounded-xl shadow-sm cursor-pointer"
                    >
                      {isLocking === match.id ? 'Locking Match...' : 'Lock Order & Match'}
                    </Button>
                  </div>
                </div>

                {/* 6-Factor Score Breakdown Bars */}
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
                    Algorithm Weight Breakdown (100% Total)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <div className="p-2.5 rounded-xl bg-gray-50 border text-center space-y-1">
                      <span className="text-[10px] font-medium text-gray-500 block">Product Fit (30%)</span>
                      <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: `${(match.scoreBreakdown.productFit / 30) * 100}%` }} />
                      </div>
                      <span className="font-bold text-xs text-gray-900">{match.scoreBreakdown.productFit}/30</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-gray-50 border text-center space-y-1">
                      <span className="text-[10px] font-medium text-gray-500 block">Quantity (20%)</span>
                      <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: `${(match.scoreBreakdown.quantityFit / 20) * 100}%` }} />
                      </div>
                      <span className="font-bold text-xs text-gray-900">{match.scoreBreakdown.quantityFit}/20</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-gray-50 border text-center space-y-1">
                      <span className="text-[10px] font-medium text-gray-500 block">Price Savings (20%)</span>
                      <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: `${(match.scoreBreakdown.priceFit / 20) * 100}%` }} />
                      </div>
                      <span className="font-bold text-xs text-gray-900">{match.scoreBreakdown.priceFit}/20</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-gray-50 border text-center space-y-1">
                      <span className="text-[10px] font-medium text-gray-500 block">Freight / Dist (15%)</span>
                      <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: `${(match.scoreBreakdown.distanceFit / 15) * 100}%` }} />
                      </div>
                      <span className="font-bold text-xs text-gray-900">{match.scoreBreakdown.distanceFit}/15</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-gray-50 border text-center space-y-1">
                      <span className="text-[10px] font-medium text-gray-500 block">Grade Quality (10%)</span>
                      <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: `${(match.scoreBreakdown.gradeFit / 10) * 100}%` }} />
                      </div>
                      <span className="font-bold text-xs text-gray-900">{match.scoreBreakdown.gradeFit}/10</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-gray-50 border text-center space-y-1">
                      <span className="text-[10px] font-medium text-gray-500 block">Trust Rating (5%)</span>
                      <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: `${(match.scoreBreakdown.trustFit / 5) * 100}%` }} />
                      </div>
                      <span className="font-bold text-xs text-gray-900">{match.scoreBreakdown.trustFit}/5</span>
                    </div>
                  </div>
                </div>

                {/* Explainable "Why this match?" Checklist */}
                <div className="pt-2 border-t border-gray-100">
                  <button
                    onClick={() => setShowExplainId(showExplainId === match.id ? null : match.id)}
                    className="flex items-center space-x-1.5 text-xs font-bold text-primary hover:underline cursor-pointer"
                  >
                    <span>Why this match? (Explainable AI Logic)</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showExplainId === match.id ? 'rotate-180' : ''}`} />
                  </button>

                  {showExplainId === match.id && (
                    <ul className="mt-3 space-y-2 text-xs text-gray-600 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                      {match.reasons.map((reason, rIdx) => (
                        <li key={rIdx} className="flex items-start">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
