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
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
      {/* Demo Quick Switcher Banner */}
      <div className="bg-gradient-to-r from-green-50/80 via-emerald-50/60 to-amber-50/70 border border-green-200/80 rounded-2xl p-6 sm:p-7 shadow-kisan-card">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div className="flex items-center space-x-3">
            <span className="p-2.5 bg-primary text-white rounded-xl shadow-xs">
              <Zap className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                1-Click Evaluator Demo Access
                <Badge variant="fresh" className="text-xs font-semibold">Pre-Seeded Dataset</Badge>
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                Click any role card below to authenticate instantly and evaluate live workflows as that persona.
              </p>
            </div>
          </div>
          <span className="text-xs text-gray-600 font-mono bg-white px-3 py-1.5 rounded-lg border border-gray-200/80 shadow-2xs font-semibold">
            Universal Password: <span className="text-primary font-bold">Demo@1234</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {DEMO_PERSONAS.map((persona) => {
            const Icon = persona.icon;
            const isCurrent = activeDemoEmail === persona.email;
            return (
              <button
                key={persona.email}
                type="button"
                onClick={() => handleQuickDemoLogin(persona)}
                disabled={isLoading}
                className={`flex flex-col text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isCurrent
                    ? 'border-primary ring-2 ring-primary/20 bg-white shadow-md'
                    : 'border-gray-200/90 bg-white/90 hover:bg-white hover:border-primary/50 hover:shadow-kisan-hover'
                }`}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className={`p-2 rounded-xl ${persona.badgeColor}`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    {persona.role}
                  </span>
                </div>
                <div className="font-bold text-gray-900 text-sm truncate">{persona.name}</div>
                <div className="text-[11px] text-gray-500 truncate mt-0.5">{persona.location}</div>
                <div className="mt-3.5 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-primary font-bold">
                  <span>{isCurrent ? 'Logging in...' : 'Sign in as this role →'}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Standard Form Sign-In */}
      <div className="max-w-md mx-auto">
        <Card className="shadow-kisan-card border-gray-200/80 rounded-2xl overflow-hidden bg-white">
          <CardHeader className="pb-4 text-center bg-gray-50/50 border-b border-gray-100">
            <CardTitle className="text-2xl font-extrabold text-gray-900">Account Login</CardTitle>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Or sign in with your registered email and password</p>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {errorMsg && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
                  {errorMsg}
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-700">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g. farmer@kisandirect.com"
                  className="h-11"
                  {...register('email')}
                />
                {errors.email && <p className="text-xs text-red-600 font-medium">{errors.email.message}</p>}
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-gray-700">Password</Label>
                  <span className="text-[11px] text-gray-400">Demo pass: Demo@1234</span>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-11"
                  {...register('password')}
                />
                {errors.password && <p className="text-xs text-red-600 font-medium">{errors.password.message}</p>}
              </div>
              <Button type="submit" className="w-full h-11 shadow-kisan-hover font-bold text-sm" disabled={isLoading}>
                {isLoading ? 'Authenticating...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center border-t border-gray-100 py-4 bg-gray-50/30">
            <p className="text-xs sm:text-sm text-gray-600">
              New to Kisan Direct?{' '}
              <Link to="/register" className="text-primary font-bold hover:underline">
                Create an account
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
