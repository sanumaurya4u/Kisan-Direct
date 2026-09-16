import { useState, useEffect } from 'react';
import { useAuth } from '../../features/auth/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import {
  User,
  ShieldCheck,
  CheckCircle2,
  Tractor,
  Building2,
  ShoppingBag,
  Truck,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Save,
  Award,
  FileText,
  AlertCircle,
} from 'lucide-react';

export function ProfilePage() {
  const { profile, user } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setIsSaving(true);
    setErrorMsg(null);
    setSaveSuccess(false);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone: phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (error) throw error;
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile';
      setErrorMsg(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const getRoleIcon = () => {
    switch (profile?.role) {
      case 'farmer':
        return <Tractor className="w-8 h-8 text-primary" />;
      case 'fpo':
        return <Building2 className="w-8 h-8 text-primary" />;
      case 'bulk_buyer':
        return <ShoppingBag className="w-8 h-8 text-primary" />;
      case 'logistics_partner':
        return <Truck className="w-8 h-8 text-primary" />;
      case 'admin':
        return <ShieldCheck className="w-8 h-8 text-primary" />;
      default:
        return <User className="w-8 h-8 text-primary" />;
    }
  };

  const formatRole = (role?: string) => {
    if (!role) return 'User';
    return role
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center space-x-5">
            <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
              {getRoleIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  {profile?.full_name || 'Kisan Direct User'}
                </h1>
                <Badge className="bg-emerald-500/30 text-emerald-100 border-emerald-400/40 text-xs px-2.5 py-0.5">
                  <CheckCircle2 className="w-3 h-3 mr-1 inline text-emerald-300" />
                  Verified SIH Persona
                </Badge>
              </div>
              <p className="text-emerald-100 text-sm mt-1 flex items-center gap-2">
                <span>Role: {formatRole(profile?.role)}</span>
                <span>•</span>
                <span>ID: {profile?.id ? `${profile.id.substring(0, 8)}...` : 'N/A'}</span>
              </p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15 text-right sm:text-left">
            <p className="text-xs text-emerald-200 font-medium">Authentication Source</p>
            <p className="text-sm font-semibold text-white">Supabase PostgreSQL RLS</p>
            <p className="text-xs text-emerald-200/80 mt-0.5">SIH Hackathon Problem #26033</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Role Credentials & Verification Badges */}
        <div className="space-y-6 lg:col-span-1">
          {/* Identity & Verification Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                Trust & KYC Status
              </CardTitle>
              <CardDescription>Government & statutory compliance verification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-emerald-800">
                  <span>KYC Compliance</span>
                  <span className="bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
                    VERIFIED
                  </span>
                </div>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  Identity documentation verified against simulated national registry for SIH 2026 hackathon demo.
                </p>
              </div>

              <div className="space-y-2.5 text-xs text-gray-600">
                <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Account Type</span>
                  <span className="font-semibold text-gray-800 uppercase">{profile?.role}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Registered Email</span>
                  <span className="font-semibold text-gray-800 truncate max-w-[140px]">
                    {profile?.email || user?.email || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">Security Access</span>
                  <span className="font-semibold text-emerald-600">Role-Based RLS Active</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-gray-500">Dispute Escalation</span>
                  <span className="font-semibold text-gray-800">Tier 1 Support</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Persona-Specific Credentials Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                Persona Registry Details
              </CardTitle>
              <CardDescription>Domain specific verified credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              {(profile?.role === 'farmer' || profile?.role === 'fpo') && (
                <>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500">Farm Location</span>
                    <span className="font-semibold text-gray-800 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-primary" /> Nashik, Maharashtra
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500">Cultivation Area</span>
                    <span className="font-semibold text-gray-800">12.5 Acres</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500">Primary Produce</span>
                    <span className="font-semibold text-gray-800">Tomatoes, Onions, Grapes</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">PM-KISAN ID</span>
                    <span className="font-mono text-emerald-700 font-semibold">MH-2024-88419-K</span>
                  </div>
                </>
              )}

              {profile?.role === 'bulk_buyer' && (
                <>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500">Procurement Entity</span>
                    <span className="font-semibold text-gray-800">AgroFresh Retail & Mart</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500">Buyer Tier</span>
                    <span className="font-semibold text-gray-800">Tier-1 Retail Aggregator</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500">Warehouse Hub</span>
                    <span className="font-semibold text-gray-800">Navi Mumbai Central DC</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">GSTIN / Tax ID</span>
                    <span className="font-mono text-emerald-700 font-semibold">27AAACH2456M1Z2</span>
                  </div>
                </>
              )}

              {profile?.role === 'logistics_partner' && (
                <>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500">Logistics Company</span>
                    <span className="font-semibold text-gray-800">Kisan Express Fleet Ltd</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500">Registered Fleet</span>
                    <span className="font-semibold text-gray-800">3 Vehicles (Eicher, Tata)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500">Cold-Chain Unit</span>
                    <span className="font-semibold text-emerald-700">Reefer Truck Certified</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Carriage Permit</span>
                    <span className="font-mono text-gray-800 font-semibold">MH-RTO-2024-5591</span>
                  </div>
                </>
              )}

              {profile?.role === 'admin' && (
                <>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500">Privilege Level</span>
                    <span className="font-semibold text-purple-700">Super Administrator</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500">Audit Authority</span>
                    <span className="font-semibold text-gray-800">All Modules & Ledgers</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Escalation Desk</span>
                    <span className="font-semibold text-emerald-700">SIH 2026 Hackathon Core</span>
                  </div>
                </>
              )}

              {(!profile?.role || profile.role === 'consumer') && (
                <>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500">Customer Category</span>
                    <span className="font-semibold text-gray-800">Direct Retail Consumer</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500">Default Delivery</span>
                    <span className="font-semibold text-gray-800">Pune / Maharashtra</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Payment Status</span>
                    <span className="font-semibold text-emerald-700">UPI / Direct Escrow</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Edit Profile & Security Preferences */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Contact Information
              </CardTitle>
              <CardDescription>
                Update your primary profile details visible across orders, receipts, and logistics manifests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {saveSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              {errorMsg && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-gray-500" />
                      Full Name / Entity Name
                    </label>
                    <Input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      placeholder="e.g. Ramesh Kumar Patel"
                      className="bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-gray-500" />
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-gray-500" />
                    Email Address (Account Credential)
                  </label>
                  <Input
                    type="email"
                    value={profile?.email || user?.email || ''}
                    disabled
                    className="bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-[11px] text-gray-400">
                    Email is linked to your Supabase Auth session and cannot be changed directly in demo mode.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Last Updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <Button type="submit" disabled={isSaving} className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save Profile Changes'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Transparent Escrow & Direct Payout Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Smart Settlement & Escrow Configuration
              </CardTitle>
              <CardDescription>Direct-to-bank settlement preferences without middleman commission cuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 space-y-1.5">
                  <span className="font-semibold text-gray-800">Settlement Account</span>
                  <p className="text-gray-600">State Bank of India (SBI)</p>
                  <p className="font-mono text-gray-500">A/C: *******4920 (IFSC: SBIN0001234)</p>
                  <Badge variant="outline" className="text-[10px] text-emerald-700 bg-emerald-50 border-emerald-200 mt-1">
                    Direct Escrow Connected
                  </Badge>
                </div>

                <div className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 space-y-1.5">
                  <span className="font-semibold text-gray-800">Payout Trigger</span>
                  <p className="text-gray-600">Automated upon Delivery Confirmation</p>
                  <p className="text-gray-500">T+0 instant digital clearance via e-mandate</p>
                  <Badge variant="outline" className="text-[10px] text-blue-700 bg-blue-50 border-blue-200 mt-1">
                    0% Intermediary Fee
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
