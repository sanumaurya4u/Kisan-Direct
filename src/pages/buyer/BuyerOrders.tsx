import { useEffect, useState } from 'react';
import { useAuth } from '../../features/auth/AuthContext';
import { ordersService, type Order } from '../../features/orders/ordersService';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function BuyerOrders() {
  const { profile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      ordersService.getMyOrders(profile.id, profile.role)
        .then(setOrders)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [profile]);

  if (isLoading) return <div className="p-8 text-center">Loading orders...</div>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6 flex items-center space-x-4">
        <Link to="/buyer/dashboard">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" /> Dashboard
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
          You haven't placed any orders yet.
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <Card key={order.id}>
              <CardHeader className="bg-gray-50 flex flex-row justify-between items-center border-b">
                <div>
                  <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                  <p className="text-sm text-gray-500">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <Badge variant={order.status === 'accepted' ? 'success' : order.status === 'rejected' ? 'destructive' : 'secondary'}>
                  {order.status.toUpperCase()}
                </Badge>
              </CardHeader>
              <CardContent className="p-4 flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">Items</h4>
                  <ul className="space-y-2">
                    {order.order_items?.map(item => (
                      <li key={item.id} className="text-sm flex justify-between border-b pb-2">
                        <span>{item.products?.name} ({item.quantity} {item.products?.unit})</span>
                        <span>₹{item.total_price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1 bg-gray-50 p-4 rounded-lg text-sm">
                  <h4 className="font-semibold mb-2">Order Summary</h4>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>₹{order.subtotal}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Logistics (Est):</span>
                    <span>₹{order.estimated_logistics_cost}</span>
                  </div>
                  <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                    <span>Total Amount:</span>
                    <span className="text-primary">₹{order.total_amount}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-gray-600"><strong>Seller:</strong> {order.seller?.full_name}</p>
                    <p className="text-gray-600"><strong>Delivery to:</strong> {order.delivery_address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
