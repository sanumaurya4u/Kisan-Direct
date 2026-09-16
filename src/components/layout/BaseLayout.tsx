import { useState } from 'react';
import { useNavigate, Outlet, Link } from 'react-router-dom';
import {
  Leaf,
  LogOut,
  User,
  Menu,
  X,
  Zap,
  ChevronDown,
} from 'lucide-react';
import { NotificationBell } from '../ui/NotificationBell';
import { useAuth } from '../../features/auth/AuthContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { AppSidebar } from './AppSidebar';
import { supabase } from '../../lib/supabase';

const DEMO_ACCOUNTS = [
  { role: 'farmer', name: 'Farmer (Ramesh)', email: 'farmer@kisandirect.com', path: '/farmer/dashboard' },
  { role: 'fpo', name: 'FPO (Sahyadri)', email: 'fpo@kisandirect.com', path: '/fpo/dashboard' },
  { role: 'bulk_buyer', name: 'Buyer (FreshRetail)', email: 'buyer@kisandirect.com', path: '/buyer/dashboard' },
  { role: 'logistics_partner', name: 'Logistics (Kisan Express)', email: 'logistics@kisandirect.com', path: '/logistics/dashboard' },
  { role: 'admin', name: 'Admin (SIH Ministry)', email: 'admin@kisandirect.com', path: '/admin/dashboard' },
];

export function BaseLayout() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);
  const [isSwitchingPersona, setIsSwitchingPersona] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const switchPersona = async (email: string, targetPath: string) => {
    setIsSwitchingPersona(true);
    setIsPersonaMenuOpen(false);
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

  // Determine if sidebar should be shown (only when user is authenticated)
  const isDashboardView = !!user && !!profile;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Sticky Main Header */}
      <header className="bg-primary text-white sticky top-0 z-50 shadow-md h-16">
        <div className="px-4 h-full flex items-center justify-between gap-2 max-w-full">
          {/* Left: Mobile Menu Toggle & Brand Logo */}
          <div className="flex items-center space-x-3">
            {isDashboardView && (
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-1.5 rounded-lg text-white/90 hover:text-white hover:bg-white/10 lg:hidden transition-colors"
                aria-label="Toggle navigation menu"
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
            <Link to="/" className="flex items-center space-x-2 font-bold text-xl tracking-tight">
              <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="hidden sm:inline">Kisan Direct</span>
            </Link>

            {/* SIH Tag */}
            <span className="hidden md:inline-flex items-center text-[11px] font-semibold bg-white/15 text-primary-light px-2 py-0.5 rounded-full border border-white/20">
              SIH 2026 Prototype
            </span>
          </div>

          {/* Center: Search & Quick Persona Switcher for Hackathon Evaluation */}
          <div className="flex items-center space-x-2 flex-1 justify-end md:justify-center max-w-xl">
            {/* 1-Click Role Switcher Pill (Crucial for Demo) */}
            <div className="relative">
              <button
                onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
                disabled={isSwitchingPersona}
                className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium text-xs px-2.5 py-1.5 rounded-full shadow-xs transition-colors border border-amber-400"
                title="Switch persona instantly for demo"
              >
                <Zap className="w-3.5 h-3.5 text-slate-900 fill-slate-900" />
                <span className="hidden sm:inline font-bold">
                  {isSwitchingPersona ? 'Switching...' : 'Demo Switcher'}
                </span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {isPersonaMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsPersonaMenuOpen(false)}
                  />
                  <div className="absolute right-0 sm:left-1/2 sm:-translate-x-1/2 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 text-gray-800">
                    <div className="px-3 py-1.5 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Instant Persona Switch
                    </div>
                    {DEMO_ACCOUNTS.map((acc) => (
                      <button
                        key={acc.email}
                        onClick={() => switchPersona(acc.email, acc.path)}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-green-50 transition-colors ${
                          profile?.role === acc.role ? 'font-bold text-primary bg-green-50/50' : 'text-gray-700'
                        }`}
                      >
                        <div>
                          <div>{acc.name}</div>
                          <div className="text-[10px] text-gray-400 font-mono">{acc.email}</div>
                        </div>
                        {profile?.role === acc.role && (
                          <Badge variant="success" className="text-[9px] px-1 py-0">Active</Badge>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Quick Public Links when unauthenticated */}
            {!user && (
              <div className="hidden md:flex items-center space-x-4 ml-4">
                <Link to="/marketplace" className="text-sm hover:text-primary-light transition-colors">
                  Marketplace
                </Link>
                <Link to="/about" className="text-sm hover:text-primary-light transition-colors">
                  How it Works
                </Link>
              </div>
            )}
          </div>

          {/* Right: Notifications & User Profile Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {user ? (
              <>
                <NotificationBell />

                <Link
                  to="/profile"
                  className="flex items-center space-x-1.5 bg-white/10 hover:bg-white/15 px-2.5 py-1.5 rounded-lg border border-white/15 transition-colors text-xs"
                >
                  <User className="w-3.5 h-3.5 text-primary-light" />
                  <span className="hidden md:inline font-medium max-w-[120px] truncate">
                    {profile?.full_name?.split(' ')[0] || 'Profile'}
                  </span>
                </Link>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-white hover:bg-white/10 h-8 px-2"
                  onClick={handleSignOut}
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 h-8">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-white text-primary hover:bg-primary-light hover:text-primary h-8 font-semibold">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area with Sidebar Grid */}
      <div className="flex-1 flex flex-row">
        {/* Render Sidebar if user is logged in */}
        {isDashboardView && (
          <AppSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Content Container: pl-64 applied on desktop when authenticated to prevent sidebar overlap */}
        <div className={`flex-1 flex flex-col min-w-0 ${isDashboardView ? 'lg:pl-64' : ''}`}>
          <main className="flex-1 w-full pb-12">
            <Outlet />
          </main>

          {/* Footer (Rendered at bottom of content) */}
          <footer className="bg-white border-t border-gray-200 mt-auto py-6 px-4 md:px-8 text-xs text-text-muted">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center space-x-2">
                <Leaf className="w-4 h-4 text-primary" />
                <span className="font-semibold text-gray-700">Kisan Direct</span>
                <span>— Smart India Hackathon 2026 Prototype (PS #26033)</span>
              </div>
              <div className="flex space-x-6">
                <Link to="/" className="hover:text-text-primary">Home</Link>
                <Link to="/marketplace" className="hover:text-text-primary">Marketplace</Link>
                <Link to="/about" className="hover:text-text-primary">How It Works</Link>
                <Link to="/analytics" className="hover:text-text-primary">AI Forecast</Link>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
