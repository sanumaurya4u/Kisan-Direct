import { useEffect, useState } from 'react';
import { useAuth } from '../../features/auth/AuthContext';
import { adminService, type AdminMetrics } from '../../features/admin/adminService';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Users, Truck, ShoppingCart, Leaf, IndianRupee, MapPin } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

export function AdminDashboard() {
  const { profile } = useAuth();
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminService.getMetrics()
      .then(setMetrics)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div className="p-8 text-center">Loading admin dashboard...</div>;
  if (!metrics) return <div className="p-8 text-center text-red-500">Failed to load metrics.</div>;

  const roleData = [
    { name: 'Farmers', value: metrics.totalFarmers, color: '#166534' },
    { name: 'FPOs', value: metrics.totalFPOs, color: '#22c55e' },
    { name: 'Bulk Buyers', value: metrics.totalBuyers, color: '#3b82f6' },
    { name: 'Logistics', value: metrics.totalLogistics, color: '#f59e0b' },
  ].filter(d => d.value > 0);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Platform Admin Dashboard</h1>
        <p className="text-gray-500">Welcome, {profile?.full_name} | Operational Overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white border-l-4 border-l-green-600">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-full text-green-600">
              <IndianRupee className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Gross Merchandise Value (GMV)</p>
              <h3 className="text-2xl font-bold">₹{metrics.gmv.toLocaleString('en-IN')}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-l-4 border-l-blue-600">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Orders</p>
              <h3 className="text-2xl font-bold">{metrics.totalOrders}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-l-4 border-l-emerald-600">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
              <Leaf className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Active Listings</p>
              <h3 className="text-2xl font-bold">{metrics.activeListings}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-l-4 border-l-amber-500">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="bg-amber-100 p-3 rounded-full text-amber-600">
              <Truck className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Logistics Jobs</p>
              <h3 className="text-2xl font-bold">{metrics.totalJobs}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              User Demographics
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-[300px]">
            {roleData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {roleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-gray-500">No users found.</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Total Registered Farmers</span>
                <span className="text-lg font-bold text-green-700">{metrics.totalFarmers}</span>
              </li>
              <li className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Total FPOs</span>
                <span className="text-lg font-bold text-green-700">{metrics.totalFPOs}</span>
              </li>
              <li className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Total Bulk Buyers</span>
                <span className="text-lg font-bold text-blue-700">{metrics.totalBuyers}</span>
              </li>
              <li className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Logistics Partners</span>
                <span className="text-lg font-bold text-amber-600">{metrics.totalLogistics}</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
