import { useState } from 'react';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import {
  Sprout,
  LogOut,
  User,
  Menu,
  X,
  Zap,
  ChevronDown,
  Globe,
} from 'lucide-react';
import { NotificationBell } from '../ui/NotificationBell';
import { useAuth } from '../../features/auth/AuthContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { AppSidebar } from './AppSidebar';
import { supabase } from '../../lib/supabase';

const DEMO_ACCOUNTS = [
  { role: 'farmer', name: 'Farmer (Ramesh)', email: 'farmer@kisandirect.com', path: '/farmer/dashboard', badge: '🌾 Kisan' },
  { role: 'fpo', name: 'FPO (Sahyadri)', email: 'fpo@kisandirect.com', path: '/fpo/dashboard', badge: '🏢 FPO' },
  { role: 'bulk_buyer', name: 'Buyer (FreshRetail)', email: 'buyer@kisandirect.com', path: '/buyer/dashboard', badge: '🛒 Buyer' },
  { role: 'logistics_partner', name: 'Logistics (Kisan Express)', email: 'logistics@kisandirect.com', path: '/logistics/dashboard', badge: '🚚 Fleet' },
  { role: 'admin', name: 'Admin (SIH System)', email: 'admin@kisandirect.com', path: '/admin/dashboard', badge: '🛡️ Admin' },
];

export function BaseLayout() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);
  const [isSwitchingPersona, setIsSwitchingPersona] = useState(false);
  const [currentLang, setCurrentLang] = useState<'EN' | 'HI'>('EN');

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const switchPersona = async (email: string, targetPath: string) => {
    setIsSwitchingPersona(true);
    setIsPersonaMenuOpen(false);
    setIsMobileNavOpen(false);
    try {
      await supabase.auth.signInWithPassword({
        email,
        password: 'Demo@1234',
      });
      navigate(targetPath);
    } catch (err) {
      console.error('Persona switch error', err);
    } finally {
      setIsSwitchingPersona(false);
    }
  };

  const toggleLanguage = () => {
    setCurrentLang((prev) => (prev === 'EN' ? 'HI' : 'EN'));
  };

  // Determine if sidebar should be shown (when authenticated and inside a role dashboard/workflow)
  const isDashboardView = !!user && !!profile;

  const isActiveLink = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-text-primary antialiased">
      {/* Sticky Main Header */}
      <header className="bg-[#14532D]/95 backdrop-blur-md text-white sticky top-0 z-50 border-b border-emerald-800/40 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-2">
          {/* Left: Brand Logo & Mobile Toggle */}
          <div className="flex items-center space-x-3">
            {isDashboardView && (
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-xl text-white/90 hover:text-white hover:bg-white/10 lg:hidden transition-colors cursor-pointer"
                aria-label="Toggle dashboard sidebar"
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <Sprout className="w-6 h-6 text-slate-950 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight leading-none text-white flex items-center gap-1.5">
                  Kisan Direct
                  <span className="inline-block w-2 h-2 rounded-full bg-fresh animate-pulse" />
                </span>
                <span className="text-[10px] text-emerald-200/90 font-medium tracking-wide mt-0.5 hidden sm:inline">
                  {currentLang === 'EN' ? 'From Kisan to Customer' : 'किसान से ग्राहक तक सीधा'}
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Desktop Navigation Bar */}
          <nav className="hidden xl:flex items-center space-x-1 bg-black/15 px-3 py-1.5 rounded-full border border-white/10">
            <Link
              to="/"
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${
                isActiveLink('/') && location.pathname === '/'
                  ? 'bg-white text-primary shadow-xs font-bold'
                  : 'text-emerald-100 hover:text-white hover:bg-white/10'
              }`}
            >
              {currentLang === 'EN' ? 'Home' : 'होम'}
            </Link>
            <Link
              to="/marketplace"
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${
                isActiveLink('/marketplace')
                  ? 'bg-white text-primary shadow-xs font-bold'
                  : 'text-emerald-100 hover:text-white hover:bg-white/10'
              }`}
            >
              {currentLang === 'EN' ? 'Buy Produce' : 'फसल खरीदें'}
            </Link>
            <Link
              to={user ? (profile?.role === 'farmer' || profile?.role === 'fpo' ? '/farmer/dashboard/listings/new' : '/farmer/sell-smart') : '/login'}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${
                isActiveLink('/farmer/sell-smart') || isActiveLink('/farmer/dashboard/listings')
                  ? 'bg-white text-primary shadow-xs font-bold'
                  : 'text-emerald-100 hover:text-white hover:bg-white/10'
              }`}
            >
              {currentLang === 'EN' ? 'Sell Produce' : 'फसल बेचें'}
            </Link>
            <Link
              to="/about"
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${
                isActiveLink('/about')
                  ? 'bg-white text-primary shadow-xs font-bold'
                  : 'text-emerald-100 hover:text-white hover:bg-white/10'
              }`}
            >
              {currentLang === 'EN' ? 'How It Works' : 'कैसे काम करता है'}
            </Link>
            <Link
              to="/analytics"
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${
                isActiveLink('/analytics')
                  ? 'bg-white text-primary shadow-xs font-bold'
                  : 'text-emerald-100 hover:text-white hover:bg-white/10'
              }`}
            >
              {currentLang === 'EN' ? 'Market Prices' : 'मंडी भाव व मांग'}
            </Link>
          </nav>

          {/* Right: Controls, Demo Switcher, Language & Auth */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Language Selector Pill */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1.5 bg-white/10 hover:bg-white/15 px-2.5 py-1.5 rounded-full border border-white/15 text-xs font-medium text-emerald-100 transition-colors cursor-pointer"
              title="Toggle Language (English / हिंदी)"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-300" />
              <span className="font-bold">{currentLang === 'EN' ? 'EN | हि' : 'हि | EN'}</span>
            </button>

            {/* 1-Click Role Switcher Pill for Evaluation */}
            <div className="relative">
              <button
                onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
                disabled={isSwitchingPersona}
                className="flex items-center space-x-1.5 bg-secondary hover:bg-amber-400 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-full shadow-xs transition-transform active:scale-95 cursor-pointer border border-amber-300"
                title="Switch persona instantly for demonstration"
              >
                <Zap className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
                <span className="hidden sm:inline font-bold">
                  {isSwitchingPersona ? 'Switching...' : 'Demo Switcher'}
                </span>
                <ChevronDown className="w-3 h-3 ml-0.5" />
              </button>

              {isPersonaMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsPersonaMenuOpen(false)}
                  />
                  <div className="absolute right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-emerald-100 py-2.5 z-50 text-gray-800 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3.5 py-2 border-b border-gray-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                        ⚡ Instant Role Switch
                      </span>
                      <span className="text-[10px] text-gray-400">Demo Dataset</span>
                    </div>
                    <div className="py-1">
                      {DEMO_ACCOUNTS.map((acc) => (
                        <button
                          key={acc.email}
                          onClick={() => switchPersona(acc.email, acc.path)}
                          className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-emerald-50/80 transition-colors cursor-pointer ${
                            profile?.role === acc.role ? 'font-bold text-primary bg-emerald-50' : 'text-gray-700'
                          }`}
                        >
                          <div>
                            <div className="font-semibold text-gray-900">{acc.name}</div>
                            <div className="text-[10px] text-gray-400 font-mono">{acc.email}</div>
                          </div>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100/70 text-emerald-900 font-medium">
                            {acc.badge}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User Profile / Notifications or Login / Register */}
            {user ? (
              <div className="flex items-center space-x-2">
                <NotificationBell />

                <Link
                  to="/profile"
                  className="flex items-center space-x-1.5 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full border border-white/20 transition-colors text-xs font-semibold"
                >
                  <User className="w-3.5 h-3.5 text-emerald-300" />
                  <span className="hidden md:inline max-w-[120px] truncate">
                    {profile?.full_name?.split(' ')[0] || 'Profile'}
                  </span>
                </Link>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-emerald-100 hover:text-white hover:bg-white/10 h-8 px-2.5 rounded-full"
                  onClick={handleSignOut}
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/15 h-9 px-3.5 rounded-full text-xs font-semibold"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    size="sm"
                    className="bg-white text-primary hover:bg-emerald-50 h-9 px-4 rounded-full text-xs font-bold shadow-sm"
                  >
                    Join Kisan Direct
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Navigation Button */}
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="p-2 rounded-xl text-white/90 hover:text-white hover:bg-white/10 xl:hidden transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileNavOpen && (
          <div className="xl:hidden bg-[#14532D] border-t border-emerald-800 px-4 py-4 space-y-3 animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col space-y-1">
              <Link
                to="/"
                onClick={() => setIsMobileNavOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-semibold text-white hover:bg-white/10"
              >
                🌾 Home
              </Link>
              <Link
                to="/marketplace"
                onClick={() => setIsMobileNavOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-semibold text-white hover:bg-white/10"
              >
                🛒 Buy Produce (Marketplace)
              </Link>
              <Link
                to={user ? '/farmer/sell-smart' : '/login'}
                onClick={() => setIsMobileNavOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-semibold text-white hover:bg-white/10"
              >
                🌾 Sell Produce
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMobileNavOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-semibold text-white hover:bg-white/10"
              >
                💡 How It Works
              </Link>
              <Link
                to="/analytics"
                onClick={() => setIsMobileNavOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-semibold text-white hover:bg-white/10"
              >
                📈 Market Prices & Demand
              </Link>
            </nav>

            {!user && (
              <div className="pt-2 border-t border-emerald-800 flex flex-col gap-2">
                <Link to="/login" onClick={() => setIsMobileNavOpen(false)}>
                  <Button variant="outline" className="w-full bg-white/10 text-white border-white/20">
                    Login
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsMobileNavOpen(false)}>
                  <Button className="w-full bg-fresh text-white font-bold">
                    Join Kisan Direct — It's Free
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Main Content Area with Optional Sidebar */}
      <div className="flex-1 flex flex-row">
        {/* Render Dashboard Sidebar if authenticated */}
        {isDashboardView && (
          <AppSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Content Container */}
        <div className={`flex-1 flex flex-col min-w-0 ${isDashboardView ? 'lg:pl-64' : ''}`}>
          <main className="flex-1 w-full pb-16">
            <Outlet />
          </main>

          {/* Redesigned High-Impact Forest Green Agricultural Footer */}
          <footer className="bg-[#14532D] text-white border-t border-emerald-800/60 mt-auto pt-14 pb-8 px-4 sm:px-6 md:px-8">
            <div className="max-w-7xl mx-auto space-y-12">
              {/* Top Row: Brand Story & Quick Links Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                {/* Brand Info (2 cols on lg) */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
                      <Sprout className="w-6 h-6 text-slate-950 stroke-[2.2]" />
                    </div>
                    <span className="font-extrabold text-2xl tracking-tight text-white">
                      Kisan Direct
                    </span>
                  </div>
                  <p className="text-emerald-100/80 text-sm leading-relaxed max-w-sm">
                    Empowering Indian agriculture by connecting farmers and FPOs directly with consumers and bulk buyers — eliminating middleman margins with 100% price transparency.
                  </p>
                  <div className="flex items-center gap-2 pt-2">
                    <Badge variant="fresh" className="text-xs">
                      ✓ 0% Platform Fee
                    </Badge>
                    <Badge variant="outline" className="text-xs text-white border-white/20">
                      ✓ 100% Direct to Bank
                    </Badge>
                  </div>
                </div>

                {/* Col 1: Produce Categories */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                    Fresh Produce
                  </h4>
                  <ul className="space-y-2 text-sm text-emerald-100/80">
                    <li><Link to="/marketplace" className="hover:text-white transition-colors">Everyday Vegetables</Link></li>
                    <li><Link to="/marketplace" className="hover:text-white transition-colors">Seasonal Fruits</Link></li>
                    <li><Link to="/marketplace" className="hover:text-white transition-colors">Grains & Cereals</Link></li>
                    <li><Link to="/marketplace" className="hover:text-white transition-colors">Organic Harvest Lots</Link></li>
                    <li><Link to="/marketplace" className="hover:text-white transition-colors">Bulk Mandi Contracts</Link></li>
                  </ul>
                </div>

                {/* Col 2: For Kisans */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                    For Kisans & FPOs
                  </h4>
                  <ul className="space-y-2 text-sm text-emerald-100/80">
                    <li><Link to="/farmer/sell-smart" className="hover:text-white transition-colors">Sell Smart AI Pricing</Link></li>
                    <li><Link to="/farmer/dashboard/listings/new" className="hover:text-white transition-colors">List Your Harvest</Link></li>
                    <li><Link to="/analytics" className="hover:text-white transition-colors">Check Mandi Rates</Link></li>
                    <li><Link to="/logistics/dashboard" className="hover:text-white transition-colors">Request Farmgate Pickup</Link></li>
                    <li><Link to="/about" className="hover:text-white transition-colors">FPO Co-operative Guide</Link></li>
                  </ul>
                </div>

                {/* Col 3: Quick Portals & Trust */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                    Portals & Tools
                  </h4>
                  <ul className="space-y-2 text-sm text-emerald-100/80">
                    <li><Link to="/login" className="hover:text-white transition-colors">Farmer & FPO Portal</Link></li>
                    <li><Link to="/login" className="hover:text-white transition-colors">Institutional Buyer Portal</Link></li>
                    <li><Link to="/login" className="hover:text-white transition-colors">Cold-Chain Fleet Network</Link></li>
                    <li><Link to="/about" className="hover:text-white transition-colors">How Kisan Direct Works</Link></li>
                    <li><Link to="/analytics" className="hover:text-white transition-colors">Demand Intelligence</Link></li>
                  </ul>
                </div>
              </div>

              {/* Bottom Copyright & Made for Kisans Bar */}
              <div className="pt-8 border-t border-emerald-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-200/70">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium">Made for India's Farming Community 🌾</span>
                </div>
                <div>
                  © 2026 Kisan Direct — Built for Smart India Hackathon. All rights reserved.
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
