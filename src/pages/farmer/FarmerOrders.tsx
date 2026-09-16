import { useEffect, useState } from 'react';
import { useAuth } from '../../features/auth/AuthContext';
import { ordersService, type Order } from '../../features/orders/ordersService';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Truck,
  MapPin,
  Clock,
  PackageCheck,
} from 'lucide-react';
import { PriceBreakdown } from '../../components/ui/PriceBreakdown';

export function FarmerOrders() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterTab, setFilterTab] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const fetchOrders = () => {
    if (profile) {
      setIsLoading(true);
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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to accept order.';
      alert(msg);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleReject = async (orderId: string) => {
    setIsProcessing(orderId);
    try {
      await ordersService.rejectOrder(orderId);
      fetchOrders();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to reject order.';
      alert(msg);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleMarkReady = async (orderId: string) => {
    setIsProcessing(orderId);
    try {
      await ordersService.updateOrderStatus(orderId, 'ready_for_pickup');
      fetchOrders();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update order.';
      alert(msg);
    } finally {
      setIsProcessing(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filterTab === 'pending') return o.status === 'pending';
    if (filterTab === 'ready') return o.status === 'accepted' || o.status === 'ready_for_pickup';
    if (filterTab === 'transit') return o.status === 'in_transit' || o.status === 'delivered';
    return true;
  });

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Received Crop Orders</h1>
            <p className="text-xs text-gray-500">
              Review incoming purchase orders from verified retail chains and wholesale buyers.
            </p>
          </div>
        </div>

        <Link to="/farmer/dashboard">
          <Button size="sm" variant="outline">
            Farmer Dashboard
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 text-xs">
        {[
          { key: 'all', label: `All Orders (${orders.length})` },
          { key: 'pending', label: 'Needs Acceptance' },
          { key: 'ready', label: 'Packing & Ready' },
          { key: 'transit', label: 'In Transit / Delivered' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterTab(tab.key)}
            className={`px-3.5 py-1.5 rounded-full font-semibold transition-colors ${
              filterTab === tab.key
                ? 'bg-primary text-white shadow-xs'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="py-16">
          <LoadingSpinner text="Fetching received orders..." />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 p-8 space-y-3">
          <PackageCheck className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-base font-bold text-gray-900">No Orders in this View</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {filterTab === 'all'
              ? 'You have not received any purchase orders yet.'
              : `No orders currently match the status "${filterTab}".`}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <Card
              key={order.id}
              className={`overflow-hidden border-gray-200 shadow-xs ${
                order.status === 'pending' ? 'ring-2 ring-amber-400/40 border-amber-300' : ''
              }`}
            >
              <CardHeader className="bg-gray-50/80 p-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-base font-bold font-mono">
                      Order #{order.id.slice(0, 8)}
                    </CardTitle>
                    <Badge
                      variant={
                        order.status === 'delivered'
                          ? 'success'
                          : order.status === 'accepted' || order.status === 'ready_for_pickup'
                          ? 'outline'
                          : order.status === 'rejected'
                          ? 'destructive'
                          : 'secondary'
                      }
                      className="text-xs uppercase"
                    >
                      {order.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Buyer: <strong>{order.buyer?.full_name || 'Institutional Retailer'}</strong> • Received {new Date(order.created_at).toLocaleDateString('en-IN')}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-gray-500 block">Your Net Realization</span>
                  <span className="text-xl font-extrabold text-primary">
                    ₹{Number(order.subtotal).toLocaleString('en-IN')}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="p-6 flex flex-col lg:flex-row gap-6">
                {/* Left: Items & Delivery Details */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Crop Items Ordered
                    </h4>
                    <ul className="space-y-2">
                      {order.order_items?.map((item) => (
                        <li
                          key={item.id}
                          className="p-3 bg-gray-50 rounded-lg border flex justify-between items-center text-sm"
                        >
                          <div>
                            <span className="font-bold text-gray-900">{item.products?.name}</span>
                            <span className="text-xs text-gray-500 block">
                              {item.quantity} {item.products?.unit} at ₹{item.unit_price}
                            </span>
                          </div>
                          <span className="font-bold text-gray-900">
                            ₹{Number(item.total_price).toLocaleString('en-IN')}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-xs text-gray-600 bg-white p-3 rounded-lg border space-y-1">
                    <div className="flex items-center text-gray-500">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
                      <span>Destination: {order.delivery_address || 'Azadpur Central Warehouse, Delhi'}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Truck className="w-3.5 h-3.5 mr-1 text-gray-400" />
                      <span>Transporter: Kisan Express Logistics (Auto-Assigned on Ready)</span>
                    </div>
                  </div>
                </div>

                {/* Right: Transparent Price Realization & Status Buttons */}
                <div className="w-full lg:w-80 flex flex-col gap-4">
                  <PriceBreakdown
                    subtotal={order.subtotal}
                    estimatedLogistics={order.estimated_logistics_cost || 0}
                    platformFee={order.platform_fee || 0}
                    totalAmount={order.total_amount}
                    farmerRealization={order.subtotal}
                    isSellerView={true}
                  />

                  {/* Pending Action Controls */}
                  {order.status === 'pending' && (
                    <div className="flex flex-col gap-2 pt-2">
                      <Button
                        className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold shadow-xs h-10"
                        onClick={() => handleAccept(order.id)}
                        disabled={isProcessing === order.id}
                      >
                        <CheckCircle className="w-4 h-4 mr-1.5" />
                        {isProcessing === order.id ? 'Confirming...' : 'Accept Order'}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full text-red-600 border-red-200 hover:bg-red-50 text-xs h-9"
                        onClick={() => handleReject(order.id)}
                        disabled={isProcessing === order.id}
                      >
                        <XCircle className="w-4 h-4 mr-1.5" /> Decline Order
                      </Button>
                    </div>
                  )}

                  {/* Ready for Pickup Action */}
                  {order.status === 'accepted' && (
                    <div className="pt-2">
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 font-bold shadow-xs h-10"
                        onClick={() => handleMarkReady(order.id)}
                        disabled={isProcessing === order.id}
                      >
                        <PackageCheck className="w-4 h-4 mr-1.5" />
                        {isProcessing === order.id ? 'Updating...' : 'Mark Ready for Pickup'}
                      </Button>
                      <p className="text-[11px] text-gray-400 text-center mt-1.5">
                        Transporter will receive automatic dispatch notification.
                      </p>
                    </div>
                  )}

                  {order.status === 'ready_for_pickup' && (
                    <div className="p-3 bg-blue-50 text-blue-800 rounded-xl text-xs flex items-center space-x-2 border border-blue-200">
                      <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span>Awaiting transporter arrival for farmgate loading.</span>
                    </div>
                  )}

                  {order.status === 'in_transit' && (
                    <div className="p-3 bg-amber-50 text-amber-800 rounded-xl text-xs flex items-center space-x-2 border border-amber-200">
                      <Truck className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <span>Shipment in transit to destination hub via cold-chain.</span>
                    </div>
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
