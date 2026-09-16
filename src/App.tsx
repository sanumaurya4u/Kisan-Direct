import { Routes, Route } from 'react-router-dom';
import { BaseLayout } from './components/layout/BaseLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { Home } from './pages/public/Home';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { FarmerDashboard } from './pages/farmer/FarmerDashboard';
import { ListingForm } from './pages/farmer/ListingForm';
import { FPODashboard } from './pages/fpo/FPODashboard';
import { BuyerDashboard } from './pages/buyer/BuyerDashboard';
import { RequirementForm } from './pages/buyer/RequirementForm';
import { Marketplace } from './pages/public/Marketplace';
import { MatchesView } from './pages/buyer/MatchesView';
import { BuyerOrders } from './pages/buyer/BuyerOrders';
import { FarmerOrders } from './pages/farmer/FarmerOrders';
import { LogisticsDashboard } from './pages/logistics/LogisticsDashboard';
import { AnalyticsDashboard } from './pages/analytics/AnalyticsDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { About } from './pages/public/About';
import { AuthProvider } from './features/auth/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<BaseLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="about" element={<About />} />
          
          <Route element={<ProtectedRoute allowedRoles={['farmer']} />}>
            <Route path="farmer/dashboard" element={<FarmerDashboard />} />
            <Route path="farmer/dashboard/listings/new" element={<ListingForm />} />
            <Route path="farmer/dashboard/listings/:id/edit" element={<ListingForm />} />
            <Route path="farmer/orders" element={<FarmerOrders />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['fpo']} />}>
            <Route path="fpo/dashboard" element={<FPODashboard />} />
            <Route path="fpo/dashboard/listings/new" element={<ListingForm />} />
            <Route path="fpo/dashboard/listings/:id/edit" element={<ListingForm />} />
            <Route path="fpo/orders" element={<FarmerOrders />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['bulk_buyer']} />}>
            <Route path="buyer/dashboard" element={<BuyerDashboard />} />
            <Route path="buyer/orders" element={<BuyerOrders />} />
            <Route path="buyer/dashboard/requirements/new" element={<RequirementForm />} />
            <Route path="buyer/dashboard/requirements/:id/edit" element={<RequirementForm />} />
            <Route path="buyer/dashboard/requirements/:id/matches" element={<MatchesView />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['logistics_partner']} />}>
            <Route path="logistics/dashboard" element={<LogisticsDashboard />} />
          </Route>
          
          <Route element={<ProtectedRoute allowedRoles={['farmer', 'fpo', 'bulk_buyer', 'admin']} />}>
            <Route path="analytics" element={<AnalyticsDashboard />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="admin/dashboard" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
