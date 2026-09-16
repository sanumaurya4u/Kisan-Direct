import { useEffect, useState } from 'react';
import { useAuth } from '../../features/auth/AuthContext';
import { ordersService, type Order } from '../../features/orders/ordersService';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { PriceBreakdown } from '../../components/ui/PriceBreakdown';

export function FarmerOrders() {
  const { profile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const fetchOrders = () => {
    if (profile) {
      ordersService.getMyOrders(profile.id, profile.role)
        .then(setOrders)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [profile]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAccept = async (orderId: string) => {
    setIsProcessing(orderId);
    try {
      await ordersService.acceptOrder(orderId);
      fetchOrders();
    } catch (err: any) {
      alert(err.message || 'Failed to accept order.');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleReject = async (orderId: string) => {
    setIsProcessing(orderId);
    try {
      await ordersService.rejectOrder(orderId);
      fetchOrders();
    } catch (err: any) {
      alert(err.message || 'Failed to reject order.');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleMarkReady = async (orderId: string) => {
    setIsProcessing(orderId);
    try {
      await ordersService.updateOrderStatus(orderId, 'ready_for_pickup');
      fetchOrders();
    } catch (err: any) {
      alert(err.message || 'Failed to update order.');
    } finally {
      setIsProcessing(null);
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading orders...</div>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6 flex items-center space-x-4">
        <Link to={`/${profile?.role === 'fpo' ? 'fpo' : 'farmer'}/dashboard`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" /> Dashboard
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Received Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
          No orders received yet.
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <Card key={order.id} className={order.status === 'pending' ? 'border-primary' : ''}>
              <CardHeader className="bg-gray-50 flex flex-row justify-between items-center border-b">
                <div>
                  <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                  <p className="text-sm text-gray-500">From {order.buyer?.full_name}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant={order.status === 'accepted' ? 'success' : order.status === 'rejected' ? 'destructive' : 'secondary'}>
                    {order.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">Requested Items</h4>
                  <ul className="space-y-2">
                    {order.order_items?.map(item => (
                      <li key={item.id} className="text-sm flex justify-between border-b pb-2">
                        <span>{item.products?.name} ({item.quantity} {item.products?.unit})</span>
                        <span>₹{item.total_price}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600"><strong>Deliver to:</strong> {order.delivery_address}</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4">
                  <PriceBreakdown 
                    subtotal={order.subtotal}
                    estimatedLogistics={order.estimated_logistics_cost || 0}
                    platformFee={order.platform_fee || 0}
                    totalAmount={order.total_amount}
                    farmerRealization={order.subtotal}
                    isSellerView={true}
                  />

                  {order.status === 'pending' && (
                    <div className="flex flex-col gap-2">
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700" 
                        onClick={() => handleAccept(order.id)}
                        disabled={isProcessing === order.id}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" /> 
                        {isProcessing === order.id ? 'Processing...' : 'Accept Order'}
                      </Button>
                      <Button 
                        variant="secondary" 
                        className="w-full text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => handleReject(order.id)}
                        disabled={isProcessing === order.id}
                      >
                        <XCircle className="w-4 h-4 mr-2" /> Reject
                      </Button>
                    </div>
                  )}

                  {order.status === 'accepted' && (
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700" 
                      onClick={() => handleMarkReady(order.id)}
                      disabled={isProcessing === order.id}
                    >
                      {isProcessing === order.id ? 'Processing...' : 'Mark Ready for Pickup'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
