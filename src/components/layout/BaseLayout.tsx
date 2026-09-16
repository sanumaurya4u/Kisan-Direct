import { useNavigate, Outlet, Link } from 'react-router-dom';
import { Leaf, LogOut, User } from 'lucide-react';
import { NotificationBell } from '../ui/NotificationBell';
import { useAuth } from '../../features/auth/AuthContext';
import { Button } from '../ui/Button';

export function BaseLayout() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!profile) return '/';
    switch (profile.role) {
      case 'farmer': return '/farmer/dashboard';
      case 'fpo': return '/fpo/dashboard';
      case 'consumer': return '/marketplace';
      case 'bulk_buyer': return '/buyer/dashboard';
      case 'logistics_partner': return '/logistics/dashboard';
      case 'admin': return '/admin/dashboard';
      default: return '/';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 font-bold text-xl">
            <Leaf className="w-6 h-6" />
            <span>Kisan Direct</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/marketplace" className="hover:text-primary-light transition-colors">Marketplace</Link>
            <Link to="/about" className="hover:text-primary-light transition-colors">How it Works</Link>
            <div className="h-6 w-px bg-white/20"></div>
            
            {user ? (
              <div className="flex items-center space-x-4">
                {profile && <NotificationBell />}
                <Link to={getDashboardLink()} className="flex items-center space-x-1 hover:text-primary-light transition-colors">
                  <User className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login" className="hover:text-primary-light transition-colors">Login</Link>
                <Link to="/register" className="bg-white text-primary px-4 py-2 rounded-md font-medium hover:bg-primary-light hover:text-primary transition-colors">
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center text-sm text-text-muted">
          <p>© 2026 Kisan Direct. Smart India Hackathon Prototype.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/about" className="hover:text-text-primary">About</Link>
            <Link to="/privacy" className="hover:text-text-primary">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
