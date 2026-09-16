import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm as useHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../../lib/supabase';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Badge } from '../../components/ui/Badge';
import { Tractor, Building2, ShoppingCart, Truck, ShieldCheck, Zap } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface DemoPersona {
  role: string;
  name: string;
  email: string;
  location: string;
  icon: typeof Tractor;
  dashboardPath: string;
  badgeColor: string;
}

const DEMO_PERSONAS: DemoPersona[] = [
  {
    role: 'Farmer',
    name: 'Ramesh Patel',
    email: 'farmer@kisandirect.com',
    location: 'Nashik, Maharashtra (5.5 Acres)',
    icon: Tractor,
    dashboardPath: '/farmer/dashboard',
    badgeColor: 'bg-green-100 text-green-800 border-green-200',
  },
  {
    role: 'FPO Co-op',
    name: 'Sahyadri Kisan FPO',
    email: 'fpo@kisandirect.com',
    location: 'Pune Hub (420 Farmers)',
    icon: Building2,
    dashboardPath: '/fpo/dashboard',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  {
    role: 'Bulk Buyer',
    name: 'FreshRetail Hypermarkets',
    email: 'buyer@kisandirect.com',
    location: 'Azadpur Mandi, Delhi',
    icon: ShoppingCart,
    dashboardPath: '/buyer/dashboard',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  {
    role: 'Logistics Partner',
    name: 'Kisan Express Fleet',
    email: 'logistics@kisandirect.com',
    location: 'Delhi-NCR & Haryana Corridor',
    icon: Truck,
    dashboardPath: '/logistics/dashboard',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  {
    role: 'Platform Admin',
    name: 'Dr. Rajesh Verma',
    email: 'admin@kisandirect.com',
    location: 'Ministry of Consumer Affairs',
    icon: ShieldCheck,
    dashboardPath: '/admin/dashboard',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
  },
];

export function Login() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeDemoEmail, setActiveDemoEmail] = useState<string | null>(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useHookForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  const performLogin = async (email: string, pass: string, targetRoute?: string) => {
    setIsLoading(true);
    setErrorMsg('');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error) {
      setErrorMsg(error.message);
      setIsLoading(false);
      setActiveDemoEmail(null);
    } else {
      // Determine dashboard based on profile role if not specified
      if (targetRoute) {
        navigate(targetRoute);
      } else {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        switch (profile?.role) {
          case 'farmer': navigate('/farmer/dashboard'); break;
          case 'fpo': navigate('/fpo/dashboard'); break;
          case 'bulk_buyer': navigate('/buyer/dashboard'); break;
          case 'logistics_partner': navigate('/logistics/dashboard'); break;
          case 'admin': navigate('/admin/dashboard'); break;
          default: navigate('/marketplace'); break;
        }
      }
    }
  };

  const onSubmit = (data: LoginFormValues) => {
    performLogin(data.email, data.password);
  };

  const handleQuickDemoLogin = (persona: DemoPersona) => {
    setActiveDemoEmail(persona.email);
    setValue('email', persona.email);
    setValue('password', 'Demo@1234');
    performLogin(persona.email, 'Demo@1234', persona.dashboardPath);
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4">
      {/* SIH Hackathon Demo Quick Switcher Banner */}
      <div className="mb-8 bg-gradient-to-r from-green-50 via-emerald-50 to-amber-50 border border-green-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-primary text-white rounded-lg shadow-sm">
              <Zap className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                1-Click SIH 2026 Demo Access
                <Badge variant="success" className="text-xs font-normal">Pre-Seeded Dataset</Badge>
              </h2>
              <p className="text-sm text-gray-600">
                Click any role below to instantly authenticate and evaluate the platform as that persona.
              </p>
            </div>
          </div>
          <span className="text-xs text-gray-500 font-mono bg-white px-2.5 py-1 rounded-md border">
            Password: Demo@1234
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {DEMO_PERSONAS.map((persona) => {
            const Icon = persona.icon;
            const isCurrent = activeDemoEmail === persona.email;
            return (
              <button
                key={persona.email}
                type="button"
                onClick={() => handleQuickDemoLogin(persona)}
                disabled={isLoading}
                className={`flex flex-col text-left p-3.5 rounded-xl border transition-all duration-150 ${
                  isCurrent
                    ? 'border-primary ring-2 ring-primary/20 bg-white shadow-md'
                    : 'border-gray-200 bg-white/80 hover:bg-white hover:border-primary/50 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`p-1.5 rounded-lg ${persona.badgeColor}`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    {persona.role}
                  </span>
                </div>
                <div className="font-semibold text-gray-900 text-sm truncate">{persona.name}</div>
                <div className="text-[11px] text-gray-500 truncate mt-0.5">{persona.location}</div>
                <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-primary font-medium">
                  <span>{isCurrent ? 'Logging in...' : 'Sign in as this role →'}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Standard Form Sign-In */}
      <div className="max-w-md mx-auto">
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-4 text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">Custom Credentials Login</CardTitle>
            <p className="text-sm text-gray-500">Or enter your personal account credentials below</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {errorMsg}
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g. farmer@kisandirect.com"
                  {...register('email')}
                />
                {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <span className="text-xs text-gray-400">Demo pass: Demo@1234</span>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                />
                {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
              </div>
              <Button type="submit" className="w-full h-10" disabled={isLoading}>
                {isLoading ? 'Authenticating...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center border-t border-gray-100 pt-4">
            <p className="text-sm text-gray-600">
              New to Kisan Direct?{' '}
              <Link to="/register" className="text-primary font-semibold hover:underline">
                Create an account
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
