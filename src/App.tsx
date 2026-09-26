import { Routes, Route } from 'react-router-dom';
import { BaseLayout } from './components/layout/BaseLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { Home } from './pages/public/Home';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Marketplace } from './pages/public/Marketplace';
import { PriceIntelligence } from './pages/public/PriceIntelligence';
import { DemandIntelligence } from './pages/public/DemandIntelligence';
import { AIMatchStudio } from './pages/public/AIMatchStudio';
import { LogisticsHub } from './pages/public/LogisticsHub';
import { About } from './pages/public/About';
import { FarmerDashboard } from './pages/farmer/FarmerDashboard';
import { FarmerProduce } from './pages/farmer/FarmerProduce';
import { SellSmart } from './pages/farmer/SellSmart';
import { ListingForm } from './pages/farmer/ListingForm';
import { FPODashboard } from './pages/fpo/FPODashboard';
import { BuyerDashboard } from './pages/buyer/BuyerDashboard';
import { RequirementForm } from './pages/buyer/RequirementForm';
import { MatchesView } from './pages/buyer/MatchesView';
import { BuyerOrders } from './pages/buyer/BuyerOrders';
import { FarmerOrders } from './pages/farmer/FarmerOrders';
import { LogisticsDashboard } from './pages/logistics/LogisticsDashboard';
import { RouteOptimizationView } from './pages/logistics/RouteOptimizationView';
import { AnalyticsDashboard } from './pages/analytics/AnalyticsDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ProfilePage } from './pages/profile/ProfilePage';
import { AuthProvider } from './features/auth/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<BaseLayout />}>
          {/* Public First-Class Core Routes */}
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="prices" element={<PriceIntelligence />} />
          <Route path="demand" element={<DemandIntelligence />} />
          <Route path="logistics" element={<LogisticsHub />} />
          <Route path="ai-match" element={<AIMatchStudio />} />
          <Route path="about" element={<About />} />

          {/* Farmer Routes */}
          <Route element={<ProtectedRoute allowedRoles={['farmer', 'fpo']} />}>
            <Route path="farmer/dashboard" element={<FarmerDashboard />} />
            <Route path="farmer/produce" element={<FarmerProduce />} />
            <Route path="farmer/sell-smart" element={<SellSmart />} />
            <Route path="farmer/dashboard/listings/new" element={<ListingForm />} />
            <Route path="farmer/dashboard/listings/:id/edit" element={<ListingForm />} />
            <Route path="farmer/orders" element={<FarmerOrders />} />
          </Route>

          {/* FPO Specific Routes */}
          <Route element={<ProtectedRoute allowedRoles={['fpo']} />}>
            <Route path="fpo/dashboard" element={<FPODashboard />} />
            <Route path="fpo/dashboard/listings/new" element={<ListingForm />} />
            <Route path="fpo/dashboard/listings/:id/edit" element={<ListingForm />} />
            <Route path="fpo/orders" element={<FarmerOrders />} />
          </Route>

          {/* Bulk Buyer & Consumer Orders Routes */}
          <Route element={<ProtectedRoute allowedRoles={['bulk_buyer', 'admin']} />}>
            <Route path="buyer/dashboard" element={<BuyerDashboard />} />
            <Route path="buyer/dashboard/requirements/new" element={<RequirementForm />} />
            <Route path="buyer/dashboard/requirements/:id/edit" element={<RequirementForm />} />
            <Route path="buyer/dashboard/requirements/:id/matches" element={<MatchesView />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['bulk_buyer', 'consumer', 'admin']} />}>
            <Route path="buyer/orders" element={<BuyerOrders />} />
          </Route>

          {/* Logistics & Fleet Tracking Routes */}
          <Route element={<ProtectedRoute allowedRoles={['logistics_partner', 'admin', 'farmer', 'fpo', 'bulk_buyer']} />}>
            <Route path="logistics/dashboard" element={<LogisticsDashboard />} />
            <Route path="logistics/routes" element={<RouteOptimizationView />} />
          </Route>

          {/* Analytics & Forecasting */}
          <Route element={<ProtectedRoute allowedRoles={['farmer', 'fpo', 'bulk_buyer', 'admin', 'logistics_partner']} />}>
            <Route path="analytics" element={<AnalyticsDashboard />} />
          </Route>

          {/* Platform Administrator */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="admin/dashboard" element={<AdminDashboard />} />
          </Route>

          {/* User Profile for All Authenticated Personas */}
          <Route element={<ProtectedRoute allowedRoles={['farmer', 'fpo', 'bulk_buyer', 'logistics_partner', 'admin', 'consumer']} />}>
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
