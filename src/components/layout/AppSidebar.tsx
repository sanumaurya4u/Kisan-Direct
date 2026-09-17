import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Store,
  Package,
  PlusCircle,
  ShoppingBag,
  Truck,
  TrendingUp,
  BrainCircuit,
  User,
  ShieldCheck,
  Building2,
  Tractor,
  X,
  Compass,
} from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { Badge } from '../ui/Badge';

interface AppSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

interface NavItem {
  label: string;
  to: string;
  icon: typeof LayoutDashboard;
  badge?: string;
}

function renderRoleIcon(role?: string) {
  switch (role) {
    case 'farmer': return <Tractor className="w-5 h-5" />;
    case 'fpo': return <Building2 className="w-5 h-5" />;
    case 'bulk_buyer': return <ShoppingBag className="w-5 h-5" />;
    case 'logistics_partner': return <Truck className="w-5 h-5" />;
    case 'admin': return <ShieldCheck className="w-5 h-5" />;
    default: return <User className="w-5 h-5" />;
  }
}

export function AppSidebar({ isOpen, onClose }: AppSidebarProps) {
  const { profile } = useAuth();
  const role = profile?.role;

  const getNavSections = (): { title: string; items: NavItem[] }[] => {
    switch (role) {
      case 'farmer':
      case 'fpo':
        return [
          {
            title: 'Farm Management',
            items: [
              {
                label: role === 'fpo' ? 'FPO Dashboard' : 'Farmer Dashboard',
                to: role === 'fpo' ? '/fpo/dashboard' : '/farmer/dashboard',
                icon: LayoutDashboard,
              },
              { label: 'My Produce', to: '/farmer/produce', icon: Package },
              { label: '+ Add Produce', to: '/farmer/dashboard/listings/new', icon: PlusCircle },
              { label: 'Received Orders', to: '/farmer/orders', icon: ShoppingBag },
            ],
          },
          {
            title: 'AI Intelligence',
            items: [
              { label: 'Sell Smart AI', to: '/farmer/sell-smart', icon: BrainCircuit, badge: 'AI' },
              { label: 'Demand Forecast', to: '/analytics', icon: TrendingUp },
            ],
          },
          {
            title: 'Market & Network',
            items: [
              { label: 'Marketplace', to: '/marketplace', icon: Store },
              { label: 'Logistics Fleet', to: '/logistics/dashboard', icon: Truck },
              { label: 'My Profile', to: '/profile', icon: User },
            ],
          },
        ];

      case 'bulk_buyer':
        return [
          {
            title: 'Procurement',
            items: [
              { label: 'Buyer Dashboard', to: '/buyer/dashboard', icon: LayoutDashboard },
              { label: '+ Post Requirement', to: '/buyer/dashboard/requirements/new', icon: PlusCircle },
              { label: 'Marketplace', to: '/marketplace', icon: Store },
              { label: 'Procurement Orders', to: '/buyer/orders', icon: ShoppingBag },
            ],
          },
          {
            title: 'Intelligence & Tracking',
            items: [
              { label: 'Market Analytics', to: '/analytics', icon: TrendingUp },
              { label: 'Logistics Tracking', to: '/logistics/dashboard', icon: Truck },
              { label: 'Company Profile', to: '/profile', icon: User },
            ],
          },
        ];

      case 'logistics_partner':
        return [
          {
            title: 'Fleet Operations',
            items: [
              { label: 'Logistics Overview', to: '/logistics/dashboard', icon: LayoutDashboard },
              { label: 'Route Optimizer', to: '/logistics/routes', icon: Compass, badge: 'Map' },
            ],
          },
          {
            title: 'Network',
            items: [
              { label: 'Active Marketplace', to: '/marketplace', icon: Store },
              { label: 'Fleet Profile', to: '/profile', icon: User },
            ],
          },
        ];

      case 'admin':
        return [
          {
            title: 'Administration',
            items: [
              { label: 'Platform Overview', to: '/admin/dashboard', icon: LayoutDashboard },
              { label: 'Marketplace Catalog', to: '/marketplace', icon: Store },
              { label: 'Demand Intelligence', to: '/analytics', icon: TrendingUp },
              { label: 'Logistics Network', to: '/logistics/dashboard', icon: Truck },
              { label: 'Admin Profile', to: '/profile', icon: ShieldCheck },
            ],
          },
        ];

      default:
        return [
          {
            title: 'Consumer',
            items: [
              { label: 'Marketplace', to: '/marketplace', icon: Store },
              { label: 'My Orders', to: '/buyer/orders', icon: ShoppingBag },
              { label: 'Profile', to: '/profile', icon: User },
            ],
          },
        ];
    }
  };

  const sections = getNavSections();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-18 bottom-0 left-0 z-40 w-64 bg-[#FAFCF9] border-r border-emerald-100 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* User Persona Card in Sidebar */}
        <div className="p-4 border-b border-emerald-100/60 bg-emerald-50/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                {renderRoleIcon(role)}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm text-gray-900 truncate">
                  {profile?.full_name || 'Kisan Direct User'}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Badge variant="fresh" className="text-[10px] uppercase font-bold tracking-wider px-2 py-0">
                    {profile?.role?.replace('_', ' ') || 'Guest'}
                  </Badge>
                  <span className="w-2 h-2 rounded-full bg-fresh" title="Online" />
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Link Groups */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {sections.map((section, idx) => (
            <div key={idx}>
              <h3 className="px-3 text-[11px] font-bold text-emerald-900/60 uppercase tracking-wider mb-2">
                {section.title}
              </h3>
              <nav className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={onClose}
                      end={item.to.includes('dashboard') || item.to === '/marketplace'}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                          isActive
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-gray-700 hover:bg-emerald-50 hover:text-primary'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center space-x-3 min-w-0">
                            <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-emerald-300' : 'text-gray-500'}`} />
                            <span className="truncate">{item.label}</span>
                          </div>
                          {item.badge && (
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-900'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
