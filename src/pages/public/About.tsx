import { Leaf, Users, Truck, TrendingUp, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

const steps = [
  { icon: Leaf, title: 'Farmer Lists Produce', desc: 'Farmers and FPOs publish their harvest directly — no middleman, no commission agent.' },
  { icon: Users, title: 'Buyer Posts Demand', desc: 'Bulk buyers (hotels, retailers, processors) post what they need — quantity, quality, location.' },
  { icon: TrendingUp, title: 'AI Matches Supply & Demand', desc: 'Our matching engine scores and connects the best farmer listings to buyer requirements automatically.' },
  { icon: Truck, title: 'Logistics & Delivery', desc: 'Logistics partners pick up from farm-gate and deliver to the buyer. Routes are optimized on a live map.' },
  { icon: ShieldCheck, title: 'Fair Price, Full Transparency', desc: 'Zero platform fee. The farmer keeps 100% of the crop value. Every rupee is accounted for.' },
];

export function About() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">How Kisan Direct Works</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Kisan Direct eliminates intermediaries from the agricultural supply chain, ensuring farmers earn more and consumers pay less.
        </p>
      </div>

      <div className="space-y-8">
        {steps.map((step, i) => (
          <div key={i} className="flex items-start space-x-6 bg-white p-6 rounded-xl border shadow-sm">
            <div className="bg-green-100 p-4 rounded-full text-primary flex-shrink-0">
              <step.icon className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">Step {i + 1}: {step.title}</h3>
              <p className="text-gray-600">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12 space-x-4">
        <Link to="/register">
          <Button>Get Started — It's Free</Button>
        </Link>
        <Link to="/marketplace">
          <Button variant="outline">Browse Marketplace</Button>
        </Link>
      </div>

      <div className="mt-16 text-center text-sm text-gray-400">
        <p>Built for Smart India Hackathon 2026 | Problem Statement #26033</p>
        <p>Ministry of Consumer Affairs, Food & Public Distribution</p>
      </div>
    </div>
  );
}
