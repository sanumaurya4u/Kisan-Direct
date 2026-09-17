import { Sprout, Users, Truck, TrendingUp, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const steps = [
  {
    step: '01',
    icon: Sprout,
    title: 'Farmer & FPO Lists Harvest',
    desc: 'Farmers and collective FPOs publish their harvested crops directly with quality grading, quantity, and transparent farmgate pricing — no commission agents required.',
    badge: 'Farmgate Direct',
  },
  {
    step: '02',
    icon: Users,
    title: 'Buyers Post Wholesale Demand',
    desc: 'Retail chains, supermarket aggregators, and food processors publish their required commodities with quality specifications, target price, and delivery location.',
    badge: 'Demand Aggregation',
  },
  {
    step: '03',
    icon: TrendingUp,
    title: 'AI Matches Supply & Demand',
    desc: 'Our 6-factor heuristic algorithm evaluates distance, lot size, commodity grading, and market price curves to automatically connect compatible parties.',
    badge: 'AI Multi-Factor Engine',
  },
  {
    step: '04',
    icon: Truck,
    title: 'Farmgate Logistics & Delivery',
    desc: 'Automated job dispatches assign verified fleet partners for temperature-controlled pickup directly from the farmgate, with live Leaflet route tracking.',
    badge: 'GPS Fleet Tracking',
  },
  {
    step: '05',
    icon: ShieldCheck,
    title: '100% Direct Fair Settlement',
    desc: 'Zero platform commission. The farmer keeps 100% of the agreed crop value. Every rupee is transparently accounted for in an immutable escrow ledger.',
    badge: '0% Platform Commission',
  },
];

export function About() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-16">
      {/* 1. Header Banner & Mission Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-[#14532D] text-white p-8 sm:p-12 md:p-16 shadow-xl border border-emerald-800/60 text-center space-y-6">
        <div className="inline-flex items-center space-x-2 bg-emerald-950/60 border border-emerald-400/30 px-4 py-1.5 rounded-full text-xs text-emerald-200">
          <Sprout className="w-4 h-4 text-fresh" />
          <span className="font-bold tracking-wide">Our Mission & Purpose</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
          Built for India's <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-fresh to-emerald-200">Kisans</span>
        </h1>

        <p className="text-base sm:text-lg text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
          Kisan Direct was built to eliminate intermediaries from the Indian agricultural supply chain — ensuring farmers earn fair, dignified prices while buyers receive fresher produce directly from the source.
        </p>

        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <Badge variant="fresh" className="text-xs px-3 py-1">
            ✓ 0% Platform Commission
          </Badge>
          <Badge variant="outline" className="text-xs text-white border-white/20 px-3 py-1">
            ✓ 100% Direct to Bank
          </Badge>
          <Badge variant="outline" className="text-xs text-white border-white/20 px-3 py-1">
            ✓ Farmgate GPS Dispatch
          </Badge>
        </div>
      </section>

      {/* 2. Story / Why Kisan Direct Exists */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-4">
          <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
            Agricultural Storytelling
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Restoring Dignity to Indian Agriculture
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            In traditional APMC mandis, a harvest passes through 4 to 6 tiers of commission agents, village aggregators, and brokers before reaching the consumer. By the time it arrives, the farmer receives only 40% to 50% of the value, and over 25% of perishable crops spoil in transit.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Kisan Direct replaces this fragmented chain with an intelligent, direct digital pipeline. By combining direct listings, AI demand forecasting, and organized farmgate cold-chain logistics, we ensure every farmer retains full value for their labor.
          </p>

          <div className="pt-2 flex items-center space-x-4 text-xs font-bold text-primary">
            <span className="flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-1 text-fresh" /> Zero Hidden Cuts
            </span>
            <span className="flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-1 text-fresh" /> Real-time Price Visibility
            </span>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="rounded-3xl overflow-hidden shadow-xl border-2 border-emerald-100 aspect-4/3 bg-emerald-900">
            <img
              src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80"
              alt="Lush green Indian agricultural fields"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 3. 5-Step Visual Process */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-1.5">
            <span className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              The 5-Step
            </span>
            <span className="pill-highlight text-xl sm:text-2xl font-black">
              Direct Trade
            </span>
            <span className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Process
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 max-w-lg mx-auto">
            From farmgate harvest publication to instant digital bank settlement.
          </p>
        </div>

        <div className="space-y-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 bg-white p-6 rounded-2xl border border-emerald-100/80 shadow-sm hover:shadow-md transition-all hover:border-emerald-300"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-primary flex items-center justify-center font-black text-lg flex-shrink-0">
                    {step.step}
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900">{step.title}</h3>
                    <Badge variant="fresh" className="text-[10px]">{step.badge}</Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Bottom CTAs */}
      <section className="bg-emerald-50/60 border border-emerald-200 rounded-3xl p-8 sm:p-10 text-center space-y-5">
        <h3 className="text-2xl font-extrabold text-gray-900">
          Ready to Connect Directly with India's Agricultural Network?
        </h3>
        <p className="text-sm text-gray-600 max-w-lg mx-auto">
          Sign up today as a farmer, FPO, consumer, or bulk institutional buyer. It only takes 2 minutes.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-2">
          <Link to="/register">
            <Button size="lg" className="h-11 px-7 rounded-xl font-bold bg-primary text-white shadow-md">
              Get Started — It's Free <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
          <Link to="/marketplace">
            <Button variant="outline" size="lg" className="h-11 px-7 rounded-xl font-bold">
              Browse Live Marketplace
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
