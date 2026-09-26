import { useEffect, useState } from 'react';
import { useAuth } from '../../features/auth/AuthContext';
import { ordersService, type Order } from '../../features/orders/ordersService';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  MapPin,
  Store,
  ShieldCheck,
} from 'lucide-react';

const ORDER_STAGES = [
  { key: 'pending', label: 'Order Placed' },
  { key: 'accepted', label: 'Farmer Confirmed' },
  { key: 'ready_for_pickup', label: 'Ready at Farmgate' },
  { key: 'in_transit', label: 'In Transit (Fleet)' },
  { key: 'delivered', label: 'Delivered to Hub' },
];

function getStageIndex(status: string) {
  switch (status) {
    case 'pending': return 0;
    case 'accepted': return 1;
    case 'processing': return 1;
    case 'ready_for_pickup': return 2;
    case 'in_transit': return 3;
    case 'delivered':
    case 'completed': return 4;
    default: return 0;
  }
}

export function BuyerOrders() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [confirmingOrderId, setConfirmingOrderId] = useState<string | null>(null);

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

  const handleConfirmDelivery = async (orderId: string) => {
    setConfirmingOrderId(orderId);
    try {
      await ordersService.updateOrderStatus(orderId, 'delivered');
      fetchOrders();
    } catch (err) {
      console.error('Failed to confirm delivery', err);
    } finally {
      setConfirmingOrderId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'active') {
      return o.status === 'pending' || o.status === 'accepted' || o.status === 'ready_for_pickup' || o.status === 'in_transit';
    }
    if (filterStatus === 'delivered') {
      return o.status === 'delivered' || o.status === 'completed';
    }
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Procurement Orders & Deliveries</h1>
            <p className="text-xs text-gray-500">
              Track lifecycle milestones, transporter assignments, and transparent settlement ledgers.
            </p>
          </div>
        </div>

        <Link to="/marketplace">
          <Button size="sm">
            <Store className="w-4 h-4 mr-1.5" />
            Browse Marketplace
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2">
        {['all', 'active', 'delivered'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterStatus(tab)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
              filterStatus === tab
                ? 'bg-primary text-white shadow-xs'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab === 'all' ? `All Orders (${orders.length})` : tab}
          </button>
        ))}
      </div>

      {/* Order Cards Stream */}
      {isLoading ? (
        <div className="py-16">
          <LoadingSpinner text="Fetching order tracking records..." />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 p-8 space-y-3">
          <Package className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-base font-bold text-gray-900">No Orders Found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {filterStatus === 'all'
              ? 'You have not placed any direct farm procurement orders yet.'
              : `No orders match the filter "${filterStatus}".`}
          </p>
          <div className="pt-2">
            <Link to="/marketplace">
              <Button size="sm">Find Fresh Produce on Marketplace</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const currentStageIndex = getStageIndex(order.status);
            const isRejected = order.status === 'rejected';

            return (
              <Card key={order.id} className="overflow-hidden border-gray-200 shadow-xs">
                {/* Order Top Bar */}
                <CardHeader className="bg-gray-50/80 p-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-sm text-gray-900">
                        Order #{order.id.slice(0, 8)}
                      </span>
                      <Badge
                        variant={
                          order.status === 'delivered' || order.status === 'completed'
                            ? 'success'
                            : order.status === 'in_transit'
                            ? 'outline'
                            : order.status === 'rejected'
                            ? 'destructive'
                            : 'secondary'
                        }
                        className="text-xs font-semibold uppercase tracking-wider"
                      >
                        {order.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/logistics/dashboard')}
                      className="text-xs h-8"
                    >
                      <Truck className="w-3.5 h-3.5 mr-1 text-primary" />
                      Track Route
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  {/* Visual 5-Stage Lifecycle Stepper */}
                  {!isRejected ? (
                    <div className="p-4 bg-gray-50/60 rounded-xl border border-gray-100">
                      <div className="flex justify-between items-center relative">
                        {/* Connecting track line */}
                        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
                        <div
                          className="absolute top-1/2 left-4 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-300"
                          style={{
                            width: `${(currentStageIndex / (ORDER_STAGES.length - 1)) * 95}%`,
                          }}
                        />

                        {ORDER_STAGES.map((stage, idx) => {
                          const isDone = idx <= currentStageIndex;
                          const isCurrent = idx === currentStageIndex;

                          return (
                            <div key={stage.key} className="flex flex-col items-center relative z-10">
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                                  isDone
                                    ? 'bg-primary text-white ring-4 ring-green-100'
                                    : 'bg-white border-2 border-gray-300 text-gray-400'
                                }`}
                              >
                                {isDone ? (
                                  <CheckCircle2 className="w-4 h-4" />
                                ) : (
                                  <span>{idx + 1}</span>
                                )}
                              </div>
                              <span
                                className={`text-[10px] font-semibold mt-2 text-center max-w-[70px] ${
                                  isCurrent
                                    ? 'text-primary font-bold'
                                    : isDone
                                    ? 'text-gray-800'
                                    : 'text-gray-400'
                                }`}
                              >
                                {stage.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center space-x-2 border border-red-200">
                      <Clock className="w-4 h-4" />
                      <span>This order was declined by the seller or cancelled.</span>
                    </div>
                  )}

                  {/* Two Columns: Itemized Crops & Price Ledger */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left: Crops & Producer */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Procured Harvest Items
                      </h4>
                      <div className="space-y-2">
                        {order.order_items?.map((item) => (
                          <div
                            key={item.id}
                            className="p-3 rounded-lg border bg-white flex justify-between items-center text-sm shadow-2xs"
                          >
                            <div>
                              <div className="font-bold text-gray-900">{item.products?.name}</div>
                              <div className="text-xs text-gray-500">
                                {item.quantity} {item.products?.unit} × ₹{item.unit_price}
                              </div>
                            </div>
                            <div className="font-bold text-gray-900">
                              ₹{Number(item.total_price).toLocaleString('en-IN')}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 text-xs text-gray-600 space-y-1">
                        <div>
                          Seller: <strong>{order.seller?.full_name || 'Ramesh Patel'}</strong>
                        </div>
                        <div className="flex items-start text-gray-500">
                          <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0 mt-0.5 text-gray-400" />
                          <span>Delivery to: {order.delivery_address || 'Azadpur Central Warehouse, Delhi'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Transparent Ledger Summary */}
                    <div className="p-4 rounded-xl border border-green-200 bg-green-50/50 space-y-2 text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-primary uppercase tracking-wider text-[11px]">
                          Price Settlement Ledger
                        </span>
                        <span className="flex items-center text-emerald-700 font-semibold">
                          <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" /> 0% Fee
                        </span>
                      </div>

                      <div className="flex justify-between text-gray-600">
                        <span>Harvest Subtotal</span>
                        <span className="font-semibold">₹{Number(order.subtotal).toLocaleString('en-IN')}</span>
                      </div>

                      <div className="flex justify-between text-gray-600">
                        <span>Logistics & Reefer Freight (Est.)</span>
                        <span>₹{Number(order.estimated_logistics_cost || 0).toLocaleString('en-IN')}</span>
                      </div>

                      <div className="flex justify-between text-emerald-700 font-medium">
                        <span>Kisan Direct Service Fee</span>
                        <span>₹0.00 (Zero Commission)</span>
                      </div>

                      <div className="pt-2 border-t border-green-200 flex justify-between items-center text-sm font-bold text-gray-900">
                        <span>Total Paid / Payable</span>
                        <span className="text-lg text-primary">
                          ₹{Number(order.total_amount).toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="pt-2 text-[11px] text-gray-500 border-t border-green-200/50">
                        Farmer receives 100% of harvest subtotal upon delivery confirmation.
                      </div>
                    </div>
                  </div>

                  {/* Order Action Strip for In-Transit & Delivered States */}
                  {order.status === 'in_transit' && (
                    <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="text-xs text-blue-800 font-semibold flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-blue-600 animate-pulse" />
                        <span>Shipment is currently in transit with logistics fleet partner.</span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleConfirmDelivery(order.id)}
                        disabled={confirmingOrderId === order.id}
                        className="bg-primary hover:bg-emerald-700 text-white font-bold text-xs h-9 px-4 rounded-xl shadow-xs cursor-pointer"
                      >
                        {confirmingOrderId === order.id ? 'Releasing Escrow...' : '✓ Confirm Delivery & Release Escrow'}
                      </Button>
                    </div>
                  )}

                  {(order.status === 'delivered' || order.status === 'completed') && (
                    <div className="pt-3 border-t border-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-emerald-900 bg-emerald-50/80 p-3 rounded-xl font-medium">
                      <span className="flex items-center gap-1.5 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <span>Consignment successfully received & verified at destination warehouse.</span>
                      </span>
                      <Badge variant="success" className="text-[10px] font-bold">
                        100% Escrow Released to Producer
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
