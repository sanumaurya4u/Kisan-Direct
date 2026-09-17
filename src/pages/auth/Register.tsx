import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../../lib/supabase';
import { Card, CardTitle, CardContent, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Select } from '../../components/ui/Select';

const registerSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(['farmer', 'fpo', 'consumer', 'bulk_buyer', 'logistics_partner']),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function Register() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'consumer'
    }
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setErrorMsg('');
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          role: data.role,
        }
      }
    });

    if (error) {
      setErrorMsg(error.message);
      setIsLoading(false);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[75vh] py-10 px-4">
      <Card className="w-full max-w-lg shadow-kisan-card border-gray-200/80 rounded-2xl overflow-hidden bg-white">
        <div className="bg-gradient-to-r from-[#14532D] to-[#166534] text-white p-6 sm:p-7 text-center">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-2 text-emerald-300">
            🌱
          </div>
          <CardTitle className="text-2xl font-black tracking-tight text-white">Join Kisan Direct</CardTitle>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
            Empowering India's farmers with transparent pricing & zero middleman cut.
          </p>
        </div>

        <CardContent className="p-6 sm:p-7">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errorMsg && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
                {errorMsg}
              </div>
            )}
            
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider text-gray-700">Full Name / Organization Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="e.g. Ramesh Patel"
                className="h-11"
                {...register('fullName')}
              />
              {errors.fullName && <p className="text-xs text-red-600 font-medium">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-700">Email Address</Label>
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
              <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-gray-700">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Minimum 6 characters"
                className="h-11"
                {...register('password')}
              />
              {errors.password && <p className="text-xs text-red-600 font-medium">{errors.password.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="role" className="text-xs font-bold uppercase tracking-wider text-gray-700">I Want to Join As</Label>
              <Select id="role" {...register('role')} className="h-11 font-semibold text-gray-900">
                <option value="farmer">🌾 Farmer (किसान) — Sell harvest at fair price</option>
                <option value="fpo">🏢 FPO / Cooperative — Aggregate produce</option>
                <option value="consumer">🛒 Consumer / Household — Buy farm-fresh</option>
                <option value="bulk_buyer">🏬 Bulk Buyer / Retailer — Wholesale demand</option>
                <option value="logistics_partner">🚚 Logistics Partner — Fleet transport</option>
              </Select>
              {errors.role && <p className="text-xs text-red-600 font-medium">{errors.role.message}</p>}
            </div>

            <Button type="submit" className="w-full h-11 shadow-kisan-hover font-bold text-sm mt-2" disabled={isLoading}>
              {isLoading ? 'Registering Account...' : 'Create Kisan Direct Account'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center border-t border-gray-100 py-4 bg-gray-50/40">
          <p className="text-xs sm:text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
